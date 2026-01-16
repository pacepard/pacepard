import { IResult } from '../../../utils/interfaces.util';
import { IBusinessDoc } from '../../users/business/business.interface';
import { Random } from '@btffamily/pacitude';
import { IPlanPaystackCode } from '../plan/plan.interface';
import planService from '../plan/plan.service';
import { ITalentDoc } from '../../users/talent/talent.interface';
import transactionService from '../transaction/transaction.service';
import userRepository from '../../users/user/user.repository';
import {
    ISubscriptionIntentDoc,
    SubscriptionIntentState,
} from './subscription intent/subscriptionIntent.interface';
import subscriptionIntentService from './subscription intent/subscriptionIntent.service';
import { newSubscriptionDTO } from './subscription.dto';
import {
    BillingFrequency,
    Currency,
    IBilling,
    ISubscriptionDoc,
    subRefStatus,
    SubscriptionStatus,
} from './subscription.interface';
import subscriptionRepository from './subscription.repository';
import businessRepository from '../business/business.repository';
import talentRepository from '../talents/talent.repository';
import planRepository from '../plan/plan.repository';

class SubscriptionService {
    /**
     * @name validateDto
     * @description helper function to validate newPlanDTO for all required fields
     * @param dto
     * @returns {Promise<IResult>} A result object indicating success or failure with an appropriate message.
     */
    public async validateDto(dto: newSubscriptionDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        const errors: { field: string; message: string }[] = [];

        const allowedCurrencies = [Currency.NGN, Currency.USD];

        const allowedSubscriptionIntervals = [
            BillingFrequency.MONTHLY,
            BillingFrequency.YEARLY,
        ];

        if (!dto.planId || dto.planId.trim() === '') {
            errors.push({
                field: 'planId',
                message: 'Plan ID is required',
            });
        }

        if (dto.currency && !allowedCurrencies.includes(dto.currency)) {
            errors.push({
                field: 'currency',
                message: `Invalid currency. Allowed currencies are: ${allowedCurrencies.join(', ')}`,
            });
        }

        if (
            dto.interval &&
            !allowedSubscriptionIntervals.includes(dto.interval)
        ) {
            errors.push({
                field: 'interval',
                message: `Invalid billing frequency. Allowed frequencies are: ${allowedSubscriptionIntervals.join(', ')}`,
            });
        }

        if (errors.length > 0) {
            result.error = true;
            result.message = 'Validation failed';
            result.data = errors;
        }

        return result;
    }

    /**
     * @name handleSubscriptionIntent
     * @description Handles the subscription intent(journey) from its Active state. Continues the state
     * @param intent The subscription intent. This already carriess full information about the plan
     * @param userProfile Profile of the user subscribing
     * @return {Promise<IResult>}
     */
    public async handleSubscriptionIntent(
        intent: ISubscriptionIntentDoc,
        userProfile: ITalentDoc | IBusinessDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        switch (intent.state) {
            case SubscriptionIntentState.CANCELED:
            case SubscriptionIntentState.FAILED:
            case SubscriptionIntentState.EXPIRED:
                return this.handleTermninalState();

            case SubscriptionIntentState.SUCCEEDED:
                return this.handleSucceededState(intent);

            case SubscriptionIntentState.INITIATED:
                return this.handleInitiatingState(intent, userProfile);

            case SubscriptionIntentState.VALIDATING:
                return this.handleValidatingState(intent, userProfile);

            case SubscriptionIntentState.AWAITING_PAYMENT:
                return this.handleAwaitingPayment(intent);

            default:
                result.error = true;
                result.message = 'Unknown subscription intent state';
                result.code = 400;
                return result;
        }
    }

    /**
     * @name handleInitiatingState
     * @description An helper function to handle a subscription intent when its state is Initiating
     * @param intent Subscription intent with state at Initiating
     * @returns
     */
    private async handleInitiatingState(
        intent: ISubscriptionIntentDoc,
        userProfile: ITalentDoc | IBusinessDoc,
    ) {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        //1. check email verification
        const { error, data: baseUser } = await userRepository.findUser(
            String(intent.userId),
        );
        if (!baseUser.isEmailVerified) {
            result.code = 403;
            result.error = true;
            result.message = 'Please verify email to complete subscription';
            return result;
        }

        const updatedIntent = await subscriptionIntentService.updateState(
            String(intent._id),
            SubscriptionIntentState.VALIDATING,
        );

        if (!updatedIntent) {
            result.error = true;
            result.message = 'Failed to update subscription intent';
            result.code = 500;
            return result;
        }

        //2. check if user has consumed a trial
        const consumeTrialResult = await this.hasNotConsumeTrial(
            updatedIntent,
            userProfile,
        );

        // true if trial has been used. false if trial hasn't been used so should proceed
        if (consumeTrialResult.error) {
            return consumeTrialResult;
        }

        //2. check against active subscription
        const activeResult = await this.hasActiveSubscription(userProfile);
        // same here if false continue, if true return to client
        if (activeResult.error) {
            activeResult.error = false;
            return activeResult;
        }

        //3. Validate plan
        if (!updatedIntent) {
            result.error = true;
            result.message = 'Failed to update subscription intent';
            result.code = 500;
            return result;
        }
        const planResult = await this.checkPlanAvailability(
            String(updatedIntent.planId),
            updatedIntent,
        );
        // make decisions base on code
        if (planResult.code === 400) {
            return planResult;
        }
        if (planResult.code === 200) {
            return planResult;
        }

        const { currency, interval } = updatedIntent;

        const { planTrial, paystackCodes } = planResult.data;

        const planCode = this.getPlanCode(currency, interval, paystackCodes);

        //4 call transaction service and return url to client

        const subReference = this.newReference(String(updatedIntent?._id));

        const transactionResult = await this.handleTransaction({
            trial: true,
            planCode,
            email: userProfile.email,
            currency,
            reference: subReference,
        });

        // change state to awaiting payment, added payment reference to the intent
        subscriptionIntentService.updateIntent(String(updatedIntent?._id), {
            state: SubscriptionIntentState.AWAITING_PAYMENT,
            transactionReference: subReference,
            metaData: {
                authUrl: transactionResult.data.authorization_url,
                mode: 'trial',
            },
        });

        return transactionResult;
    }

    /**
     * @name getPlanCode
     *@description Resolves the correct Paystack plan code based on currency and billing interval.
     * @param currency - The billing currency (e.g. NGN or USD)
     * @param interval - The billing interval (MONTHLY or YEARLY)
     * @param planCodes - Object containing all Paystack plan codes for the plan
     *
     * @returns The matching Paystack plan code
     *
     * @throws {Error} If the currency or interval is unsupported
     */
    private getPlanCode(
        currency: string,
        interval: string,
        planCodes: IPlanPaystackCode,
    ) {
        if (currency === Currency.NGN) {
            return interval === BillingFrequency.MONTHLY
                ? planCodes.nairaMonthly
                : planCodes.nairaYearly;
        }

        if (currency === Currency.USD) {
            return interval === BillingFrequency.MONTHLY
                ? planCodes.dollarMonthly
                : planCodes.dollarYearly;
        }

        throw new Error('Unsupported currency or billing interval');
    }

    /**
     * @name handleSucceededState
     * @description An helper function to handle a subscription intent when its state is succeeded
     * @param intent Subscription intent with state at succeeded
     * @returns
     */
    private async handleSucceededState(intent: ISubscriptionIntentDoc) {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const subscriptionId = intent.subscriptionId;

        const { error, data: subscription } =
            await subscriptionRepository.getSubscriptionById(subscriptionId);

        if (error) {
            result.code = 500;
            result.message =
                'Something went wrong while fetching the subscription.';
            return result;
        }

        result.message = 'Subscription already completed successfully.';
        result.data = subscription;
        return result;
    }

    /**
     * @name handleValidatingState
     * @description An helper function to handle a subscription intent when its state is Validating. This state is for mostly returning request after client/user agree to proceed. mostly duplicating code but just have too
     * @param intent Subscription intent with state at Validating
     * @returns
     */
    private async handleValidatingState(
        intent: ISubscriptionIntentDoc,
        userProfile: ITalentDoc | IBusinessDoc,
    ) {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // This state makes use of metadata to check each state of validation and continue from where it left of
        //1.skipTrial
        if (!intent.metaData?.skipTrial) {
            const consumeTrialResult = await this.hasNotConsumeTrial(
                intent,
                userProfile,
            );

            if (consumeTrialResult.error) {
                return consumeTrialResult;
            }
        }

        // add meta data to skip subscription check
        const activeResult = await this.hasActiveSubscription(userProfile);

        if (activeResult.error) {
            activeResult.error = false;
            return activeResult;
        }

        //2.proceedWithoutTrial has been set to true then no need for plan check

        const planResult = await this.checkPlanAvailability(
            intent?.planId ? String(intent.planId) : '',
            intent,
        );

        if (planResult.code === 400) {
            return planResult;
        }
        if (!intent.metaData?.proceedWithNoTrial) {
            if (planResult.code === 200) {
                return planResult;
            }
        }

        const { currency, interval } = intent;

        const { planTrial, paystackCodes } = planResult.data;

        const planCode = this.getPlanCode(currency, interval, paystackCodes);

        const subReference = this.newReference(String(intent._id));

        const transactionResult = await this.handleTransaction({
            trial: false,
            planCode,
            email: userProfile.email,
            currency,
            reference: subReference,
        });

        // change state to awaiting payment, add payment reference
        subscriptionIntentService.updateIntent(String(intent?._id), {
            state: SubscriptionIntentState.AWAITING_PAYMENT,
            transactionReference: subReference,
            metaData: {
                authUrl: transactionResult.data.authorization_url,
                mode: 'direct_charge',
            },
        });
        return transactionResult;
    }

    /**
     * @name handleAwaitingPayment
     * @description Helper function to handle subscription intent when its state is AwaitingPayment
     * @param intent Subscription intent with state at AwaitingPayment
     * @returns {Promise<IResult>}
     */
    private async handleAwaitingPayment(
        intent: ISubscriptionIntentDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // first check if transactionReference exists
        const { transactionReference } = intent;

        if (transactionReference == null) {
            subscriptionIntentService.updateState(
                String(intent._id),
                SubscriptionIntentState.FAILED,
            );
            result.error = true;
            result.code = 400;
            result.message =
                'Failed subscription process. Please kindly retry subscription process';
            return result;
        }

        // verify reference
        const status = await this.subRefStatus(transactionReference);

        switch (status) {
            case subRefStatus.SUCCESS:
                subscriptionIntentService.updateState(
                    String(intent._id),
                    SubscriptionIntentState.PAYMENT_PROCESSING,
                );
                return this.handlePaymentProcessing(intent);

            case subRefStatus.FAILED:
                subscriptionIntentService.updateState(
                    String(intent._id),
                    SubscriptionIntentState.FAILED,
                );

                result.error = true;
                result.code = 400;
                result.message =
                    'Failed subscription process. Please kindly retry subscription process';
                return result;

            case subRefStatus.ABANDONED:
            case subRefStatus.TIMEOUT:
            case subRefStatus.PENDING:
                result.message = 'Kindly proceed with checkout';
                result.data = {
                    authUrl: intent.metaData?.authUrl,
                };
                return result;
            default:
                subscriptionIntentService.updateState(
                    String(intent._id),
                    SubscriptionIntentState.FAILED,
                );

                result.error = true;
                result.code = 400;
                result.message =
                    'Failed subscription process. Please kindly retry subscription process';
                return result;
        }
    }

    /**
     * @name handlePaymentProcessing
     * @description Helper function to handle subscription intent when its state is Payment processing
     * @param intent Subscription intent with state at Payment processing
     * @returns {Promise<IResult>}
     */
    private async handlePaymentProcessing(
        intent: ISubscriptionIntentDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (intent.metaData?.paymentConfirmedAt) {
            result.message =
                'Payment already confirmed, setting up subscription';
            return result;
        }

        // first check if transactionReference exists
        const { transactionReference } = intent;

        if (transactionReference == null) {
            subscriptionIntentService.updateState(
                String(intent._id),
                SubscriptionIntentState.FAILED,
            );
            result.error = true;
            result.code = 400;
            result.message =
                'Failed subscription process. Please kindly retry subscription process';
            return result;
        }

        const { error, data } =
            await transactionService.verifyTransaction(transactionReference);

        // is transaction verified, that is webhook has been processed and all data is verified. this would happen here. transactionVerifyForSub - this would be called from db after webhook and callback has been processed and transaction marked as successful to the database.

        if (data.status !== subRefStatus.SUCCESS) {
            subscriptionIntentService.updateState(
                String(intent._id),
                SubscriptionIntentState.FAILED,
            );

            result.error = true;
            result.code = 400;
            result.message =
                'Failed subscription process. Please kindly retry subscription process';
            return result;
        }

        subscriptionIntentService.updateIntent(String(intent?._id), {
            state: SubscriptionIntentState.SUBSCRIPTION_CREATING,
            metaData: {
                paymentConfirmedAt: Date.now(),
            },
        });

        result.message = 'Payment confirmed, setting up subscription';

        // call create subscription with transaction data and things needed
        return result;

        // this should be a background process, enques creating of subscription.
    }

    /**
     * @name handleSubscriptionCreating
     * @description Helper function to handle subscription intent when its state is SubscriptionCreating
     * @param intent Subscription intent with state at SubscriptionCreating
     * @returns {Promise<IResult>}
     */
    private async handleSubscriptionCreating(
        intent: ISubscriptionIntentDoc,
        userProfile: ITalentDoc | IBusinessDoc,
        transactionData: Object,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // check for payment confirmed
        if (!intent.metaData?.paymentConfirmedAt) {
            result.error = true;
            result.code = 400;
            result.message =
                'Payment yet confirmed. cannot proceed with subscription';
            return result;
        }

        // check if subscription id exists
        if (intent.subscriptionId) {
            result.message = 'Subscription already processed';
            result.data = {
                subscriptionId: intent.subscriptionId,
            };
        }

        // create the object/billing/subscription record to save here

        const code = `SUB-${new Date().getFullYear()}-${Random.randomNum(8)}`;

        const userType = userProfile.hasOwnProperty('businessName')
            ? 'business'
            : 'talent';

        const newSubscription: ISubscriptionDoc = {
            code,
            currency: intent.currency,
            plan: intent.planId,
            subscriberId: intent.userId,
            subscriberUserType: userType,
            transactions: [transactionData?._id],
        };

        switch (intent?.metaData?.mode) {
            case 'trial':
                // set status to trialing, save authcode to metadata, schedule job to subscribe user to paystack, mark user trial as used
                newSubscription.status = SubscriptionStatus.TRIALING;
                newSubscription.metadata = {
                    authCode: transactionData?.card.authCode,
                };

                await this.updateTrialUsage(
                    userType,
                    String(userProfile._id),
                    String(intent.planId),
                );
                // schedule job to subscribe user to paystack at end of trial period

                break;
            case 'direct_charge':
                // set status to active
                newSubscription.status = SubscriptionStatus.ACTIVE;
                newSubscription.metadata = {
                    authCode: transactionData?.card.authCode,
                };
                break;
            default:
                break;
        }

        // create billing, move intent to succeeded, attach subscription id to user
        const billing: IBilling = {
            retries: 0,
            startAt: new Date(),
            paidAt: transactionData?.paidAt,
            amount: transactionData?.amount,
            frequency: intent.interval,
            isPaid: true,
        };

        let dueAt;

        if (newSubscription.status === SubscriptionStatus.TRIALING) {
            const { data: planDetails } = await planRepository.getPlanById(
                String(intent.planId),
            );
            dueAt = new Date(billing.startAt);
            dueAt.setDate(dueAt.getDate() + planDetails.trial.days);
            billing.dueAt = dueAt;
        } else if (intent.interval == BillingFrequency.MONTHLY) {
            dueAt = new Date(billing.startAt);
            dueAt.setMonth(dueAt.getMonth() + 1);
            billing.dueAt = dueAt;
        } else if (intent.interval == BillingFrequency.YEARLY) {
            dueAt = new Date(billing.startAt);
            dueAt.setFullYear(dueAt.getFullYear() + 1);
            billing.dueAt = dueAt;
        }

        billing.graceAt = new Date(
            billing.dueAt.getTime() + 5 * 24 * 60 * 60 * 1000,
        ); // 5 days grace period

        newSubscription.billing = billing;

        const { error: subError, data: createdSubscription } =
            await subscriptionRepository.addNewSubscription(newSubscription);

        if (subError) {
            throw new Error('Could not create subscription record');
        }

        await subscriptionIntentService.updateIntent(String(intent?._id), {
            state: SubscriptionIntentState.SUCCEEDED,
            subscriptionId: String(createdSubscription._id),
        });

        // attach subscription to user
        if (userType === 'business') {
            await businessRepository.updateBusiness(String(userProfile._id), {
                subscription: String(createdSubscription._id),
            });
        } else {
            await talentRepository.updateTalent(String(userProfile._id), {
                subscription: String(createdSubscription._id),
            });
        }
    }

    private async updateTrialUsage(
        userType: string,
        userId: string,
        planId: string,
    ) {
        if (userType === 'business') {
            await businessRepository.updateBusiness(String(userId), {
                trial: {
                    hasUsedTrial: true,
                    planCode: String(planId),
                    usedAt: new Date(),
                },
            });
        } else {
            // talent
            await talentRepository.updateTalent(String(userId), {
                trial: {
                    hasUsedTrial: true,
                    planCode: String(planId),
                    usedAt: new Date(),
                },
            });
        }
    }

    /**
     * @name hasActiveSubscription
     * @description if a user has active subscription, it returns error as true. if no subscription is found or user has no active subscription error is false
     * @param userProfile user profile we're checking against
     * @returns {IResult}
     */
    private async hasActiveSubscription(
        userProfile: ITalentDoc | IBusinessDoc,
    ) {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const subscriptionId = userProfile.subscription;
        if (!subscriptionId) {
            return result;
        }

        const subscriptionResult =
            await subscriptionRepository.findSubscriptionByIdOrCode(
                String(subscriptionId),
            );

        if (!subscriptionResult.error) {
            if (
                subscriptionResult.data.status === SubscriptionStatus.ACTIVE ||
                subscriptionResult.data.status === SubscriptionStatus.TRIALING
            ) {
                result.code = 400;
                result.error = true;
                result.message =
                    "You're currently on an active Subscription or on a trial";
                return result;
            }
        }

        return result;
    }

    /**
     * @name checkPlanAvailability
     * @description if a plan is available for subscription, if error is false either the plan is available for trial and we proceed to subscribe or has no trial and result has to be returned to client without proceeding alerting user that the next request will proceed
     * @param userProfile user profile we're checking against
     * @returns {IResult}
     */
    private async checkPlanAvailability(
        planId: string,
        intent: ISubscriptionIntentDoc,
    ) {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const planAvailability = await planService.getPlanAvailability(planId);

        if (!planAvailability.isAvailable) {
            result.code = 400;
            result.error = true;
            result.message = 'Plan currently not available for subscription';
            return result;
        }

        //if trial on plan is enabled
        if (planAvailability.data?.trial.enabled !== true) {
            if (!intent.metaData) intent.metaData = {};
            intent.metaData.proceedWithNoTrial = true;

            await subscriptionIntentService.updateIntent(
                String(intent?._id),
                intent,
            );
            result.error = false;
            result.message =
                'Trial not enabled on plan choosen; subscription will start with charges.';
            return result;
        }

        result.code = 202;
        result.data = planAvailability.data;
        return result;
    }

    private async hasNotConsumeTrial(
        intent: ISubscriptionIntentDoc,
        userProfile: ITalentDoc | IBusinessDoc,
    ) {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (userProfile.trial.hasUsedTrial) {
            if (!intent.metaData) intent.metaData = {};
            intent.metaData.skipTrial = true;

            await subscriptionIntentService.updateIntent(
                String(intent?._id),
                intent,
            );

            result.error = true;
            result.message =
                'Trial already used; subscription will start with charges.';
            return result;
        }

        return result;
    }

    /**
     * @name handleTermninalState
     * @description Helper function to handle subscription intent when its state is TermninalState
     * @param intent Subscription intent with state at TermninalState
     * @returns {IResult}
     */
    private handleTermninalState(): IResult {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        result.code = 409;
        result.error = true;
        result.message =
            'This subscription attempt is no longer valid. Please start a new subscription to continue.';
        return result;
    }

    /**
     * @name handleTransaction
     * @description Pass information to transaction to receive to receive payment url and payment reference
     * @param -full object with details if the transaction is to charge immediately or for card collection if you pass in amount for card tokenization and plancodes to charge immediately
     * @returns {Promise<IResult>} with data containing a url and payment reference
     */
    private async handleTransaction(dto: {
        trial: boolean;
        planCode: string;
        email: string;
        currency: Currency;
        reference: string;
    }): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (dto.trial === true) {
            // If trial is true, this is to show that subscription for the plan is on trial so we charge just for card tokenization and to save authorization
            const nairaAmount = 50;
            const cardAmount = Math.round(nairaAmount * 100); // kobo
            const paymentResult =
                await transactionService.initializeTransaction({
                    email: dto.email,
                    amount: cardAmount,
                    currency: dto.currency,
                    reference: dto.reference,
                });

            // if (paymentResult.error) {
            //     result.error = true;
            //     result.code = 500;
            //     result.message = 'Something went wrong';
            //     return result;
            // }
            return paymentResult; // already contains auth url and reference code
        }

        const paymentResult = await transactionService.initializeTransaction({
            email: dto.email,
            planCode: dto.planCode,
            reference: dto.reference,
        });

        // if (paymentResult.error) {
        //     result.error = true;
        //     result.code = 500;
        //     result.message = 'Something went wrong';
        //     return result;
        // }
        return paymentResult; // already contains auth url and reference code
    }

    /**
     * @name SubRefStatus
     * @description verify subscription reference status
     * @param {subReference} - the subscription reference
     * @returns {status: string}
     */
    private async subRefStatus(ref: string) {
        const { error, data } = await transactionService.verifyTransaction(ref);
        return data.status;
    }

    /**
     * @name newReference
     * @description Generates a unique reference for subscription and will also serves as transaction reference
     * @param {intentId} - id of the subscription intent. can later be mapped back to intent
     * @returns {string} - reference
     */
    private newReference(intentId: string) {
        if (!intentId) {
            throw new Error('newReference: intentId is required');
        }
        return `sub-${intentId}-${Random.randomCode(6, true)}`;
    }

    /**
     * @name userSubscription
     * @description Fetches the subscription details for a given user.
     * @param userProfile - The profile of the user whose subscription details are to be fetched.
     * @returns {Promise<IResult>} A promise that resolves to an IResult containing the subscription details.
     */
    public async userSubscription(
        userProfile: ITalentDoc | IBusinessDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };
        const subscriptionId = userProfile.subscription;
        if (!subscriptionId) {
            result.code = 404;
            result.error = true;
            result.message = 'No subscription found for this user.';
            return result;
        }
        const subscriptionResult =
            await subscriptionRepository.getSubscriptionById(
                String(subscriptionId),
            );
        return subscriptionResult;
    }

    /**
     * @name cancelSubscription
     * @description Cancels the subscription for a given user.
     * @param userProfile - The profile of the user whose subscription is to be cancelled.
     * @returns {Promise<IResult>} A promise that resolves to an IResult indicating the success or failure of the cancellation.
     */
    public async cancelSubscription(
        userProfile: ITalentDoc | IBusinessDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const subscriptionId = userProfile.subscription;

        if (!subscriptionId) {
            result.code = 404;
            result.error = true;
            result.message = 'No subscription found for this user.';
            return result;
        }

        const subscriptionResult =
            await subscriptionRepository.findSubscriptionByIdOrCode(
                String(subscriptionId),
            );

        if (subscriptionResult.error) {
            return subscriptionResult;
        }

        // Proceed to cancel the subscription
    }
    // /**
    //  * @name validatePlanForSub
    //  * @description Helper function to validate if plan is availabe for subscription
    //  * @param planId
    //  */
    // private async validatePlanForSub(planId: string) {
    //     const planAvailability = await planService.getPlanAvailability(planId);
    // }
}

export default new SubscriptionService();
