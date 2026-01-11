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
import { ProjectStatus } from "../project/project.interface";

class TaskService {
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
  }

  /**
   * @name checkProjectActive
   * @description Private helper to enforce the "Closed Project" read-only rule.
   */
  private async checkProjectActive(projectId: string): Promise<{ active: boolean; error?: string }> {
    const project = await projectRepository.findById(projectId);
    if (!project.data) return { active: false, error: "Parent project not found" };
    
    // If project is closed, it's read-only.
    if (project.data.status === ProjectStatus.CLOSED || project.data.isClosed) {
      return { active: false, error: "Cannot modify tasks in a closed project" };
    }
    return { active: true };
  }

  /**
   * @name createTask
   */
  public async createTask(
    data: CreateTaskDTO
  ): Promise<IResult<{ task: ITaskDoc; user: IUserDoc }>> {
    const { user, workspaceId, projectId, teamId, title } = data;

    // 1. Hierarchy Validation (Direct Lineage Check)
    const [workspaceCheck, projectCheck, teamCheck] = await Promise.all([
      workspaceRepository.findById(workspaceId),
      projectRepository.findById(projectId),
      teamRepository.findTeam(teamId)
    ]);

    if (!workspaceCheck.data || !projectCheck.data || !teamCheck.data) {
      return { error: true, code: 404, message: "Hierarchy context invalid", data: {} as any };
    }

    // 2. Project Status Check
    if (projectCheck.data.status === ProjectStatus.CLOSED) {
      return { error: true, code: 400, message: "Cannot create tasks for a closed project", data: {} as any };
    }

    // 3. Membership Gate
    if (data.assignedTo && data.assignedTo.length > 0) {
      const teamMemberIds = teamCheck.data.members.map((m: any) => m.user.toString());
      const unauthorized = data.assignedTo.filter(id => !teamMemberIds.includes(id));
      if (unauthorized.length > 0) {
        return { error: true, code: 403, message: "Assignees must be team members", data: {} as any };
      }
    }

    // 4. Pacepard Points Logic
    const pointsMap = { [TaskPriority.LOW]: 10, [TaskPriority.MEDIUM]: 20, [TaskPriority.HIGH]: 50 };

    const taskData: Partial<ITaskDoc> = {
      code: genTaskCode(),
      title: title.trim(),
      description: data.description || "",
      points: pointsMap[data.priority || TaskPriority.MEDIUM] || 20,
      workspaceId: new Types.ObjectId(workspaceId),
      projectId: new Types.ObjectId(projectId),
      teamId: new Types.ObjectId(teamId),
      businessId: projectCheck.data.businessId,
      status: data.status || TaskStatus.TODO,
      priority: data.priority || TaskPriority.MEDIUM,
      assignedTo: (data.assignedTo || []).map(id => new Types.ObjectId(id)),
      createdBy: new Types.ObjectId(user.id || user._id),
      dueDate: data.dueDate,
      tags: data.tags || [],
    };

    const createResult = await taskRepository.createTask(taskData);
    return {
      error: createResult.error,
      message: createResult.message || "Task created",
      code: createResult.error ? 500 : 201,
      data: { task: createResult.data as ITaskDoc, user }
    };
  }

  /**
   * @name updateTask
   */
  public async updateTask(taskId: string, updateData: Partial<ITaskDoc> | UpdateTaskDTO): Promise<IResult> {
    const taskResult = await taskRepository.findTask(taskId);
    if (!taskResult.data) return { error: true, code: 404, message: "Task not found", data: {} };
    const task = taskResult.data as ITaskDoc;

    // Direct Lineage Gate: Check parent project status
    const projectStatus = await this.checkProjectActive(task.projectId.toString());
    if (!projectStatus.active) {
      return { error: true, code: 400, message: projectStatus.error!, data: {} };
    }

    // Map updates and handle business logic (like completion date)
    const finalUpdate: any = { ...updateData };
    if (updateData.status === TaskStatus.DONE) {
      finalUpdate.completedAt = new Date();
    }

    return await taskRepository.updateTask(taskId, finalUpdate);
  }

  /**
   * @name assignTask
   */
  public async assignTask(taskId: string, userIds: string[]): Promise<IResult> {
    const taskResult = await taskRepository.findTask(taskId);
    if (!taskResult.data) return { error: true, message: "Task not found", code: 404, data: {} };
    const task = taskResult.data as ITaskDoc;

    const projectStatus = await this.checkProjectActive(task.projectId.toString());
    if (!projectStatus.active) return { error: true, code: 400, message: projectStatus.error!, data: {} };

    // Membership Gate
    const teamResult = await teamRepository.findTeam(task.teamId.toString());
    const teamMembers = teamResult.data?.members.map((m: any) => m.user.toString()) || [];

    const invalidUsers = userIds.filter(id => !teamMembers.includes(id));
    if (invalidUsers.length > 0) {
      return { error: true, code: 403, message: "Users are not in this team", data: { invalidUsers } };
    }

    return await taskRepository.updateTask(taskId, {
      assignedTo: userIds.map(id => new Types.ObjectId(id))
    });
  }

  // Standard Getters
  public async getTask(taskId: string) { return await taskRepository.findTask(taskId, ['workspaceId', 'projectId', 'teamId', 'assignedTo']); }
  public async getTasksByProject(projectId: string) { return await taskRepository.findByProject(projectId); }
  public async getTasksByTeam(teamId: string) { return await taskRepository.findByTeam(teamId); }
  public async deleteTask(taskId: string) { return await taskRepository.deleteTask(taskId); }
}

export default new TaskService();