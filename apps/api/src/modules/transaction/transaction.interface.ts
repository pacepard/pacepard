import { Document, Types } from 'mongoose';
import { ITalentDoc } from '../talents/talent.interface';
import { IBusinessDoc } from '../business/business.interface';
import { ISubscriptionDoc } from '../subscription/subscription.interface';

type ObjectId = Types.ObjectId;

export interface ITransactionDoc extends Document {
    type: TransactionType;
    status: TransactionStatus;

    label: TransactionLabel;
    description: string;
    narration: string;

    reference: string;
    resource: string;
    slug: string;

    // money
    currency: string;
    amount: number;
    unitAmount: number;
    fee: number;
    unitFee: number;

    // provider
    providerName: string;
    providerRef: string;
    providerData: Array<Record<string, any>>;

    // metadata
    metadata: Array<Record<string, any>>;
    channel: string;
    reason: string;
    message: string;

    // relations
    card: IDebitCard;
    user: any; // ObjectId | populated
    talent: ITalentDoc;
    business: IBusinessDoc;
    subscription: ISubscriptionDoc;

    // flags
    policed: boolean;

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId;
}

export enum TransactionType {
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
    REVERSAL = 'REVERSAL',
    CHARGEBACK = 'CHARGEBACK',
    ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum TransactionLabel {
    PRODUCT_PURCHASE = 'Product purchase',
    PRODUCT_REFUND = 'Product refund',
    SUBSCRIPTION_PAYMENT = 'Subscription payment',
    SUBSCRIPTION_REFUND = 'Subscription refund',
    TALENT_PAYOUT = 'Talent payout',
}
export interface IDebitCard {
    authCode: string;

    cardBin: string;
    cardLast: string;

    expiryMonth: string;
    expiryYear: string;

    //     cardPan: string; // PCI VIOLATION
    token: string;

    provider: string;
}
