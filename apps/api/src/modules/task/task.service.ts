import { Types } from "mongoose";
import { dateToday, IDateToday } from "@btffamily/pacitude";
import { ITaskDoc, TaskStatus, TaskPriority } from "./task.interface";
import { CreateTaskDTO, UpdateTaskDTO } from "./task.dto";
import taskRepository from "./task.repository";
import projectRepository from "../project/project.repository";
import workspaceRepository from "../workspace/workspace.repository";
import teamRepository from "../team/team.repository";
import { IResult } from "../../utils/interfaces.util";
import { IUserDoc } from "../user/user.interface";
import { genTaskCode } from "../../utils/code.util";

class TaskService {
  public result: IResult;
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  public async createTask(
    data: CreateTaskDTO
  ): Promise<IResult<{ task: ITaskDoc; user: IUserDoc }>> {
    
    let result: IResult<{ task: ITaskDoc; user: IUserDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: {} as { task: ITaskDoc; user: IUserDoc },
    };

    const { user, workspaceId, projectId, teamId, title, description } = data;

    // 1. Context Validation
    if (!user || !workspaceId || !projectId || !teamId) {
      result.error = true; result.code = 400;
      result.message = "User, Workspace, Project, and Team context are required";
      return result;
    }

    // 2. Hierarchy Validation
    const workspaceCheck = await workspaceRepository.findById(workspaceId);
    if (workspaceCheck.error || !workspaceCheck.data) {
      result.error = true; result.code = 404;
      result.message = "Workspace not found";
      return result;
    }

    const projectCheck = await projectRepository.findById(projectId);
    if (projectCheck.error || !projectCheck.data) {
      result.error = true; result.code = 404;
      result.message = "Project not found";
      return result;
    }

    const teamCheck = await teamRepository.findTeam(teamId);
    if (teamCheck.error || !teamCheck.data) {
      result.error = true; result.code = 404;
      result.message = "Team not found";
      return result;
    }

    // 3. Strict Data Initialization
    const taskData: Partial<ITaskDoc> = {
      code: genTaskCode(),
      title: title.trim(),
      description: description.trim() || "",
      
      // Strict Hierarchy Links
      workspaceId: new Types.ObjectId(workspaceId),
      projectId: new Types.ObjectId(projectId),
      teamId: new Types.ObjectId(teamId),
      businessId: new Types.ObjectId((projectCheck.data as any).businessId),
      
      // Status & Work
      status: data.status || TaskStatus.TODO,
      priority: data.priority || TaskPriority.MEDIUM,
      
      // Assignment
      assignedTo: (data.assignedTo || []).map(id => new Types.ObjectId(id)),
      createdBy: new Types.ObjectId(user.id || user._id),

      // Metadata
      tags: data.tags || [],
      dueDate: data.dueDate,
    };

    // 4. Persistence
    const createResult = await taskRepository.createTask(taskData);
    
    if (createResult.error || !createResult.data) {
      result.error = true; result.code = 500;
      result.message = createResult.message || "Failed to persist task";
      return result;
    }

    result.message = "Task created successfully";
    result.code = 201;
    result.data = { task: createResult.data as ITaskDoc, user };
    
    return result;
  }

  /**
   * @name getTask
   * @description Retrieves a task by ID with populated relations
   */
  public async getTask(taskId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const taskResult = await taskRepository.findTask(
      taskId,
      [
        { path: 'workspaceId' },
        { path: 'businessId' },
        { path: 'projectId' },
        { path: 'teamId' },
        { path: 'assignedTo' },
        { path: 'createdBy' },
      ]
    );

    if (taskResult.error || !taskResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Task not found";
      return result;
    }

    result.data = taskResult.data;
    result.message = "Task retrieved successfully";
    return result;
  }

  /**
   * @name getTasksByProject
   * @description Retrieves all tasks for a specific project
   */
  public async getTasksByProject(projectId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: [] };

    if (!projectId) {
      result.error = true; result.code = 400;
      result.message = "Project ID is required";
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
    result.message = "Project tasks retrieved successfully";
    return result;
  }

  /**
   * @name getTasksByTeam
   * @description Retrieves all tasks for a specific team
   */
  public async getTasksByTeam(teamId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: [] };

    if (!teamId) {
      result.error = true; result.code = 400;
      result.message = "Team ID is required";
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
    result.message = "Team tasks retrieved successfully";
    return result;
  }

  /**
   * @name getTasksByAssignee
   * @description Retrieves all tasks assigned to a user
   */
  public async getTasksByAssignee(userId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: [] };

    if (!userId) {
      result.error = true; result.code = 400;
      result.message = "User ID is required";
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
    result.message = "User tasks retrieved successfully";
    return result;
  }

  /**
   * @name updateTask
   * @description Updates a task
   */
  public async updateTask(
    taskId: string,
    updateData: Partial<ITaskDoc> | UpdateTaskDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const findResult = await taskRepository.findTask(taskId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Task not found";
      return result;
    }

    const dataToUpdate: any = {};
    if (updateData.title !== undefined) {
      dataToUpdate.title = updateData.title.trim();
    }
    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description.trim();
    }
    if (updateData.status !== undefined) {
      dataToUpdate.status = updateData.status;
      if (updateData.status === TaskStatus.DONE) {
        dataToUpdate.completedAt = new Date();
      }
    }
    if (updateData.priority !== undefined) {
      dataToUpdate.priority = updateData.priority;
    }
    if (updateData.assignedTo !== undefined) {
      dataToUpdate.assignedTo = updateData.assignedTo.map((id: any) => {
        if (typeof id === "string") return new Types.ObjectId(id);
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

    const updateResult = await taskRepository.updateTask(taskId, dataToUpdate);
    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Task updated successfully";
    result.data = updateResult.data;
    return result;
  }

  /**
   * @name deleteTask
   * @description Deletes a task
   */
  public async deleteTask(taskId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const findResult = await taskRepository.findTask(taskId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Task not found";
      return result;
    }

    const deleteResult = await taskRepository.deleteTask(taskId);
    if (deleteResult.error) {
      result.error = true;
      result.code = deleteResult.code;
      result.message = deleteResult.message;
      return result;
    }

    result.message = "Task deleted successfully";
    result.data = deleteResult.data;
    return result;
  }

  /**
   * @name assignTask
   * @description Assigns a task to users
   */
  public async assignTask(
    taskId: string,
    userIds: string[]
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const findResult = await taskRepository.findTask(taskId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Task not found";
      return result;
    }

    const updateResult = await taskRepository.updateTask(taskId, {
      assignedTo: userIds.map(id => new Types.ObjectId(id))
    });

    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Task assigned successfully";
    result.data = updateResult.data;
    return result;
  }
}

export default new TaskService();
