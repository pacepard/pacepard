import { IUserDoc } from '../../users/user/user.interface';
import { IResponse, IQuestion } from '../../core/forms/form.interface';

export interface CreateSubmissionDTO {
    hackathonId: string;
    entryId?: string;
    formId: string;
    responses: Array<IResponse>;
    questions?: Array<IQuestion>;
    isCompleted?: boolean;
    submittedAt?: Date;
    user?: IUserDoc;
}

export interface UpdateSubmissionDTO {
    submissionId: string;
    user: IUserDoc | string;
    responses?: Array<IResponse>;
    isCompleted?: boolean;
    submittedAt?: Date;
}
