import mongoose, { Schema, Model } from 'mongoose';
import { ITaskDoc, TaskPriorityType, TaskStatusType } from './task.interface';
import { DbModels } from '../../../utils/enums.util';

const TaskSchema = new Schema<ITaskDoc>(
    {
        code: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },

        // Strict Hierarchy
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: DbModels.WORKSPACE,
            required: true,
            index: true,
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: DbModels.BUSINESS,
            required: true,
            index: true,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: DbModels.PROJECT,
            required: true,
            index: true,
        },
        teamId: {
            type: Schema.Types.ObjectId,
            ref: DbModels.TEAM,
            required: true,
            index: true,
        },

        // Status & Work
        status: {
            type: String,
            enum: Object.values(TaskStatusType),
            default: TaskStatusType.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriorityType),
            default: TaskPriorityType.MEDIUM,
        },

        // Assignment
        assignedTo: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },

        // Metadata
        tags: { type: [String], default: [] },
        dueDate: { type: Date },
        completedAt: { type: Date },
        image: {
            fileName: { type: String, default: '' },
            s3Key: { type: String, default: '' },
        },

        // System
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        _version: { type: Number, default: 0 },
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

// Indexes
TaskSchema.index({ code: 1 });
TaskSchema.index({ projectId: 1, status: 1 });
TaskSchema.index({ teamId: 1, status: 1 });
TaskSchema.index({ assignedTo: 1 });

const Task: Model<ITaskDoc> = mongoose.model<ITaskDoc>(
    DbModels.TASK,
    TaskSchema,
);
export default Task;
