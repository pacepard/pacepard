import mongoose, { Schema, Model } from 'mongoose';
import {
    IDebitCard,
    ITransactionDoc,
    TransactionLabel,
    TransactionStatus,
    TransactionType,
} from './transaction.interface';
import { DbModels } from '../../../utils/enums.util';

const DebitCardSchema = new Schema<IDebitCard>(
    {
        authCode: { type: String },

        cardBin: { type: String, required: true },
        cardLast: { type: String, required: true },

        expiryMonth: { type: String, required: true },
        expiryYear: { type: String, required: true },

        token: { type: String, required: true },
        provider: { type: String, required: true },
    },
    { _id: false }, // embedded, no separate _id
);

const TransactionSchema = new Schema<ITransactionDoc>(
    {
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(TransactionStatus),
            required: true,
            index: true,
        },

        label: {
            type: String,
            enum: Object.values(TransactionLabel),
            required: true,
        },
        description: { type: String },
        narration: { type: String },

        reference: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        resource: { type: String },
        slug: { type: String },

        // money
        currency: { type: String, required: true },
        amount: { type: Number, required: false },
        unitAmount: { type: Number },
        fee: { type: Number, default: 0 },
        unitFee: { type: Number, default: 0 },

        // provider
        providerName: { type: String, required: false },
        providerRef: { type: String, required: false },
        providerData: { type: Schema.Types.Mixed },

        // metadata
        metadata: { type: Schema.Types.Mixed },
        channel: { type: String },
        reason: { type: String },
        message: { type: String },

        // relations
        card: { type: DebitCardSchema },

        user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
        // talent: { type: Schema.Types.ObjectId, ref: DbModels.TALENT },
        // business: { type: Schema.Types.ObjectId, ref: DbModels.BUSINESS },
        userProfile: {
            type: Schema.Types.ObjectId,
            refPath: 'resource',
        },
        subscription: {
            type: Schema.Types.ObjectId,
            ref: DbModels.SUBSCRIPTION,
            index: true,
        },

        // flags
        policed: { type: Boolean, default: false },

        webhookProcessed: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            virtuals: true,
            getters: true,
            transform(doc: any, ret) {
                ret.id = ret._id;
                if ('_v' in ret) delete (ret as any)._v;
            },
        },
    },
);

const Transaction: Model<ITransactionDoc> = mongoose.model<ITransactionDoc>(
    DbModels.TRANSACTION,
    TransactionSchema,
);

export default Transaction;
