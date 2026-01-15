import mongoose, { Schema, Model, Types } from 'mongoose';
import {
    IProjectDoc,
    ProjectStatus,
    ProjectType,
    ProjectMemberRole,
} from './project.interface';
import { DbModels } from '../../../utils/enums.util';

const ProjectSchema = new Schema<IProjectDoc>(
    {
        code: { type: String, unique: true, index: true, required: true },
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, index: true },
        tagline: { type: String, default: '' },
        description: { type: String, required: true },

        items: { type: [Schema.Types.Mixed] as any, default: [] },
        documentation: { type: String, default: '' },
        image: {
            fileName: { type: String, default: '' },
            s3Key: { type: String, default: '' },
        },

        category: { type: String },
        tags: { type: [String], default: [] },
        type: {
            type: String,
            enum: Object.values(ProjectType),
            default: ProjectType.PROJECT,
        },
        status: {
            type: String,
            enum: Object.values(ProjectStatus),
            default: ProjectStatus.DRAFT,
        },
        publishedAt: { type: Date },

        isOpen: { type: Boolean, default: false },
        isClosed: { type: Boolean, default: false },
        isPublic: { type: Boolean, default: false },
        isChallenge: { type: Boolean, default: false },

        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        // Relationships
        workspace: {
            type: Schema.Types.ObjectId,
            ref: DbModels.WORKSPACE,
            required: true,
            index: true,
        },
        business: {
            type: Schema.Types.ObjectId,
            ref: DbModels.BUSINESS,
            required: true,
            index: true,
        },
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                role: {
                    type: String,
                    enum: Object.values(ProjectMemberRole),
                    default: ProjectMemberRole.CONTRIBUTOR,
                },
                joinedAt: { type: Date, default: Date.now },
                invitedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                },
                status: {
                    type: String,
                    enum: ['active', 'inactive'],
                    default: 'active',
                },
            },
        ],
        tasks: [{ type: Schema.Types.ObjectId, ref: DbModels.TASK }],
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            virtuals: true,
            transform(_doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    },
);

const Project: Model<IProjectDoc> = mongoose.model<IProjectDoc>(
    DbModels.PROJECT,
    ProjectSchema,
);

export default Project;
