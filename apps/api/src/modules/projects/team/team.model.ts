import mongoose, { Schema, Model, Types } from 'mongoose';
import { ITeamDoc, TeamMemberRole } from './team.interface';
import { DbModels } from '../../../utils/enums.util';

const TeamSchema = new Schema<ITeamDoc>(
    {
        code: { type: String, unique: true, index: true, required: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        image: {
            fileName: { type: String, default: '' },
            s3Key: { type: String, default: '' },
        },

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
        project: {
            type: Schema.Types.ObjectId,
            ref: DbModels.PROJECT,
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
                    enum: Object.values(TeamMemberRole),
                    default: TeamMemberRole.MEMBER,
                },
                joinedAt: { type: Date, default: Date.now },
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

const Team: Model<ITeamDoc> = mongoose.model<ITeamDoc>(
    DbModels.TEAM,
    TeamSchema,
);

export default Team;
