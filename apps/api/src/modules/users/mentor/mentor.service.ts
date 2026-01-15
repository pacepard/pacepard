import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { IMentorDoc, MentorTypeEnum, MentorVisibiltyEnum, MentorStatusEnum } from './mentor.interface';
import { createMentorDTO } from './mentor.dto';
import mentorRepository from './mentor.repository';
import { IResult, IFile } from '../../../utils/interfaces.util';
import { IUserDoc } from '../user/user.interface';
import { genSlug } from '../../../utils/helpers.util';
import { genMentorCode } from '../../../utils/code.util';
import storageService from '../../../services/storage.service';

class MentorService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createMentor
     * @description Creates a new mentor profile in the system.
     * @param {createMentorDTO} data - The mentor profile payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createMentor(
        data: createMentorDTO,
    ): Promise<IResult<{ mentor: IMentorDoc }>> {
        let result: IResult<{ mentor: IMentorDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { mentor: IMentorDoc },
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
            mentorImage,
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

        // Check if mentor already exists with this email
        const existingMentorResult = await mentorRepository.findOne({
            email: email.toLowerCase(),
        });
        if (
            existingMentorResult.error === false &&
            existingMentorResult.data
        ) {
            result.error = true;
            result.code = 400;
            result.message = 'Mentor profile already exists with this email';
            return result;
        }

        // Generate unique code and slug
        let mentorCode = genMentorCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await mentorRepository.findOne({
                code: mentorCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                mentorCode = genMentorCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique mentor code';
            return result;
        }

        const slug = genSlug(`${firstName}-${lastName}`);
        let uniqueSlug = slug;
        let slugAttempts = 0;
        const maxSlugAttempts = 10;

        while (slugAttempts < maxSlugAttempts) {
            const existingSlugResult = await mentorRepository.findOne({
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
        if (mentorImage) {
            // If mentorImage is an IFile with stream, upload it
            if ((mentorImage as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    mentorImage as IFile,
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
                const imageWithS3Key = mentorImage as any;
                if (imageWithS3Key.s3Key) {
                    imageData = {
                        fileName: imageWithS3Key.fileName || mentorImage.fileName || '',
                        s3Key: imageWithS3Key.s3Key || '',
                    };
                } else if (mentorImage.fileName) {
                    // If only fileName is provided, we can't use it without s3Key
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            }
        }

        const mentorData = {
            code: mentorCode,
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
            mentorType: MentorTypeEnum.ENTRY,
            visibility: visibility || MentorVisibiltyEnum.PUBLIC,
            status: status || MentorStatusEnum.ACTIVE,
            createdBy: new Types.ObjectId(data.orgId),
            settings: {},
            hackathons: [],
            entries: [],
            projects: [],
            workspace: [],
        };

        const createResult =
            await mentorRepository.createMentor(mentorData);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message =
                createResult.message || 'Failed to create mentor profile';
            return result;
        }

        result.message = 'Mentor profile created successfully';
        result.code = 201;
        result.data = { mentor: createResult.data as IMentorDoc };
        return result;
    }

    /**
     * @name getMentor
     * @description Retrieves a mentor by ID, including populated relations
     */
    public async getMentor(mentorId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const mentorResult = await mentorRepository.findMentor(
            mentorId,
            [
                { path: 'user' },
                { path: 'hackathons' },
                { path: 'entries' },
                { path: 'projects' },
                { path: 'workspace' },
                { path: 'createdBy' },
            ],
        );

        if (mentorResult.error || !mentorResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Mentor not found';
            return result;
        }

        result.data = mentorResult.data;
        result.message = 'Mentor retrieved successfully';
        return result;
    }

    /**
     * @name getMentors
     * @description Retrieves all mentors with optional filtering and pagination
     */
    public async getMentors(
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

        const mentorsResult = await mentorRepository.getMentors(
            filter,
            options,
        );

        if (mentorsResult.error) {
            result.error = true;
            result.code = mentorsResult.code || 500;
            result.message = mentorsResult.message;
            return result;
        }

        result.data = mentorsResult.data;
        result.pagination = mentorsResult.pagination;
        result.pagination!.count = mentorsResult.pagination?.count || 0;
        result.pagination!.total = mentorsResult.pagination?.total || 0;
        result.message = 'Mentors retrieved successfully';
        return result;
    }

    /**
     * @name updateMentor
     * @description Updates a mentor profile with new details
     */
    public async updateMentor(
        mentorId: string,
        data: Partial<createMentorDTO>,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the mentor
        const findResult = await mentorRepository.findMentor(mentorId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Mentor not found';
            return result;
        }

        const updateData: Partial<IMentorDoc> = {};
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
            const mentor = findResult.data as IMentorDoc;
            const socials = [...(mentor.socials || [])];
            
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
        if (data.mentorImage) {
            const mentor = findResult.data as IMentorDoc;
            const oldImage = mentor.image;

            // If there's an old image, delete it from S3
            if (oldImage?.s3Key) {
                try {
                    await storageService.deleteFile(oldImage.s3Key);
                } catch (error) {
                    // Log error but don't fail the update
                    console.error('Failed to delete old image:', error);
                }
            }

            // If mentorImage is an IFile with stream, upload it
            if ((data.mentorImage as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    data.mentorImage as IFile,
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
                const imageWithS3Key = data.mentorImage as any;
                if (imageWithS3Key.s3Key) {
                    updateData.image = {
                        fileName: imageWithS3Key.fileName || data.mentorImage.fileName || '',
                        s3Key: imageWithS3Key.s3Key || '',
                    };
                } else if (data.mentorImage.fileName) {
                    // If only fileName is provided, we can't use it without s3Key
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            }
        }

        // Update the mentor
        const updateResult = await mentorRepository.updateMentor(
            mentorId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Mentor profile updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name deleteMentor
     * @description Deletes a mentor profile
     */
    public async deleteMentor(mentorId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the mentor
        const findResult = await mentorRepository.findMentor(mentorId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Mentor not found';
            return result;
        }

        const mentor = findResult.data as IMentorDoc;

        // Delete the image from S3 if it exists
        if (mentor.image?.s3Key) {
            try {
                await storageService.deleteFile(mentor.image.s3Key);
            } catch (error) {
                // Log error but don't fail the delete
                console.error('Failed to delete image from S3:', error);
            }
        }

        // Delete the mentor
        const deleteResult = await mentorRepository.deleteMentor(mentorId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Mentor profile deleted successfully';
        result.data = deleteResult.data;
        return result;
    }
}

export default new MentorService();
