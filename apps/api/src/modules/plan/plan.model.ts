import mongoose, { Model, Schema } from 'mongoose';
import { IPlanDoc, IPlanPricing, IPlanTrial, PlanType } from './plan.interface';
import { DbModels } from '../../utils/eums.util';

const PlanTrialSchema = new Schema<IPlanTrial>(
    {
        days: { type: Number, required: true },
        enabled: { type: Boolean, required: true },
    },
    { _id: false },
);

const PlanPricingSchema = new Schema<IPlanPricing>(
    {
        naira: { type: Number, required: true },
        dollar: { type: Number, required: true },
    },
    { _id: false },
);

const LimitFrequencySchema = new Schema(
    {
        limit: { type: Number, required: true },
        frequency: { type: String, required: true },
    },
    { _id: false },
);

const PlanSchema = new Schema<IPlanDoc>(
    {
        code: { type: String, required: true, unique: true, index: true },
        label: { type: String, required: true },
        planType: {
            type: String,
            required: true,
            enum: Object.values(PlanType),
        },
        name: { type: String, required: true },
        displayName: { type: String, required: true },
        isEnabled: { type: Boolean, default: true },
        description: { type: String },

        trial: { type: PlanTrialSchema, required: true },
        pricing: { type: PlanPricingSchema, required: true },

        members: { type: LimitFrequencySchema, required: true },
        domains: { type: LimitFrequencySchema, required: true },
        projects: { type: LimitFrequencySchema, required: true },

        slug: { type: String, required: true, unique: true, index: true },

        paystackPlanCodes: {
            nairaMonthly: { type: String },
            nairaYearly: { type: String },
            dollarMonthly: { type: String },
            dollarYearly: { type: String },
        },
    },

    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            virtuals: true,
            getters: true,
            transform(_doc, ret) {
                return {
                    ...ret,
                    id: ret._id.toString(),
                };
            },
        },
    },
);

const Plan: Model<IPlanDoc> = mongoose.model<IPlanDoc>(
    DbModels.PLAN,
    PlanSchema,
);

export default Plan;
