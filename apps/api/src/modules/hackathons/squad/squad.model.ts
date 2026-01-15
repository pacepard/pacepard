import mongoose, { Schema, Model } from 'mongoose';
import { ISquadDoc, SquadMemberRole } from './squad.interface';
import { DbModels } from '../../../utils/enums.util';

const SquadSchema = new Schema<ISquadDoc>(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, default: '' },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },

        hackathon: {
            type: Schema.Types.ObjectId,
            ref: DbModels.HACKATHON,
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
                    enum: Object.values(SquadMemberRole),
                    default: SquadMemberRole.MEMBER,
                },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
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

const Squad: Model<ISquadDoc> = mongoose.model<ISquadDoc>(
    DbModels.SQUAD,
    SquadSchema,
);

export default Squad;
