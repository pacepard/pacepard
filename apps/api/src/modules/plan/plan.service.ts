import slugify from 'slugify';
import { Random } from '@btffamily/pacitude';
import { IResult } from '../../utils/interfaces.util';
import { newPlanDTO, updatePlanDTO } from './plan.dto';
import {
    IPlanPaystackCode,
    IPlanPricing,
    PlanInterval,
    PlanPriceCurrency,
    PlanType,
} from './plan.interface';
import Plan from './plan.model';
import { paystackCreatePlan } from '../paystack/paystack.service';

class PlanService {
    constructor() {}

    /**
     * @name createNewPlan
     * @description creates a new plan on platform for businesses or talents also creates plan on paystack
     * @param {newPlanDTO}
     * @returns {Promise<IResult>} A result object indicating success or failure with an appropriate message.
     *
     */
    public async createNewPlan(dto: newPlanDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };
        const {
            label,
            name,
            displayName,
            description,
            trial,
            pricing,
            members,
            domains,
            projects,
            planType,
        } = dto;

        const slug = slugify(name, { lower: true, strict: true });

        const code = `PLN-${new Date().getFullYear()}-${Random.randomNum(8)}`;

        const planPriceAmount = this.planPriceToAmount(pricing);

        // build plan object
        const planObj = {
            code,
            label,
            planType,
            name,
            displayName,
            description,
            trial,
            pricing: planPriceAmount,
            members,
            domains,
            projects,
            slug,
        };

        // save plan to db
        const newPlan = await Plan.create(planObj);

        // save plan to paystack
        const paystackPlanCodes = await this.getPaystackPlanCodes(
            newPlan.code,
            newPlan.description || '',
            newPlan.pricing,
        );
        // save plan to paystack FOR TESTING
        // const paystackPlanCodes = await this.getPaystackPlanCodes(
        //     planObj.code,
        //     planObj.description || '',
        //     planObj.pricing,
        // );

        // map paystack response to plan model updating the plan record with paystack plan code
        newPlan.paystackPlanCodes = paystackPlanCodes;
        await newPlan.save();

        // planObj.paystackPlanCodes = paystackPlanCodes;
        result.data = newPlan; // would need to map to dto later, removing mongodbId and paystack codes
        result.message = 'Plan created successfully';
        return result;
    }

    public async updatePlan(dto: updatePlanDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };
        const { planCode, updates } = dto;

        // find plan by code
        const plan = await Plan.findOne({ code: planCode });
        if (!plan) {
            result.error = true;
            result.message = 'Plan not found';
            result.code = 404;
            return result;
        }
    }

    private planPriceToAmount(pricing: IPlanPricing): IPlanPricing {
        // prepare amount
        const toMinorUnit = (amount: number) => Math.round(amount * 100);

        const newPricing = {
            naira: {
                monthly: toMinorUnit(pricing.naira.monthly),
                yearly: toMinorUnit(pricing.naira.yearly),
            },
            dollar: {
                monthly: toMinorUnit(pricing.dollar.monthly),
                yearly: toMinorUnit(pricing.dollar.yearly),
            },
        };

        return newPricing;
    }

    public async validateDto(dto: newPlanDTO): Promise<IResult> {
        let result: IResult = {
            error: true,
            message: '',
            code: 400,
            data: {},
        };
        const allowedPanTypes = [PlanType.FOR_BUSINESS, PlanType.FOR_TALENT];

        if (!dto.name) {
            result.message = 'Plan name is required';
            return result;
        }
        if (!dto.label) {
            result.message = 'Plan label is required';
            return result;
        }
        if (!dto.displayName) {
            result.message = 'Plan display name is required';
            return result;
        }
        if (!dto.planType) {
            result.message = 'Plan type is required';
            return result;
        }
        if (!allowedPanTypes.includes(dto.planType)) {
            result.message = `Invalid plan type. Allowed types are: ${allowedPanTypes.join(', ')}`;
            return result;
        }
        if (!dto.pricing) {
            result.message = 'Plan pricing is required';
            return result;
        }
        if (!dto.trial) {
            result.message = 'Plan trial information is required';
            return result;
        }
        if (!dto.members) {
            result.message = 'Plan members information is required';
            return result;
        }
        if (!dto.domains) {
            result.message = 'Plan domains information is required';
            return result;
        }
        if (!dto.projects) {
            result.message = 'Plan projects information is required';
            return result;
        }

        result.error = false;
        result.message = 'DTO is valid';
        result.code = 200;
        return result;
    }

    private async getPaystackPlanCodes(
        planCode: string,
        description: string,
        planPricing: IPlanPricing,
    ): Promise<IPlanPaystackCode> {
        const createPaystackPlan = async (
            name: string,
            amount: number,
            interval: PlanInterval,
            description: string,
            currency: PlanPriceCurrency,
        ) => {
            try {
                const res = await paystackCreatePlan({
                    name,
                    amount,
                    interval,
                    description,
                    currency,
                });
                return res?.data?.plan_code;
            } catch (error) {
                console.log(
                    `Failed to create Paystack ${currency} ${interval} plan`,
                    // error,
                );
            }
        };

        const [
            nairaMonthlyCode,
            nairaYearlyCode,
            dollarMonthlyCode,
            dollarYearlyCode,
        ] = await Promise.all([
            createPaystackPlan(
                planCode,
                planPricing.naira.monthly,
                PlanInterval.MONTHLY,
                description || '',
                PlanPriceCurrency.NAIRA,
            ),
            createPaystackPlan(
                planCode,
                planPricing.naira.yearly,
                PlanInterval.YEARLY,
                description || '',
                PlanPriceCurrency.NAIRA,
            ),
            createPaystackPlan(
                planCode,
                planPricing.dollar.monthly,
                PlanInterval.MONTHLY,
                description || '',
                PlanPriceCurrency.DOLLAR,
            ),
            createPaystackPlan(
                planCode,
                planPricing.dollar.yearly,
                PlanInterval.YEARLY,
                description || '',
                PlanPriceCurrency.DOLLAR,
            ),
        ]);

        return {
            nairaMonthly: nairaMonthlyCode,
            nairaYearly: nairaYearlyCode,
            dollarMonthly: dollarMonthlyCode,
            dollarYearly: dollarYearlyCode,
        };
    }
}
export default new PlanService();

const testNewPlan: newPlanDTO = {
    name: 'pro-business',
    label: 'PRO_BUSINESS',
    planType: PlanType.FOR_BUSINESS,
    displayName: 'Pro Business',
    description: 'Advanced plan for growing businesses with higher limits.',
    trial: {
        days: 14,
        enabled: true,
    },
    pricing: {
        naira: {
            monthly: 25000,
            yearly: 250000,
        },
        dollar: {
            monthly: 49,
            yearly: 499,
        },
    },
    members: {
        limit: 50,
        frequency: 'monthly',
    },
    domains: {
        limit: 10,
        frequency: 'lifetime',
    },
    projects: {
        limit: 100,
        frequency: 'monthly',
    },
};

new PlanService()
    .createNewPlan(testNewPlan)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.error(err);
    });
