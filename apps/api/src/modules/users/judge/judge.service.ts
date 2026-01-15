import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { IJudgeDoc, JudgeVisibiltyEnum, JudgeStatusEnum } from './judge.interface';
import { createJudgeDTO } from './judge.dto';
import judgeRepository from './judge.repository';
import { IResult, IFile } from '../../../utils/interfaces.util';
import { genSlug } from '../../../utils/helpers.util';
import { genJudgeCode } from '../../../utils/code.util';
import storageService from '../../../services/storage.service';

class JudgeService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createJudge
     * @description Creates a new judge profile in the system.
     * @param {createJudgeDTO} data - The judge profile payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createJudge(
        data: createJudgeDTO,
    ): Promise<IResult<{ judge: IJudgeDoc }>> {
        let result: IResult<{ judge: IJudgeDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { judge: IJudgeDoc },
        };

        const {
            firstName,
            lastName,
            email,
            status,
            visibility,
            jobTitle,
            organization,
            bio,
            areasOfExpertise,
            yearsOfExperience,
            judgeImage,
            linkedInUrl,
            githubUrl,
            website,
        } = data;

        if (!firstName || !lastName || !email) {
            result.error = true;
            result.code = 400;
            result.message = 'First name, last name, and email are required';
            return result;
        }

        // Check if judge already exists with this email
        const existingJudgeResult = await judgeRepository.findOne({
            email: email.toLowerCase(),
        });
        if (
            existingJudgeResult.error === false &&
            existingJudgeResult.data
        ) {
            result.error = true;
            result.code = 400;
            result.message = 'Judge profile already exists with this email';
            return result;
        }

        // Generate unique code and slug
        let judgeCode = genJudgeCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await judgeRepository.findOne({
                code: judgeCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                judgeCode = genJudgeCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique judge code';
            return result;
        }

        const slug = genSlug(`${firstName}-${lastName}`);
        let uniqueSlug = slug;
        let slugAttempts = 0;
        const maxSlugAttempts = 10;

        while (slugAttempts < maxSlugAttempts) {
            const existingSlugResult = await judgeRepository.findOne({
                slug: uniqueSlug,
            });
            if (existingSlugResult.error || !existingSlugResult.data) {
                break;
            }
            uniqueSlug = `${slug}-${slugAttempts + 1}`;
            slugAttempts++;
        }

        // Build socials array
        const socials = [];
        if (linkedInUrl) {
            socials.push({
                name: 'linkedin',
                url: linkedInUrl,
                username: linkedInUrl.split('/').pop() || '',
            });
        }
        if (githubUrl) {
            socials.push({
                name: 'github',
                url: githubUrl,
                username: githubUrl.split('/').pop() || '',
            });
        }
        if (website) {
            socials.push({
                name: 'website',
                url: website,
                username: '',
            });
        }

        // Handle image upload if provided
        let imageData = undefined;
        if (judgeImage) {
            // If judgeImage is an IFile with stream, upload it
            if ((judgeImage as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    judgeImage as IFile,
                );

                if (uploadResult.error) {
                    result.error = true;
                    result.code = uploadResult.code || 500;
                    result.message =
                        uploadResult.message || 'Failed to upload image';
                    return result;
                }

                imageData = {
                    fileName: uploadResult.data.fileName || '',
                    s3Key: uploadResult.data.s3Key || '',
                };
            } else {
                // If it's already uploaded, check if it has s3Key (from storage service response)
                const imageWithS3Key = judgeImage as any;
                if (imageWithS3Key.s3Key) {
                    imageData = {
                        fileName: imageWithS3Key.fileName || judgeImage.fileName || '',
                        s3Key: imageWithS3Key.s3Key || '',
                    };
                } else if (judgeImage.fileName) {
                    // If only fileName is provided, we can't use it without s3Key
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            }
        }

        const judgeData = {
            code: judgeCode,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            slug: uniqueSlug,
            email: email.toLowerCase().trim(),
            bio: bio || '',
            jobTitle: jobTitle || '',
            organization: organization || '',
            areasOfExpertise: areasOfExpertise || [],
            yearsOfExperience: yearsOfExperience || '',
            socials: socials,
            image: imageData,
            visibility: visibility || JudgeVisibiltyEnum.PUBLIC,
            status: status || JudgeStatusEnum.ACTIVE,
            createdBy: new Types.ObjectId(data.orgId),
            settings: {},
            hackathons: [],
            projects: [],
            workspace: [],
        };

        const createResult =
            await judgeRepository.createJudge(judgeData);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message =
                createResult.message || 'Failed to create judge profile';
            return result;
        }

        result.message = 'Judge profile created successfully';
        result.code = 201;
        result.data = { judge: createResult.data as IJudgeDoc };
        return result;
    }

    /**
     * @name getJudge
     * @description Retrieves a judge by ID, including populated relations
     */
    public async getJudge(judgeId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const judgeResult = await judgeRepository.findJudge(
            judgeId,
            [
                { path: 'user' },
                { path: 'hackathons' },
                { path: 'projects' },
                { path: 'workspace' },
                { path: 'createdBy' },
            ],
        );

        if (judgeResult.error || !judgeResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Judge not found';
            return result;
        }

        result.data = judgeResult.data;
        result.message = 'Judge retrieved successfully';
        return result;
    }

    /**
     * @name getJudges
     * @description Retrieves all judges with optional filtering and pagination
     */
    public async getJudges(
        filter?: any,
        options?: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
            populate?: string | any;
        },
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        const judgesResult = await judgeRepository.getJudges(
            filter,
            options,
        );

        if (judgesResult.error) {
            result.error = true;
            result.code = judgesResult.code || 500;
            result.message = judgesResult.message;
            return result;
        }

        result.data = judgesResult.data;
        result.pagination = judgesResult.pagination;
        result.pagination!.count = judgesResult.pagination?.count || 0;
        result.pagination!.total = judgesResult.pagination?.total || 0;
        result.message = 'Judges retrieved successfully';
        return result;
    }

    /**
     * @name updateJudge
     * @description Updates a judge profile with new details
     */
    public async updateJudge(
        judgeId: string,
        data: Partial<createJudgeDTO>,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the judge
        const findResult = await judgeRepository.findJudge(judgeId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Judge not found';
            return result;
        }

        const updateData: Partial<IJudgeDoc> = {};
        if (data.firstName !== undefined) updateData.firstName = data.firstName.trim();
        if (data.lastName !== undefined) updateData.lastName = data.lastName.trim();
        if (data.bio !== undefined) updateData.bio = data.bio;
        if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
        if (data.organization !== undefined) updateData.organization = data.organization;
        if (data.areasOfExpertise !== undefined) updateData.areasOfExpertise = data.areasOfExpertise;
        if (data.yearsOfExperience !== undefined) updateData.yearsOfExperience = data.yearsOfExperience;
        if (data.status !== undefined) updateData.status = data.status;
        if (data.visibility !== undefined) updateData.visibility = data.visibility;

        // Handle socials update
        if (data.linkedInUrl || data.githubUrl || data.website) {
            const judge = findResult.data as IJudgeDoc;
            const socials = [...(judge.socials || [])];
            
            if (data.linkedInUrl) {
                const linkedInIndex = socials.findIndex(s => s.name === 'linkedin');
                if (linkedInIndex >= 0) {
                    socials[linkedInIndex] = {
                        name: 'linkedin',
                        url: data.linkedInUrl,
                        username: data.linkedInUrl.split('/').pop() || '',
                    };
                } else {
                    socials.push({
                        name: 'linkedin',
                        url: data.linkedInUrl,
                        username: data.linkedInUrl.split('/').pop() || '',
                    });
                }
            }
            if (data.githubUrl) {
                const githubIndex = socials.findIndex(s => s.name === 'github');
                if (githubIndex >= 0) {
                    socials[githubIndex] = {
                        name: 'github',
                        url: data.githubUrl,
                        username: data.githubUrl.split('/').pop() || '',
                    };
                } else {
                    socials.push({
                        name: 'github',
                        url: data.githubUrl,
                        username: data.githubUrl.split('/').pop() || '',
                    });
                }
            }
            if (data.website) {
                const websiteIndex = socials.findIndex(s => s.name === 'website');
                if (websiteIndex >= 0) {
                    socials[websiteIndex] = {
                        name: 'website',
                        url: data.website,
                        username: '',
                    };
                } else {
                    socials.push({
                        name: 'website',
                        url: data.website,
                        username: '',
                    });
                }
            }
            updateData.socials = socials;
        }

        // Handle image update
        if (data.judgeImage) {
            const judge = findResult.data as IJudgeDoc;
            const oldImage = judge.image;

            // If there's an old image, delete it from S3
            if (oldImage?.s3Key) {
                try {
                    await storageService.deleteFile(oldImage.s3Key);
                } catch (error) {
                    // Log error but don't fail the update
                    console.error('Failed to delete old image:', error);
                }
            }

            // If judgeImage is an IFile with stream, upload it
            if ((data.judgeImage as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    data.judgeImage as IFile,
                );

                if (uploadResult.error) {
                    result.error = true;
                    result.code = uploadResult.code || 500;
                    result.message =
                        uploadResult.message || 'Failed to upload image';
                    return result;
                }

                updateData.image = {
                    fileName: uploadResult.data.fileName || '',
                    s3Key: uploadResult.data.s3Key || '',
                };
            } else {
                // If it's already uploaded, check if it has s3Key (from storage service response)
                const imageWithS3Key = data.judgeImage as any;
                if (imageWithS3Key.s3Key) {
                    updateData.image = {
                        fileName: imageWithS3Key.fileName || data.judgeImage.fileName || '',
                        s3Key: imageWithS3Key.s3Key || '',
                    };
                } else if (data.judgeImage.fileName) {
                    // If only fileName is provided, we can't use it without s3Key
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            }
        }

        // Update the judge
        const updateResult = await judgeRepository.updateJudge(
            judgeId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Judge profile updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name deleteJudge
     * @description Deletes a judge profile
     */
    public async deleteJudge(judgeId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the judge
        const findResult = await judgeRepository.findJudge(judgeId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Judge not found';
            return result;
        }

        const judge = findResult.data as IJudgeDoc;

        // Delete the image from S3 if it exists
        if (judge.image?.s3Key) {
            try {
                await storageService.deleteFile(judge.image.s3Key);
            } catch (error) {
                // Log error but don't fail the delete
                console.error('Failed to delete image from S3:', error);
            }
        }

        // Delete the judge
        const deleteResult = await judgeRepository.deleteJudge(judgeId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Judge profile deleted successfully';
        result.data = deleteResult.data;
        return result;
    }
}

export default new JudgeService();
