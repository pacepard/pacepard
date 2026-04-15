import mongoose from 'mongoose';
import { FilterQuery, UpdateQuery } from 'mongoose';
import Project from './project.model';
import { IProjectDoc } from './project.interface';
import RepositoryService from '../../internals/repository.service';
import { IResult } from '../../../utils/interfaces.util';

/**
 * Project Repository
 * Extends the generic repository with project-specific methods
 * Caching is handled at the service/controller layer, not here
 */
class ProjectRepository extends RepositoryService<IProjectDoc> {
    constructor() {
        super(Project, 'Project');
    }

    /**
     * @name findProject
     * @description Find a project by either MongoDB ObjectId or slug
     * @param input - The project ID (ObjectId or string) or slug
     * @param populate - Whether to populate related fields
     * @returns Promise<IResult>
     */
    public async findProject(
        input: string | number,
        populate:
            | boolean
            | string
            | Array<{ path: string }>
            | undefined = undefined,
    ): Promise<IResult> {
        return this.findByIdOrSlug(input, populate);
    }

    /**
     * @name getProjects
     * @param filter - Optional filter query
     * @param options - Query options (select, sort, page, limit, populate)
     * @returns {Promise<IResult>}
     * @description Get all projects with query middleware features (pagination, sorting, field selection)
     */
    public async getProjects(
        filter?: FilterQuery<IProjectDoc>,
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
     * @name createProject
     * @param projectData
     * @returns {Promise<IResult>}
     * @description Create a new project
     */
    public async createProject(
        projectData: Partial<IProjectDoc>,
    ): Promise<IResult> {
        return this.create(projectData);
    }

    /**
     * @name updateProject
     * @param id
     * @param updateData
     * @returns {Promise<IResult>}
     * @description Update a project
     */
    public async updateProject(
        id: string,
        updateData:
            | UpdateQuery<IProjectDoc>
            | Partial<IProjectDoc>
            | mongoose.UpdateQuery<IProjectDoc>,
    ): Promise<IResult> {
        return this.update(id, updateData as any);
    }

    /**
     * @name deleteProject
     * @param id
     * @returns {Promise<IResult>}
     * @description Delete a project
     */
    public async deleteProject(id: string): Promise<IResult> {
        return this.delete(id);
    }

    /**
     * @name findByWorkspace
     * @description Efficiently find all projects belonging to a workspace using the direct-reference index
     * @param workspaceId - Workspace ID
     * @returns Promise<IResult>
     */
    public async findByWorkspace(workspaceId: string): Promise<IResult> {
        return this.findAll({
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
        });
    }

    /**
     * @name addMember
     * @description Add a member to project using type-safe array operation
     * @param projectId - Project ID
     * @param userId - User ID to add
     * @param role - Role for the member
     * @returns Promise<IResult>
     */
    public async addMember(
        projectId: string,
        userId: string,
        role: string,
    ): Promise<IResult> {
        return this.pushToArray(projectId, 'members', {
            user: new mongoose.Types.ObjectId(userId),
            role: role,
            joinedAt: new Date(),
        });
    }

    /**
     * @name removeMember
     * @description Remove a member from project using type-safe array operation
     * @param projectId - Project ID
     * @param userId - User ID to remove
     * @returns Promise<IResult>
     */
    public async removeMember(
        projectId: string,
        userId: string,
    ): Promise<IResult> {
        return this.pullFromArray(projectId, 'members', {
            user: new mongoose.Types.ObjectId(userId),
        });
    }
}

export default new ProjectRepository();
