import mongoose, { Schema, Model } from 'mongoose';
import {
    IHackathonDoc,
    HackStatusType,
    HackathonType,
    HackathonMemberRole,
} from './hackathon.interface';
import { FormType } from '../../core/forms/form.interface';
import { DbModels } from '../../../utils/enums.util';

const HackathonSchema = new Schema<IHackathonDoc>(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String, required: true },
        image: { type: String, default: '' },

        status: {
            type: String,
            enum: Object.values(HackStatusType),
            default: HackStatusType.DRAFT,
        },
        type: {
            type: String,
            enum: Object.values(HackathonType),
            default: HackathonType.ONLINE,
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: DbModels.USER,
            required: true,
        },

        settings: {
            language: { type: String, default: 'en' },
            startTime: { type: String, default: '' },
            startDate: { type: String, default: '' },
            startTimeZone: { type: String, default: '' },
            isClosed: { type: String, default: 'false' },
            closeTime: { type: String, default: '' },
            closeDate: { type: String, default: '' },
            closeTimeZone: { type: String, default: '' },
            closeMessageTitle: { type: String, default: '' },
            closeMessageDescription: { type: String, default: '' },
            redirectOnClose: { type: String, default: '' },
        },

        formtype: { 
            type: String, 
            enum: Object.values(FormType),
            default: FormType.REGISTRATION 
        },

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

        forms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
        entries: [{ type: Schema.Types.ObjectId, ref: DbModels.ENTRY }],
        submissions: [
            { type: Schema.Types.ObjectId, ref: DbModels.SUBMISSION },
        ],

        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                role: {
                    type: String,
                    enum: Object.values(HackathonMemberRole),
                    required: true,
                },
                joinedAt: { type: Date, default: Date.now },
                assignedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                },
            },
        ],

        mentors: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                assignedAt: { type: Date, default: Date.now },
                assignedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                status: {
                    type: String,
                    enum: ['active', 'inactive'],
                    default: 'active',
                },
            },
        ],

        judges: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                assignedAt: { type: Date, default: Date.now },
                assignedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                status: {
                    type: String,
                    enum: ['active', 'inactive'],
                    default: 'active',
                },
            },
        ],

        organizers: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
                assignedAt: { type: Date, default: Date.now },
                assignedBy: {
                    type: Schema.Types.ObjectId,
                    ref: DbModels.USER,
                    required: true,
                },
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

const Hackathon: Model<IHackathonDoc> = mongoose.model<IHackathonDoc>(
    DbModels.HACKATHON,
    HackathonSchema,
);

export default Hackathon;
