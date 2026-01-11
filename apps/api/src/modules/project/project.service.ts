import mongoose, { Types } from "mongoose";
import { dateToday, IDateToday } from "@btffamily/pacitude";
import { IProjectDoc, ProjectStatus, ProjectCreatorType } from "./project.interface";
import { CreateProjectDTO } from "./project.dto";
import projectRepository from "./project.repository";
import businessRepository from "../business/business.repository";
import { IResult } from "../../utils/interfaces.util";
import { IUserDoc } from "../user/user.interface";
import { genSlug } from "../../utils/helpers.util";
import { genProjectCode } from "../../utils/code.util";
import teamRepository from "../team/team.repository";
import taskRepository from "../task/task.repository";
// import invitationService from "../invitation/invitation.service";

class ProjectService {
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
  }

  /**
   * @name createProject
   * @description Initializes a project with strict lineage.
   */
  public async createProject(data: CreateProjectDTO): Promise<IResult> {
    const { user, workspaceId, title, description } = data;

    const businessCheck = await businessRepository.findOne({ 
      user: user.id || user._id,
      workspaces: { $in: [new Types.ObjectId(workspaceId)] } 
    });

    if (businessCheck.error || !businessCheck.data) {
      return { error: true, message: "Authorized Business profile not found", code: 403, data: {} };
    }

    const projectData: Partial<IProjectDoc> = {
      code: genProjectCode(),
      title: title.trim(),
      slug: genSlug(title),
      tagline: data.tagline || "",
      description: description.trim(),
      workspaceId: new Types.ObjectId(workspaceId),
      businessId: businessCheck.data._id,
      createdBy: new Types.ObjectId(user.id || user._id),
      creatorType: user.isAdmin ? ProjectCreatorType.ADMIN : ProjectCreatorType.BUSINESS,
      status: ProjectStatus.DRAFT,
      members: [], 
      items: data.items || [],
    };

    return await projectRepository.createProject(projectData);
  }

  /**
   * @name inviteMember
   * @description Integration with your colleague's InvitationService.
   * This initiates the process but does NOT add them to the DB yet.
   */
  public async inviteMember(projectId: string, email: string, role: string, inviter: IUserDoc): Promise<IResult> {
    const project = await projectRepository.findById(projectId);
    if (!project.data) return { error: true, message: "Project not found", code: 404, data: {} };

    // Trigger external invitation module logic
    // return await invitationService.sendInvitation({
    //   email,
    //   role,
    //   resourceId: projectId,
    //   resourceType: 'PROJECT',
    //   invitedBy: inviter.id
    // });
    
    return { error: false, message: "Invitation logic triggered", code: 200, data: {} };
  }

  /**
   * @name addMember
   * @description Finalizes membership. Used as a callback for the Invitation system.
   * Uses $addToSet for idempotent (duplicate-safe) updates.
   */
  public async addMember(projectId: string, userId: string, role: string): Promise<IResult> {
    const update = {
      $addToSet: { 
        members: { 
          user: new Types.ObjectId(userId), 
          role: role, 
          joinedAt: new Date() 
        } 
      }
    };

    const result = await projectRepository.updateProject(projectId, update as any);
    if (result.error) return result;

    return { error: false, message: "Member successfully added to project", code: 200, data: result.data };
  }

  /**
   * @name publishProject
   * @description Transitions a project from DRAFT to OPEN/PUBLISHED status.
   */
  public async publishProject(projectId: string): Promise<IResult> {
    // 1. Fetch current project state
    const project = await projectRepository.findById(projectId);
    if (!project.data) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    // 2. Business Rule: Cannot publish a project that is already closed or deleted
    if (project.data.status === ProjectStatus.CLOSED) {
      return { error: true, message: "Cannot publish a closed project", code: 400, data: {} };
    }

    // 3. Optional: Add a "Ready to Publish" check
    // e.g., Ensuring there is at least a description or a title
    if (!project.data.description || project.data.description.length < 10) {
      return { 
        error: true, 
        message: "Project description is too short to publish", 
        code: 400, 
        data: {} 
      };
    }

    // 4. Update the status
    const update = {
      status: ProjectStatus.PUBLISHED, 
      publishedAt: new Date(),
      isOpen: true
    };

    const result = await projectRepository.updateProject(projectId, update as any);
    
    if (result.error) return result;

    return {
      error: false,
      message: "Project is now live and visible to members",
      code: 200,
      data: result.data
    };
  }

  /**
   * @name updateProject
   * @description Strict whitelist update to prevent unauthorized field modification.
   */
public async updateProject(projectId: string, updateData: Partial<IProjectDoc>): Promise<IResult> {
    const project = await projectRepository.findById(projectId);
    if (!project.data) return { error: true, message: "Project not found", code: 404, data: {} };

    if (project.data.status === ProjectStatus.CLOSED) {
      return { error: true, message: "Cannot modify a closed project", code: 400, data: {} };
    }

    // 1. Explicitly type the allowed keys array
    const allowed: (keyof IProjectDoc)[] = [
      'title', 'description', 'tagline', 'category', 'tags', 'image', 'items'
    ];

    const finalUpdate: Partial<IProjectDoc> = {};

    // 2. Use the typed key in the loop
    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        // We cast to 'any' only for the assignment to handle the mixed types 
        // (strings, arrays, etc.) within the IProjectDoc interface safely
        const value = updateData[key];
        (finalUpdate as any)[key] = (typeof value === 'string') ? value.trim() : value;

        if (key === 'title' && typeof value === 'string') {
          finalUpdate.slug = genSlug(value);
        }
      }
    }

    return await projectRepository.updateProject(projectId, finalUpdate);
  }

/**
   * @name getProject
   * @description Retrieves a project by its ID or Slug.
   * Includes population for members and other related data.
   */
  public async getProject(idOrSlug: string): Promise<IResult> {
    // We use findByIdOrSlug from the repository base
    // You can pass an array of paths to populate related data
    const populatePaths = [
      { path: 'members.user', select: 'firstName lastName email profileImage' },
      { path: 'workspaceId', select: 'name' }
    ];

    const result = await projectRepository.findByIdOrSlug(idOrSlug, populatePaths);

    if (result.error) {
      return result;
    }

    return {
      error: false,
      message: "Project retrieved successfully",
      code: 200,
      data: result.data
    };
  }

  /**
   * @name getProjectsByWorkspace
   * @description Leverages the direct-reference index.
   */
  public async getProjectsByWorkspace(workspaceId: string): Promise<IResult> {
    return await projectRepository.findAll({ workspaceId: new Types.ObjectId(workspaceId) });
  }

/**
   * @name closeProject
   * @description Seals a project and transitions it to a terminal state.
   */
  public async closeProject(projectId: string): Promise<IResult> {
    // 1. Check if project exists
    const projectResult = await projectRepository.findById(projectId);
    
    if (projectResult.error || !projectResult.data) {
      return { 
        error: true, 
        code: 404, 
        message: "Project not found", 
        data: {} 
      };
    }

    // 2. Prevent re-closing if already closed
    if (projectResult.data.status === ProjectStatus.CLOSED) {
      return { 
        error: true, 
        code: 400, 
        message: "Project is already closed", 
        data: {} 
      };
    }

    // 3. Perform the Seal
    const updateResult = await projectRepository.updateProject(projectId, {
      status: ProjectStatus.CLOSED,
      isClosed: true,
      isOpen: false,
      // Optional: you might want to record when it was closed
      // closedAt: new Date() 
    } as any);

    if (updateResult.error) {
      return { 
        error: true, 
        code: updateResult.code, 
        message: updateResult.message, 
        data: {} 
      };
    }

    return {
      error: false,
      message: "Project has been successfully closed and sealed",
      code: 200,
      data: updateResult.data
    };
  }

  /**
   * @name deleteProject
   * @description Performs a cascading delete of a project and its child entities (Teams/Tasks).
   */
  public async deleteProject(projectId: string): Promise<IResult> {
    // 1. Context check: Find the project first
    const projectCheck = await projectRepository.findById(projectId);
    if (!projectCheck.data) return { error: true, code: 404, message: "Project not found", data: {} };

    try {
        // 2. The Waterfall: Use the newly exposed deleteMany from the base repo
        // This ensures the hierarchy is cleared
        await Promise.all([
            teamRepository.deleteMany({ projectId: new mongoose.Types.ObjectId(projectId) }),
            taskRepository.deleteMany({ projectId: new mongoose.Types.ObjectId(projectId) })
        ]);

        // 3. Final step: Delete the project itself
        return await projectRepository.delete(projectId);
        
    } catch (error: any) {
        return { error: true, code: 500, message: "Cascading delete failed: " + error.message, data: {} };
    }
}

/**
   * @name removeMember
   * @description Removes a user from the project and performs a deep cleanup:
   * 1. Removes user from Project members array.
   * 2. Removes user from all Teams associated with this project.
   * 3. Unassigns user from all Tasks associated with this project.
   */
  public async removeMember(projectId: string, userId: string): Promise<IResult> {
    // 1. Verify Project existence and state
    const projectResult = await projectRepository.findById(projectId);
    if (!projectResult.data) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    if (projectResult.data.status === ProjectStatus.CLOSED) {
      return { error: true, message: "Cannot modify members of a closed project", code: 400, data: {} };
    }

    try {
      // 2. The Deep Cleanup (Parallel execution for performance)
      await Promise.all([
        // A. Remove from Project document
        projectRepository.pullFromArray(projectId, 'members', { 
          user: new Types.ObjectId(userId) 
        }),

        // B. Remove from all Teams in this project
        // Note: Using the specialized method we saw in your TeamRepository earlier
        teamRepository.removeUserFromProjectTeams(projectId, userId),

        // C. Unassign from all Tasks in this project
        // We set assignedTo to null (or handle as per your Task schema)
        await taskRepository.updateMany(
          { 
            projectId: new Types.ObjectId(projectId), 
            assignedTo: new Types.ObjectId(userId) 
          },
          { $set: { assignedTo: null } }
        )
      ]);

      return {
        error: false,
        message: "Member successfully removed from project and all associated teams/tasks",
        code: 200,
        data: { projectId, userId }
      };

    } catch (error: any) {
      return {
        error: true,
        code: 500,
        message: `Failed to fully remove member: ${error.message}`,
        data: {}
      };
    }
  }

}

export default new ProjectService();



