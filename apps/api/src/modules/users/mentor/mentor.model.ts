import mongoose, { Schema, Model } from 'mongoose';
import { IMentorDoc, MentorTypeEnum, MentorVisibiltyEnum, MentorStatusEnum, MentorInviteStatus } from './mentor.interface';
import { DbModels } from '../../../utils/enums.util';

const MentorSchema = new Schema<IMentorDoc>(
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

        mentorType: {
            type: String,
            enum: Object.values(MentorTypeEnum),
            default: MentorTypeEnum.ENTRY,
        },
        visibility: {
            type: String,
            enum: Object.values(MentorVisibiltyEnum),
            default: MentorVisibiltyEnum.PUBLIC,
        },
        status: {
            type: String,
            enum: Object.values(MentorStatusEnum),
            default: MentorStatusEnum.ACTIVE,
        },
        inviteStatus: {
            type: String,
            enum: Object.values(MentorInviteStatus),
            default: MentorInviteStatus.PENDING,
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
        entries: [{ type: Schema.Types.ObjectId, ref: DbModels.ENTRY }],
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

MentorSchema.index({ areasOfExpertise: 1 });

const Mentor: Model<IMentorDoc> = mongoose.model<IMentorDoc>(
    DbModels.MENTOR,
    MentorSchema,
);

export default Mentor;
