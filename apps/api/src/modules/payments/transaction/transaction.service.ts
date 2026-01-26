import { ITalentDoc } from '@/modules/users/talent/talent.interface';
import { IResult } from '@/utils/interfaces.util';
import {
    initializePayment,
    verifyTransaction,
} from '../paystack/paystack.service';
import { Currency } from '../subscription/subscription.interface';
import {
    NewTransactionDTO,
    PendingDTO,
    SubscriptionDTO,
} from './transaction.dto';
import {
    IDebitCard,
    InitResultType,
    PaymentInitResult,
    TransactionLabel,
    TransactionStatus,
    TransactionType,
} from './transaction.interface';
import transactionRepository from './transaction.repository';
import { IBusinessDoc } from '@/modules/users/business/business.interface';

/**
 * Responsible for handling transactions. Paystack-based
 * This service manages: transaction lifecycle, transaction initialization, verification of completed payments, webhook reconciliation
 */
class TransactionService {
    /**
     * @name initializeTransaction
     * @describtion Create a local transaction and initialize it with paystack
     * @param {SubscriptionDTO} - payload
     * @returns {Promise<IResult>}
     *
     */
    public async initializeTransaction(
        dto: SubscriptionDTO,
        userProfile: ITalentDoc | IBusinessDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { email, amount, planCode, currency, reference, callbackUrl } =
            dto;

        if (!email) {
            throw new Error('Email is required to initialize Transaction');
        }

        if (amount == null && planCode == null) {
            throw new Error(
                'Either amount or plancode must be provided to initialize transaction',
            );
        }

        if (amount != null && amount <= 0) {
            throw new Error('Amount must be positive');
        }

        // handle reference
        let referenceToUse = reference;
        if (!reference) {
            const newReference = `PCPD-TXN-${Date.now()}`;
            referenceToUse = newReference;
        }

        let responseType: PaymentInitResult;

        if (amount != null) {
            //if amount is provided initialize with amount
            const response = await initializePayment({
                email,
                amount: `${amount}`,
                currency,
                reference: referenceToUse,
                callbackUrl,
            });
            responseType = {
                type: InitResultType.AMOUNT_CHARGED,
                response,
            };
        } else {
            const response = await initializePayment({
                email,
                plan: planCode,
                currency,
                reference: referenceToUse,
                callbackUrl,
            });
            responseType = {
                type: InitResultType.PLAN_CHARGED,
                response,
            };
        }

        // create transaction locally
        const transaction = await this.createPendingTransaction(
            {
                amount: Number(amount) ?? 0,
                currency,
                reference: referenceToUse,
                userId: userProfile.user.id.toString(),
            },
            userProfile,
        );

        switch (responseType.type) {
            case InitResultType.AMOUNT_CHARGED: {
                if (!responseType.response) {
                    throw new Error('Invalid response');
                }
                if (!responseType.response?.status) {
                    result.error = true;
                    result.code = 402;
                    result.message =
                        responseType.response.message ??
                        "We're having trouble initializing your payment. Please try again shortly";
                    return result;
                }

                result.message = 'Please proceed with checkout';
                result.data = responseType.response?.data;
                return result;
            }

            case InitResultType.PLAN_CHARGED: {
                if (!responseType.response) {
                    throw new Error('Invalid response');
                }
                if (!responseType.response?.status) {
                    result.error = true;
                    result.code = 400;
                    result.message =
                        responseType.response.message ??
                        "We're having trouble initializing your payment. Please try again shortly";
                    return result;
                }

                result.message = 'Please proceed with checkout';
                result.data = responseType.response?.data;
                return result;
            }
            default:
                throw new Error('Unhandled payment init result');
        }
    }

    /**
     * @name verifyTransaction
     * @description verify a transaction with paystack after redirect or callback.
     * @param reference Paystack transaction reference
     * @returns
     */
    public async verifyTransaction(reference: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (reference == null) {
            throw new Error('Reference is required to verify transaction');
        }

        const response = await verifyTransaction(reference);

        if (!response.status) {
            result.error = true;
            result.code = 400;
        }

        // we mark transactionsuccessfull with webhook only
        // await this.markTransactionSuccessful(
        //     response.data.reference,
        //     response.data,
        // );

        result.data = {
            status: response.data.status,
            amount: response.data.amount,
            currency: response.data.currency,
            reference: response.data.reference,
            paidAt: response.data.paid_at,
            paymentMethod: response.data.channel,
            cardBrand: response.data.authorization.brand,
            cardLast4: response.data.authorization.last4,
            customer_email: response.data.customer.email,
            planName: response.data.plan_object.name,
            planInterval: response.data.plan_object.interval,
        };
        return result;
        // console.log(response.data);
    }

    /**
     * @name handleWebhook
     * @description Handle paystack webhook events. This is the final authority for transaction success or failure. Must be idempotent and signature-verified.
     * Expected events:
     * - charge.success
     * - charge.failed
     * @param payload - Raw webhook payload
     * @returns {Promise<void>}
     */
    public async handleWebhook(eventData: any): Promise<void> {
        const eventType = eventData.event;
        switch (eventType) {
            case 'charge.success':
                await this.markTransactionSuccessful(
                    eventData.data.reference,
                    eventData.data,
                );
                break;
            case 'charge.failed':
                await this.markTransactionFailed(
                    eventData.data.reference,
                    eventData.data.reason,
                );
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }
    }

    /**
     * @name markTransactionSuccessful
     * @description Mark a transaction as successful. Called only after Paystack verification or webhook confirmation.
     * @param {string} reference - Paystack reference.
     * @param {Object} providerData - Full Paystack response.
     *
     * @returns {Promise<Object>} Updated transaction.
     */
    private async markTransactionSuccessful(
        reference: string,
        providerData: any,
    ) {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // find transaction and check status
        const findResult =
            await transactionRepository.findTransactionByReference(reference);

        if (findResult.error) {
            throw new Error(
                `Transaction not found for reference: ${reference}`,
            );
        }

        const transaction = findResult.data as any;

        // compare amount and currency to avoid fraud
        if (
            transaction.amount !== providerData.amount ||
            transaction.currency !== providerData.currency
        ) {
            throw new Error(
                `Transaction amount or currency mismatch for reference: ${reference}`,
            );
        }

        if (transaction.status === TransactionStatus.SUCCESS) {
            // idempotent
            result.message = 'Transaction already marked as successful';
            result.data = transaction;
            return result;
        }

        // update transaction
        const updateTrans = {
            ...transaction,
            meta: {
                ...transaction.metadata,
            },
            status: TransactionStatus.SUCCESS,

            //relations
            card: this.cardDetails(providerData.authorization),

            // money
            unitAmount: providerData.amount / 100,
            fee: providerData.fees,
            unitFee: providerData.fees / 100,

            // metadata
            metadata: [
                // ...transaction.metadata,
                {
                    email: providerData.customer.email,
                    code: providerData.customer.customer_code,
                    planName: providerData.plan.name,
                    planCode: providerData.plan.plan_code,
                },
            ],
            channel: providerData.channel,
            reason: providerData.reason,
            message: providerData.gateway_response,

            // provider
            providerName: 'Paystack',
            providerRef: providerData.id,
            providerData: [providerData],

            policed: false,

            webhookProcessed: true,
        };

        const updateResult = await transactionRepository.updateTransaction(
            transaction._id,
            updateTrans,
        );

        console.log(updateResult);
    }

    /**
     *@name markTransactionFailed
     *@description Mark a transaction as failed. Must be safe to call multiple times.
     * @param {string} reference - Paystack reference.
     * @param {string} reason - Failure reason.
     *
     * @returns {Promise<Object>} Failed transaction.
     */
    async markTransactionFailed(reference: string, reason: string) {}

    /**
     * Retrieve a transaction by Paystack reference.
     *
     * @param {string} reference
     *
     * @returns {Promise<Object|null>} Transaction or null.
     */
    async getTransactionByReference(reference: string) {
        const result =
            await transactionRepository.findTransactionByReference(reference);
        return result;
    }

    /**
     * @name verifyPaymentForSub
     * @description Verify payment for subscription purchases.
     * @param {string} reference - Paystack reference.
     *
     * @returns {Promise<Object>} Verification result.
     */
    public async verifyPaymentForSub(reference: string): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };
        // find transaction and check status
        const findResult =
            await transactionRepository.findTransactionByReference(reference);
        if (findResult.error) {
            // transaction not found
            result.error = true;
            result.code = 404;
            result.message = `Transaction not found for reference: ${reference}`;
            return result;
        }
        const transaction = findResult.data as any;

        if (
            transaction.status === TransactionStatus.SUCCESS &&
            transaction.webhookProcessed
        ) {
            result.message = 'Transaction already marked as successful';
            result.data = transaction;
            return result;
        }
    }

    /**
     * @name createPendingTransaction
     * @description Create a local transaction with PENDING status before initializing with Paystack.
     * @param {} dto - Transaction data.
     *
     * @returns {Promise<Object>} Created transaction.
     */
    private async createPendingTransaction(
        dto: PendingDTO,
        userProfile: ITalentDoc | IBusinessDoc,
    ) {
        const result = await transactionRepository.addNewTransaction({
            type: TransactionType.PAYMENT,
            status: TransactionStatus.PENDING,
            label: TransactionLabel.SUBSCRIPTION_PAYMENT,
            description: `Subscription payment of ${dto.amount} ${dto.currency} for user ${dto.userId}`,
            reference: dto.reference,
            currency: dto.currency,
            amount: dto.amount,
            user: dto.userId,
            userProfile: userProfile,
        });

        if (result.error) {
            throw new Error(
                `Failed to create pending transaction: ${result.message}`,
            );
        }
        return result.data;
    }

    /**
     * @cardDetails Extract debit card details from Paystack authorization data.
     * @param authorizationData - Paystack authorization object.
     * @returns IDebitCard
     */
    private cardDetails(authorizationData: any): IDebitCard {
        return {
            authCode: authorizationData.authorization_code,
            cardBin: authorizationData.bin,
            cardLast: authorizationData.last4,
            cardType: authorizationData.card_type,
            cardBrand: authorizationData.brand,
            expiryMonth: authorizationData.exp_month,
            expiryYear: authorizationData.exp_year,
            token: authorizationData.token,
            cardSignature: authorizationData.signature,
            provider: 'Paystack',
        };
    }
}

export default new TransactionService();
