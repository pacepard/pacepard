import mongoose, { Schema, Model } from 'mongoose';
import { IEntryDoc, EntryType, EntryStatusType } from './entry.interface';
import { DbModels } from '../../../utils/enums.util';

const EntrySchema = new Schema<IEntryDoc>(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String, required: true },
        image: { type: String, default: '' },
        tags: [{ type: String }],
        category: { type: String, default: '' },

        entryType: {
            type: String,
            enum: Object.values(EntryType),
            default: EntryType.INDIVIDUAL,
        },
        status: {
            type: String,
            enum: Object.values(EntryStatusType),
            default: EntryStatusType.DRAFT,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },

        settings: {
            transferOwnershipTo: {
                type: Schema.Types.ObjectId,
                ref: DbModels.USER,
            },
        },

        hackathon: [
            { type: Schema.Types.ObjectId, ref: DbModels.HACKATHON },
        ],
        forms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
        submissions: [
            { type: Schema.Types.ObjectId, ref: DbModels.SUBMISSION },
        ],

        members: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
        mentors: [{ type: Schema.Types.ObjectId, ref: DbModels.GUEST }],
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

const Entry: Model<IEntryDoc> = mongoose.model<IEntryDoc>(
    DbModels.ENTRY,
    EntrySchema,
);

export default Entry;
