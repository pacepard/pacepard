import { IResult } from '../../../utils/interfaces.util';
import { initializePayment } from '../paystack/paystack.service';
import { IResult } from '../../utils/interfaces.util';
import {
    initializePayment,
    verifyTransaction,
} from '../paystack/paystack.service';
import { Currency } from '../subscription/subscription.interface';
import { NewTransactionDTO, SubscriptionDTO } from './transaction.dto';
import { InitResultType, PaymentInitResult } from './transaction.interface';

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
    public async initializeTransaction(dto: SubscriptionDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { email, amount, planCode, currency, reference } = dto;

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

        let responseType: PaymentInitResult;

        if (amount != null) {
            //if amount is provided initialize with amount
            const response = await initializePayment({
                email,
                amount: `${amount}`,
                currency,
                reference,
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
                reference,
            });
            responseType = {
                type: InitResultType.PLAN_CHARGED,
                response,
            };
        }

        switch (responseType.type) {
            case InitResultType.AMOUNT_CHARGED: {
                if (!responseType.response) {
                    throw new Error('Invalid response');
                }
                if (!responseType.response?.status) {
                    result.error = true;
                    result.code = 402;
                    result.message =
                        responseType.response.message ?? 'Payment failed';
                    return result;
                }

                //create transaction locally

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
                        'Subscription initialization failed';
                    return result;
                }

                //create transaction locally

                result.message = 'Subscription successful';
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

        // for now im returning a generic response, then i'll complete and update the local transaction

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
    public handleWebhook() {}

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
        providerData: object,
    ) {}

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
    async getTransactionByReference(reference: string) {}
}

export default new TransactionService();

// new TransactionService()
//     .initializeTransaction({
//         email: 'princessnaomi@gmail.com',
//         currency: Currency.NGN,
//         reference: 'hjkuubvcdfg',
//         planCode: 'PLN_fq936uuklutkjtx',
//     })
//     .then((result) => console.log(result));
new TransactionService().verifyTransaction('hjkuubvcdfg');
/**
 * REMINDERS
 *Design rules you must not violate (Paystack-specific)

1.Never mark success on redirect
Redirect ≠ payment
Verification or webhook only

2. Webhooks win
If verification says success but webhook later contradicts → webhook wins

3. Amount & currency must match
If Paystack returns a different amount → flag fraud, fail transaction

4. Idempotency
Webhooks will retry
Verification will be called twice

VerifyTransaction
must compare amount currency reference status
 */

//pnpm tsx watch ./src/modules/transaction/transaction.service.ts

/**
 * {
  status: true,
  message: 'Verification successful',      
  data: {
    id: 5716858631,
    domain: 'test',
    status: 'success',
    reference: 'haouefoeueoeou',
    receipt_number: null,
    amount: 25000000,
    message: null,
    gateway_response: 'Successful',        
    paid_at: '2026-01-08T19:35:26.000Z',   
    created_at: '2026-01-08T19:33:56.000Z',
    channel: 'card',
    currency: 'NGN',
    ip_address: '129.205.124.244',
    metadata: '',
    log: {
      start_time: 1767900919,
      time_spent: 7,
      attempts: 1,
      errors: 0,
      success: true,
      mobile: false,
      input: [],
      history: [Array]
    },
    fees: 200000,
    fees_split: null,
    authorization: {
      authorization_code: 'AUTH_kro3tdkea6',
      bin: '408408',
      last4: '4081',
      exp_month: '12',
      exp_year: '2030',
      channel: 'card',
      card_type: 'visa ',
      bank: 'TEST BANK',
      country_code: 'NG',
      brand: 'visa',
      reusable: true,
      signature: 'SIG_uZPyvE4g06Kvr2JWjfJ1',
      account_name: null
    },
    customer: {
      id: 331007782,
      first_name: null,
      last_name: null,
      email: 'happiness@gmail.com',
      customer_code: 'CUS_8zv1x0i5kelk47t',
      phone: null,
      metadata: null,
      risk_action: 'default',
      international_format_phone: null
    },
    plan: 'PLN_fq936uuklutkjtx',
    split: {},
    order_id: null,
    paidAt: '2026-01-08T19:35:26.000Z',
    createdAt: '2026-01-08T19:33:56.000Z',
    requested_amount: 25000000,
    pos_transaction_data: null,
    source: null,
    fees_breakdown: null,
    connect: null,
    transaction_date: '2026-01-08T19:33:56.000Z',
    plan_object: {
      id: 3388823,
      name: 'PLN-2025-06590995',
      plan_code: 'PLN_fq936uuklutkjtx',
      description: 'Advanced plan for growing businesses with higher limits.',
      amount: 25000000,
      interval: 'annually',
      send_invoices: true,
      send_sms: true,
      currency: 'NGN'
    },
    subaccount: {}
  }
}
 */
