import mongoose, { Schema, Model } from 'mongoose';
import { IWorkspaceDoc, WorkspaceMemberRole } from './workspace.interface';
import { DbModels } from '../../../utils/enums.util';

const WorkspaceSchema = new Schema<IWorkspaceDoc>(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        icon: {
            fileName: { type: String },
            s3Key: { type: String },
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },
        hackathons: [{ type: Schema.Types.ObjectId, ref: DbModels.HACKATHON }],
        projects: [{ type: Schema.Types.ObjectId, ref: DbModels.PROJECT }],
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                role: {
                    type: String,
                    enum: Object.values(WorkspaceMemberRole),
                    required: true,
                },
                joinedAt: { type: Date, default: Date.now },
                invitedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                },
            },
        ],
        invites: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                role: {
                    type: String,
                    enum: Object.values(WorkspaceMemberRole),
                    required: true,
                },
                invitedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                invitedAt: { type: Date, default: Date.now },
                expiresAt: { type: Date },
            },
        ],
        mentors: [{ type: Schema.Types.ObjectId, ref: DbModels.GUEST }],
        judges: [{ type: Schema.Types.ObjectId, ref: DbModels.GUEST }],
        allowDomainAccess: {
            type: Boolean,
            default: false,
        },
        allowedDomains: [
            {
                type: String,
                trim: true,
                lowercase: true,
            },
        ],
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

const Workspace: Model<IWorkspaceDoc> = mongoose.model<IWorkspaceDoc>(
    DbModels.WORKSPACE,
    WorkspaceSchema,
);

export default Workspace;
