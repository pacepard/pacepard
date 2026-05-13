import mongoose, { FilterQuery } from 'mongoose';
import Transaction from './transaction.model';
import { ITransactionDoc } from './transaction.interface';
import RepositoryService from '@/modules/internals/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Transaction Repository
 * Extends the generic repository with transaction-specific methods
 */
class TransactionRepository extends RepositoryService<ITransactionDoc> {
    constructor() {
        super(Transaction, 'Transaction');
    }

    /**
     * Create a new transaction
     */
    public async addNewTransaction(
        transactionData: Partial<ITransactionDoc>,
    ): Promise<IResult> {
        return this.create(transactionData);
    }

    /**
     * Update existing transaction by id
     */
    public async updateTransaction(
        transactionId: string,
        updateData: Partial<ITransactionDoc>,
    ): Promise<IResult> {
        return this.update(transactionId, updateData);
    }

    /**
     * Get transaction by id
     */
    public async getTransactionById(
        transactionId: string,
        populate = false,
    ): Promise<IResult> {
        return this.findById(transactionId, populate);
    }

    /**
     * Find transaction by either ObjectId or reference (prefers ObjectId)
     */
    public async findTransactionByIdOrReference(
        input: string,
    ): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const inputStr = String(input);

            const isObjectId =
                mongoose.Types.ObjectId.isValid(inputStr) &&
                new mongoose.Types.ObjectId(inputStr).toString() === inputStr;

            let query = isObjectId
                ? this.model.findById(inputStr)
                : this.model.findOne({
                      reference: inputStr,
                  } as FilterQuery<ITransactionDoc>);

            const document = await query.lean();

            if (!document) {
                result.error = true;
                result.code = 404;
                result.message = `${this.modelName} not found`;
            } else {
                result.message = `${this.modelName} found`;
                result.data = document;
                result.filters = isObjectId
                    ? { _id: inputStr }
                    : { reference: inputStr };
            }
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message;
        }

        return result;
    }

    /**
     * Find transaction by reference
     */
    public async findTransactionByReference(
        reference: string,
    ): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const document = await this.model.findOne({ reference }).lean();

            if (!document) {
                result.error = true;
                result.code = 404;
                result.message = `${this.modelName} not found`;
            } else {
                result.message = `${this.modelName} found`;
                result.data = document;
            }
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message;
        }

        return result;
    }

    /**
     * Retrieve list of transactions with optional filters/options
     */
    public async getTransactions(
        filterOptions: any,
        filter?: FilterQuery<ITransactionDoc>,
    ): Promise<IResult> {
        return this.findAll(filter, filterOptions);
    }

    /**
     * Find transactions by user id
     */
    public async findTransactionsByUser(userId: string): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const documents = await this.model.find({ user: userId }).lean();

            if (!documents || documents.length === 0) {
                result.error = true;
                result.code = 404;
                result.message = `No ${this.modelName.toLowerCase()} records found for user`;
                return result;
            }

            result.message = `${this.modelName} records found`;
            result.data = documents;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message;
        }

        return result;
    }

    /**
     * Find transactions by subscription id
     */
    public async findTransactionsBySubscription(
        subscriptionId: string,
    ): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            const documents = await this.model
                .find({ subscription: subscriptionId })
                .lean();

            if (!documents || documents.length === 0) {
                result.error = true;
                result.code = 404;
                result.message = `No ${this.modelName.toLowerCase()} records found for subscription`;
                return result;
            }

            result.message = `${this.modelName} records found`;
            result.data = documents;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = error.message;
        }

        return result;
    }
}

export default new TransactionRepository();
