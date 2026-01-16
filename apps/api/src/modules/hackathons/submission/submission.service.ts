import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { ISubmissionDoc } from './submission.interface';
import { CreateSubmissionDTO, UpdateSubmissionDTO } from './submission.dto';
import submissionRepository from './submission.repository';
import hackathonRepository from '../hackathon/hackathon.repository';
import entryRepository from '../entry/entry.repository';
import { IResult } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genSubmissionCode } from '../../../utils/code.util';
import permissionService from '../../authentication/permission/permission.service';

type ObjectId = Types.ObjectId;

class SubmissionService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createSubmission
     * @description Creates a new submission in the system.
     * @param {CreateSubmissionDTO} data - The submission payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createSubmission(
        data: CreateSubmissionDTO,
    ): Promise<IResult<{ submission: ISubmissionDoc }>> {
        let result: IResult<{ submission: ISubmissionDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { submission: ISubmissionDoc },
        };

        const { hackathonId, formId, responses, user, entryId, isCompleted } =
            data;

        if (!hackathonId) {
            result.error = true;
            result.code = 400;
            result.message = 'Hackathon ID is required';
            return result;
        }

        if (!formId) {
            result.error = true;
            result.code = 400;
            result.message = 'Form ID is required';
            return result;
        }

        if (!responses || responses.length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Responses are required';
            return result;
        }

        const userId = user?._id || user?.id;
        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message =
                'User information is required to create a submission';
            return result;
        }

        // Validate hackathon exists
        const hackathonCheck = await hackathonRepository.findById(hackathonId);
        if (hackathonCheck.error || !hackathonCheck.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        // Validate entry exists if provided
        if (entryId) {
            const entryCheck = await entryRepository.findById(entryId);
            if (entryCheck.error || !entryCheck.data) {
                result.error = true;
                result.code = 404;
                result.message = 'Entry not found';
                return result;
            }
        }

        // Generate unique submission code
        let submissionCode = genSubmissionCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure code uniqueness
        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await submissionRepository.findOne({
                code: submissionCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                submissionCode = genSubmissionCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique submission code';
            return result;
        }

        const submissionData = {
            code: submissionCode,
            isCompleted: isCompleted || false,
            submittedAt: data.submittedAt || new Date(),
            respondent: new Types.ObjectId(userId),
            responses: responses,
            hackathon: new Types.ObjectId(hackathonId),
            entry: entryId ? new Types.ObjectId(entryId) : undefined,
            questions: data.questions || [],
            form: new Types.ObjectId(formId),
        };

        const createResult =
            await submissionRepository.createSubmission(submissionData);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message =
                createResult.message || 'Failed to create submission';
            return result;
        }

        result.message = 'Submission created successfully';
        result.code = 201;
        result.data = { submission: createResult.data as ISubmissionDoc };
        return result;
    }

    /**
     * @name updateSubmission
     * @description Updates a submission with new details
     * @param data - UpdateSubmissionDTO containing submissionId, user, and update data
     */
    public async updateSubmission(data: UpdateSubmissionDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { submissionId, user } = data;

        // Find the submission
        const findResult = await submissionRepository.findById(submissionId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Submission not found';
            return result;
        }

        const submission = findResult.data as ISubmissionDoc;

        // Check permissions - only the respondent can update their submission
        const respondentId = typeof submission.respondent === 'object'
            ? String(submission.respondent._id || submission.respondent.id)
            : String(submission.respondent);

        const userId = typeof user === 'object' ? String(user._id || user.id) : String(user);

        if (respondentId !== userId) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to update this submission';
            return result;
        }

        const updateData: Partial<ISubmissionDoc> = {};
        if (data.responses !== undefined) {
            updateData.responses = data.responses as any;
        }
        if (data.isCompleted !== undefined) {
            updateData.isCompleted = data.isCompleted;
        }
        if (data.submittedAt !== undefined) {
            updateData.submittedAt = data.submittedAt;
        }

        // Update the submission
        const updateResult = await submissionRepository.updateSubmission(
            submissionId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Submission updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getSubmission
     * @description Retrieves a submission by ID, including populated relations
     */
    public async getSubmission(submissionId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const submissionResult = await submissionRepository.findSubmission(
            submissionId,
            [
                { path: 'respondent' },
                { path: 'hackathon' },
                { path: 'entry' },
                { path: 'form' },
            ],
        );

        if (submissionResult.error || !submissionResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Submission not found';
            return result;
        }

        result.data = submissionResult.data;
        result.message = 'Submission retrieved successfully';
        return result;
    }

    /**
     * @name getSubmissions
     * @description Retrieves all submissions with optional filtering and pagination
     */
    public async getSubmissions(
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

        const submissionsResult = await submissionRepository.getSubmissions(
            filter,
            options,
        );

        if (submissionsResult.error) {
            result.error = true;
            result.code = submissionsResult.code || 500;
            result.message = submissionsResult.message;
            return result;
        }

        result.data = submissionsResult.data;
        result.pagination = submissionsResult.pagination;
        result.pagination!.count = submissionsResult.pagination?.count || 0;
        result.pagination!.total = submissionsResult.pagination?.total || 0;
        result.message = 'Submissions retrieved successfully';
        return result;
    }

    /**
     * @name deleteSubmission
     * @description Deletes a submission
     * @param submissionId - The submission ID
     * @param user - Optional user for permission checking
     */
    public async deleteSubmission(
        submissionId: string,
        user?: IUserDoc | string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the submission
        const findResult = await submissionRepository.findById(submissionId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Submission not found';
            return result;
        }

        const submission = findResult.data as ISubmissionDoc;

        // Check permissions if user is provided - only respondent can delete
        if (user) {
            const respondentId = typeof submission.respondent === 'object'
                ? String(submission.respondent._id || submission.respondent.id)
                : String(submission.respondent);

            const userId = typeof user === 'object' ? String(user._id || user.id) : String(user);

            if (respondentId !== userId) {
                result.error = true;
                result.code = 403;
                result.message = 'You do not have permission to delete this submission';
                return result;
            }
        }

        // Delete the submission
        const deleteResult =
            await submissionRepository.deleteSubmission(submissionId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Submission deleted successfully';
        result.data = deleteResult.data;
        return result;
    }
}

export default new SubmissionService();
