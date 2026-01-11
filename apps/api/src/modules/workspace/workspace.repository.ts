import { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import Workspace from './workspace.model';
import { IWorkspaceDoc } from './workspace.interface';
import RepositoryService from '../../services/repository.service';
import { IResult } from '../../utils/interfaces.util';

/**
 * Workspace Repository
 * Extends the generic repository with workspace-specific methods
 */
class WorkspaceRepository extends RepositoryService<IWorkspaceDoc> {
    constructor() {
        super(Workspace, 'Workspace');
    }

    /**
     * @name findWorkspace
     * @description Find a workspace by either MongoDB ObjectId or code
     * @param input - The workspace ID (ObjectId or string) or code
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findWorkspace(
        input: string | number,
        populate: boolean | Array<{ path: string }> = false,
    ): Promise<IResult> {
        const result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        try {
            // normalize input to string to satisfy Mongoose ObjectId APIs
            const inputStr = String(input);

            const isObjectId =
                mongoose.Types.ObjectId.isValid(inputStr) &&
                new mongoose.Types.ObjectId(inputStr).toString() === inputStr;

            let query = isObjectId
                ? this.model.findById(inputStr)
                : this.model.findOne({
                      code: inputStr,
                  } as FilterQuery<IWorkspaceDoc>);

            if (populate) {
                const dataPop = Array.isArray(populate) ? populate : [];
                if (dataPop.length > 0) {
                    query = query.populate(dataPop);
                } else {
                    query = query.populate('');
                }
            }

            const document = await query.lean();

            if (!document) {
                result.error = true;
                result.code = 404;
                result.message = 'Workspace not found';
            } else {
                result.message = 'Workspace found';
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
     * @name getWorkspaces
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all workspaces with query middleware features (pagination, sorting, field selection)
     */
    public async getWorkspaces(
        filter?: any,
        options?: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
            populate?: string | any;
        },
    ): Promise<IResult> {
        if (options) {
            return this.findAll(filter || {}, options);
        }
        return this.findAll(filter);
    }

    /**
     * @name createWorkspace
     * @param workspaceData
     * @returns {Promise<IResult>}
     * @description Create a new workspace
     */
    public async createWorkspace(
        workspaceData: Partial<IWorkspaceDoc>,
    ): Promise<IResult> {
        return this.create(workspaceData);
    }

    /**
     * @name updateWorkspace
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a workspace
     */
    public async updateWorkspace(
        id: string,
        updateData: Partial<IWorkspaceDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData);
    }

    /**
     * @name deleteWorkspace
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a workspace
     */
    public async deleteWorkspace(id: string): Promise<IResult> {
        return this.delete(id);
    }
}

export default new WorkspaceRepository();
