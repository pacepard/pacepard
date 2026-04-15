import mongoose from 'mongoose';
import Task from './task.model';
import { ITaskDoc } from './task.interface';
import RepositoryService from '../../internals/repository.service';
import { IResult } from '../../../utils/interfaces.util';

class TaskRepository extends RepositoryService<ITaskDoc> {
    constructor() {
        super(Task, 'Task');
    }

    /**
     * @name findTask
     * @description Find a task by ID
     */
    public async findTask(
        taskId: string,
        populate: boolean | Array<{ path: string }> = false,
    ): Promise<IResult> {
        return this.findById(taskId, populate);
    }

    /**
     * @name findByProject
     * @description Find all tasks belonging to a project
     */
    public async findByProject(projectId: string): Promise<IResult> {
        return this.findAll({
            projectId: new mongoose.Types.ObjectId(projectId),
        });
    }

    /**
     * @name findByTeam
     * @description Find all tasks belonging to a team
     */
    public async findByTeam(teamId: string): Promise<IResult> {
        return this.findAll({
            teamId: new mongoose.Types.ObjectId(teamId),
        });
    }

    /**
     * @name findByWorkspace
     * @description Find all tasks belonging to a workspace
     */
    public async findByWorkspace(workspaceId: string): Promise<IResult> {
        return this.findAll({
            workspaceId: new mongoose.Types.ObjectId(workspaceId),
        });
    }

    /**
     * @name findByAssignee
     * @description Find all tasks assigned to a user
     */
    public async findByAssignee(userId: string): Promise<IResult> {
        return this.findAll({
            assignedTo: new mongoose.Types.ObjectId(userId),
        });
    }

    /**
     * @name createTask
     * @description Create a new task
     */
    public async createTask(taskData: Partial<ITaskDoc>): Promise<IResult> {
        return this.create(taskData);
    }

    /**
     * @name updateTask
     * @description Update a task
     */
    public async updateTask(taskId: string, updateData: any): Promise<IResult> {
        return this.update(taskId, updateData);
    }

    /**
     * @name deleteTask
     * @description Delete a task
     */
    public async deleteTask(taskId: string): Promise<IResult> {
        return this.delete(taskId);
    }

    /**
     * @name updateMany
     * @description Update multiple tasks matching the filter
     * @param filter - Filter query to match tasks to update
     * @param updateData - Data to update (can use MongoDB update operators)
     * @returns Promise<IResult>
     */
    public async updateMany(filter: any, updateData: any): Promise<IResult> {
        return super.updateMany(filter, updateData);
    }

    /**
     * @name deleteMany
     * @description Delete multiple tasks matching the filter
     * @param filter - Filter query to match tasks to delete
     * @returns Promise<IResult>
     */
    public async deleteMany(filter: any): Promise<IResult> {
        return super.deleteMany(filter);
    }
}

export default new TaskRepository();
