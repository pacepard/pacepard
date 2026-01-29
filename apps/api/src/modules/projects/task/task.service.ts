import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { ITaskDoc, TaskStatusType, TaskPriorityType } from './task.interface';
import { CreateTaskDTO, UpdateTaskDTO } from './task.dto';
import taskRepository from './task.repository';
import projectRepository from '../project/project.repository';
import workspaceRepository from '../../core/workspace/workspace.repository';
import teamRepository from '../team/team.repository';
import { IResult } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genTaskCode } from '../../../utils/code.util';
import storageService from '../../platform/storage/storage.service';
import { IFile } from '../../../utils/interfaces.util';

class TaskService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @name createTask
     * @description Creates a task with strict hierarchy validation and membership gating for assignees.
     */
    public async createTask(
        data: CreateTaskDTO,
    ): Promise<IResult<{ task: ITaskDoc; user: IUserDoc }>> {
        // Initialize result with the required 'data' object to satisfy IResult interface
        let result: IResult<{ task: ITaskDoc; user: IUserDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { task: ITaskDoc; user: IUserDoc },
        };

        const { user, workspaceId, projectId, teamId, title, description } =
            data;

        // 1. Context Validation
        if (!user || !workspaceId || !projectId || !teamId) {
            return {
                error: true,
                code: 400,
                message:
                    'User, Workspace, Project, and Team context are required',
                data: {} as any,
            };
        }

        // 2. Hierarchy Validation
        const [workspaceCheck, projectCheck, teamCheck] = await Promise.all([
            workspaceRepository.findById(workspaceId),
            projectRepository.findById(projectId),
            teamRepository.findTeam(teamId),
        ]);

        if (workspaceCheck.error || !workspaceCheck.data) {
            return {
                error: true,
                code: 404,
                message: 'Workspace not found',
                data: {} as any,
            };
        }
        if (projectCheck.error || !projectCheck.data) {
            return {
                error: true,
                code: 404,
                message: 'Project not found',
                data: {} as any,
            };
        }
        if (teamCheck.error || !teamCheck.data) {
            return {
                error: true,
                code: 404,
                message: 'Team not found',
                data: {} as any,
            };
        }

        // 3. THE MEMBERSHIP GATE: Validate that initial assignees actually belong to this Team
        if (data.assignedTo && data.assignedTo.length > 0) {
            const team = teamCheck.data as any;
            const teamMemberIds = team.members.map((m: any) =>
                m.user.toString(),
            );

            const unauthorizedUsers = data.assignedTo.filter(
                (id) => !teamMemberIds.includes(id),
            );

            if (unauthorizedUsers.length > 0) {
                return {
                    error: true,
                    code: 403,
                    message:
                        'One or more assignees are not members of this team',
                    data: {} as any,
                };
            }
        }

        // 4. Pacepard Logic: Calculate points based on priority
        const pointsMap: Record<string, number> = {
            [TaskPriorityType.LOW]: 10,
            [TaskPriorityType.MEDIUM]: 20,
            [TaskPriorityType.HIGH]: 50,
        };

        // Handle image upload if provided
        let imageData: { fileName: string; s3Key: string } | undefined = undefined;
        if (data.image) {
            // If image is an IFile with stream, upload it
            if (typeof data.image === 'object' && (data.image as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    data.image as IFile,
                );

                if (uploadResult.error) {
                    return {
                        error: true,
                        code: uploadResult.code || 500,
                        message:
                            uploadResult.message,
                        data: {} as any,
                    };
                }

                imageData = {
                    fileName: uploadResult.data.fileName || '',
                    s3Key: uploadResult.data.s3Key || '',
                };
            } else if (typeof data.image === 'object') {
                // If it's already uploaded, check if it has s3Key
                const imageWithS3Key = data.image as any;
                if (imageWithS3Key.s3Key) {
                    imageData = {
                        fileName: imageWithS3Key.fileName || '',
                        s3Key: imageWithS3Key.s3Key,
                    };
                } else {
                    return {
                        error: true,
                        code: 400,
                        message: 'Image s3Key is required for already uploaded images',
                        data: {} as any,
                    };
                }
            } else if (typeof data.image === 'string') {
                // Legacy support: if it's a string, we can't handle it here
                return {
                    error: true,
                    code: 400,
                    message:
                        'Image must be provided as a file upload or object with s3Key',
                    data: {} as any,
                };
            }
        }

        // 5. Strict Data Initialization
        const taskData: Partial<ITaskDoc> = {
            code: genTaskCode(),
            title: title.trim(),
            description: description.trim() || '',
            points: pointsMap[data.priority || TaskPriorityType.MEDIUM] || 20,

            // Strict Hierarchy Links (The "Direct Lineage" Pattern)
            workspaceId: new Types.ObjectId(workspaceId),
            projectId: new Types.ObjectId(projectId),
            teamId: new Types.ObjectId(teamId),
            businessId: new Types.ObjectId(
                (projectCheck.data as any).businessId,
            ),

            // Status & Work
            status: data.status || TaskStatusType.TODO,
            priority: data.priority || TaskPriorityType.MEDIUM,

            // Assignment
            assignedTo: (data.assignedTo || []).map(
                (id) => new Types.ObjectId(id),
            ),
            createdBy: new Types.ObjectId(user.id || user._id),

            // Metadata
            tags: data.tags || [],
            dueDate: data.dueDate,
            image: imageData,
        };

        // 6. Persistence
        const createResult = await taskRepository.createTask(taskData);

        if (createResult.error || !createResult.data) {
            return {
                error: true,
                code: 500,
                message: createResult.message,
                data: {} as any,
            };
        }

        return {
            error: false,
            message: 'Task created successfully',
            code: 201,
            data: { task: createResult.data as ITaskDoc, user },
        };
    }

    /**
     * @name getTask
     * @description Retrieves a task by ID with populated relations
     */
    public async getTask(taskId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const taskResult = await taskRepository.findTask(taskId, [
            { path: 'workspaceId' },
            { path: 'businessId' },
            { path: 'projectId' },
            { path: 'teamId' },
            { path: 'assignedTo' },
            { path: 'createdBy' },
        ]);

        if (taskResult.error || !taskResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Task not found';
            return result;
        }

        result.data = taskResult.data;
        result.message = 'Task retrieved successfully';
        return result;
    }

    /**
     * @name getTasksByProject
     * @description Retrieves all tasks for a specific project
     */
    public async getTasksByProject(projectId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        if (!projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID is required';
            return result;
        }

        const findResult = await taskRepository.findByProject(projectId);

        if (findResult.error) {
            result.error = true;
            result.code = findResult.code;
            result.message = findResult.message;
            return result;
        }

        result.data = findResult.data;
        result.message = 'Project tasks retrieved successfully';
        return result;
    }

    /**
     * @name getTasksByTeam
     * @description Retrieves all tasks for a specific team
     */
    public async getTasksByTeam(teamId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        if (!teamId) {
            result.error = true;
            result.code = 400;
            result.message = 'Team ID is required';
            return result;
        }

        const findResult = await taskRepository.findByTeam(teamId);

        if (findResult.error) {
            result.error = true;
            result.code = findResult.code;
            result.message = findResult.message;
            return result;
        }

        result.data = findResult.data;
        result.message = 'Team tasks retrieved successfully';
        return result;
    }

    /**
     * @name getTasksByAssignee
     * @description Retrieves all tasks assigned to a user
     */
    public async getTasksByAssignee(userId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message = 'User ID is required';
            return result;
        }

        const findResult = await taskRepository.findByAssignee(userId);

        if (findResult.error) {
            result.error = true;
            result.code = findResult.code;
            result.message = findResult.message;
            return result;
        }

        result.data = findResult.data;
        result.message = 'User tasks retrieved successfully';
        return result;
    }

    /**
     * @name updateTask
     * @description Updates a task
     */
    public async updateTask(
        taskId: string,
        updateData: Partial<ITaskDoc> | UpdateTaskDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const findResult = await taskRepository.findTask(taskId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Task not found';
            return result;
        }

        const task = findResult.data as ITaskDoc;
        const dataToUpdate: any = {};
        if (updateData.title !== undefined) {
            dataToUpdate.title = updateData.title.trim();
        }
        if (updateData.description !== undefined) {
            dataToUpdate.description = updateData.description.trim();
        }
        if (updateData.status !== undefined) {
            dataToUpdate.status = updateData.status;
            if (updateData.status === TaskStatusType.DONE) {
                dataToUpdate.completedAt = new Date();
            }
        }
        if (updateData.priority !== undefined) {
            dataToUpdate.priority = updateData.priority;
        }
        if (updateData.assignedTo !== undefined) {
            dataToUpdate.assignedTo = updateData.assignedTo.map((id: any) => {
                if (typeof id === 'string') return new Types.ObjectId(id);
                if (id instanceof Types.ObjectId) return id;
                const possibleId = (id && (id._id || id.id)) || id;
                return new Types.ObjectId(possibleId as any);
            });
        }
        if (updateData.tags !== undefined) {
            dataToUpdate.tags = updateData.tags;
        }
        if (updateData.dueDate !== undefined) {
            dataToUpdate.dueDate = updateData.dueDate;
        }
        if (updateData.completedAt !== undefined) {
            dataToUpdate.completedAt = updateData.completedAt;
        }

        // Handle image upload if provided
        if (updateData.image !== undefined) {
            const oldImage = task.image;

            // If there's an old image, delete it from S3
            if (oldImage?.s3Key) {
                try {
                    await storageService.deleteFile(oldImage.s3Key);
                } catch (error) {
                    console.error('Failed to delete old image:', error);
                }
            }

            // If image is an IFile with stream, upload it
            if (typeof updateData.image === 'object' && (updateData.image as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    updateData.image as IFile,
                );

                if (uploadResult.error) {
                    result.error = true;
                    result.code = uploadResult.code || 500;
                    result.message =
                        uploadResult.message;
                    return result;
                }

                dataToUpdate.image = {
                    fileName: uploadResult.data.fileName || '',
                    s3Key: uploadResult.data.s3Key || '',
                };
            } else if (typeof updateData.image === 'object') {
                // If it's already uploaded, check if it has s3Key
                const imageWithS3Key = updateData.image as any;
                if (imageWithS3Key.s3Key) {
                    dataToUpdate.image = {
                        fileName: imageWithS3Key.fileName || '',
                        s3Key: imageWithS3Key.s3Key,
                    };
                } else {
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            } else if (typeof updateData.image === 'string') {
                // Legacy support: if it's a string, we can't handle it here
                result.error = true;
                result.code = 400;
                result.message =
                    'Image must be provided as a file upload or object with s3Key';
                return result;
            }
        }

        const updateResult = await taskRepository.updateTask(
            taskId,
            dataToUpdate,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Task updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name deleteTask
     * @description Deletes a task
     */
    public async deleteTask(taskId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const findResult = await taskRepository.findTask(taskId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Task not found';
            return result;
        }

        const deleteResult = await taskRepository.deleteTask(taskId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Task deleted successfully';
        result.data = deleteResult.data;
        return result;
    }

    /**
     * @name assignTask
     * @description Assigns a task ONLY if the user is a member of the team.
     */
    public async assignTask(
        taskId: string,
        userIds: string[],
    ): Promise<IResult> {
        // 1. Fetch Task to get the team context
        const taskResult = await taskRepository.findTask(taskId);
        if (!taskResult.data)
            return {
                error: true,
                message: 'Task not found',
                code: 404,
                data: {},
            };
        const task = taskResult.data as ITaskDoc;

        // 2. Fetch Team to check membership
        const teamResult = await teamRepository.findTeam(
            task.teamId.toString(),
        );
        const teamMembers =
            teamResult.data?.members.map((m: any) => m.user.toString()) || [];

        // 3. VALIDATION: Check if every assigned user is actually in the team
        const invalidUsers = userIds.filter((id) => !teamMembers.includes(id));
        if (invalidUsers.length > 0) {
            return {
                error: true,
                message: 'One or more users are not members of this team',
                code: 403,
                data: { invalidUsers },
            };
        }

        // 4. Persistence
        return await taskRepository.updateTask(taskId, {
            assignedTo: userIds.map((id) => new Types.ObjectId(id)),
        });
    }
}

export default new TaskService();
