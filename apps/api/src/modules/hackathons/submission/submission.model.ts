import mongoose, { Schema, Model } from 'mongoose';
import { ISubmissionDoc } from './submission.interface';
import { DbModels } from '../../../utils/enums.util';

const SubmissionSchema = new Schema<ISubmissionDoc>(
    {
        code: { type: String, required: true, unique: true },
        isCompleted: { type: Boolean, default: false },
        submittedAt: { type: Date },

        respondent: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },

        responses: [{ type: Schema.Types.Mixed }],

        hackathon: {
            type: Schema.Types.ObjectId,
            ref: DbModels.HACKATHON,
            required: true,
            index: true,
        },

        entry: {
            type: Schema.Types.ObjectId,
            ref: DbModels.ENTRY,
            index: true,
        },

        questions: [{ type: Schema.Types.Mixed }],

        form: {
            type: Schema.Types.ObjectId,
            ref: 'Form',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            virtuals: true,
            getters: true,
            transform(_doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    },
);

const Submission: Model<ISubmissionDoc> = mongoose.model<ISubmissionDoc>(
    DbModels.SUBMISSION,
    SubmissionSchema,
);

export default Submission;
