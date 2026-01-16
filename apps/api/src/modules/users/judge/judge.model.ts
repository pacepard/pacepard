import mongoose, { Schema, Model } from 'mongoose';
import { IJudgeDoc, JudgeVisibiltyEnum, JudgeStatusEnum, JudgeInviteStatus } from './judge.interface';
import { DbModels } from '../../../utils/enums.util';

const JudgeSchema = new Schema<IJudgeDoc>(
    {
        code: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        email: { type: String, required: true, lowercase: true, index: true },

        bio: { type: String },
        jobTitle: { type: String },
        organization: { type: String },
        areasOfExpertise: { type: [String], default: [] },
        yearsOfExperience: { type: String },
        socials: [{
            name: { type: String, required: true },
            url: { type: String, required: true },
            username: { type: String },
        }],

        image: {
            fileName: { type: String },
            s3Key: { type: String },
        },

        visibility: {
            type: String,
            enum: Object.values(JudgeVisibiltyEnum),
            default: JudgeVisibiltyEnum.PUBLIC,
        },
        status: {
            type: String,
            enum: Object.values(JudgeStatusEnum),
            default: JudgeStatusEnum.ACTIVE,
        },
        inviteStatus: {
            type: String,
            enum: Object.values(JudgeInviteStatus),
            default: JudgeInviteStatus.PENDING,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },

        settings: { type: Schema.Types.Mixed, default: {} },

        user: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
        },
        hackathons: [{ type: Schema.Types.ObjectId, ref: DbModels.HACKATHON }],
        projects: [{ type: Schema.Types.ObjectId, ref: DbModels.PROJECT }],
        workspace: [{ type: Schema.Types.ObjectId, ref: DbModels.WORKSPACE }],
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            virtuals: true,
            getters: true,
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

JudgeSchema.index({ areasOfExpertise: 1 });

const Judge: Model<IJudgeDoc> = mongoose.model<IJudgeDoc>(
    DbModels.JUDGE,
    JudgeSchema,
);

export default Judge;
