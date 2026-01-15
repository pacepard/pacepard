import { Document, Types } from 'mongoose';
import { IUserDoc } from '../../users/user/user.interface';
import { IBlock, IQuestion, IResponse } from '../../core/forms/form.interface';
import { IFormDoc } from '../../core/forms/form.interface';
import { IEntryDoc } from '../entry/entry.interface';
import { IHackathonDoc } from '../hackathon/hackathon.interface';

type ObjectId = Types.ObjectId;

// Submissions are the top level container for a submission
// They contain responses, questions, form, entry, hackathon, and members
// They are used to manage the lifecycle of a submission
export interface ISubmissionDoc extends Document {
    code: string;

    isCompleted: boolean;
    submittedAt: Date;
    
    

    // relationships
    respondent: IUserDoc | any; // user who submitted the submission
    responses: Array<IResponse>; // responses to the questions

    hackathon: IHackathonDoc | any; // hackathon that the submission is part of
    entry: IEntryDoc | any; // entry that the submission is part of
    questions: Array<IQuestion>; // questions that the submission is part of
    form: IFormDoc | any; // form that the submission is part of

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}
