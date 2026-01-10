import { Types } from "mongoose";
import { dateToday, IDateToday } from "@btffamily/pacitude";
import { IWorkspaceDoc } from "./workspace.interface";
import { CreateWorkspaceDTO, UpdateWorkspaceDTO } from "./workspace.dto";
import workspaceRepository from "./workspace.repository";
import { IResult } from "../../utils/interfaces.util";
import { IUserDoc } from "../user/user.interface";
import { genWorkspaceCode } from "../../utils/code.util";

type ObjectId = Types.ObjectId;

class WorkspaceService {
  public result: IResult;
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  /**
   * @method createWorkspace
   * @description Creates a new workspace in the system.
   * @param {CreateWorkspaceDTO} data - The workspace payload.
   * @returns {Promise<IResult>} A structured result object.
   */
  public async createWorkspace(
    data: CreateWorkspaceDTO
  ): Promise<IResult<{ workspace: IWorkspaceDoc }>> {
    let result: IResult<{ workspace: IWorkspaceDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: {} as { workspace: IWorkspaceDoc },
<<<<<<< HEAD
    };
=======
    }; v
>>>>>>> e9b271575d2fb6a1f86e71cf31df11e103bbff36

    const { name, createdBy, user } = data;

    if (!name || name.trim().length === 0) {
      result.error = true;
      result.code = 400;
      result.message = "Workspace name is required";
      return result;
    }

    const userId = createdBy || (user?._id || user?.id);
    if (!userId) {
      result.error = true;
      result.code = 400;
      result.message = "Creator information is required to create a workspace";
      return result;
    }

    // Generate unique workspace code
    let workspaceCode = genWorkspaceCode();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure code uniqueness
    while (!isUnique && attempts < maxAttempts) {
      const existingResult = await workspaceRepository.findOne({ code: workspaceCode });
      if (existingResult.error || !existingResult.data) {
        isUnique = true;
      } else {
        workspaceCode = genWorkspaceCode();
        attempts++;
      }
    }

    if (!isUnique) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to generate unique workspace code";
      return result;
    }

    const workspaceData = {
      code: workspaceCode,
      name: name.trim(),
      createdBy: userId,
      hackathons: [],
      projects: [],
      members: [userId], // Add creator as a member
      invites: [],
      mentors: [],
      judges: [],
    };

    const createResult = await workspaceRepository.createWorkspace(workspaceData);
    if (createResult.error || !createResult.data) {
      result.error = true;
      result.code = 500;
      result.message = createResult.message || "Failed to create workspace";
      return result;
    }

    result.message = "Workspace created successfully";
    result.code = 201;
    result.data = { workspace: createResult.data as IWorkspaceDoc };
    return result;
  }

  /**
   * @name updateWorkspace
   * @description Updates a workspace with new details
   */
  public async updateWorkspace(
    workspaceId: string,
    data: UpdateWorkspaceDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Find the workspace
    const findResult = await workspaceRepository.findById(workspaceId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Workspace not found";
      return result;
    }

    const updateData: Partial<IWorkspaceDoc> = {};
    if (data.name !== undefined) {
      updateData.name = data.name.trim();
    }

    // Update the workspace
    const updateResult = await workspaceRepository.updateWorkspace(workspaceId, updateData);
    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Workspace updated successfully";
    result.data = updateResult.data;
    return result;
  }

  /**
   * @name getWorkspace
   * @description Retrieves a workspace by ID, including populated relations
   */
  public async getWorkspace(workspaceId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const workspaceResult = await workspaceRepository.findById(
      workspaceId,
      [
        { path: "hackathons" },
        { path: "projects" },
        { path: "members" },
        { path: "invites" },
        { path: "mentors" },
        { path: "judges" },
        { path: "createdBy" },
      ]
    );

    if (workspaceResult.error || !workspaceResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Workspace not found";
      return result;
    }

    result.data = workspaceResult.data;
    result.message = "Workspace retrieved successfully";
    return result;
  }

  /**
   * @name getWorkspaces
   * @description Retrieves all workspaces with optional filtering and pagination
   */
  public async getWorkspaces(
    filter?: any,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    }
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: [] };

    const workspacesResult = await workspaceRepository.getWorkspaces(filter, options);

    if (workspacesResult.error) {
      result.error = true;
      result.code = workspacesResult.code || 500;
      result.message = workspacesResult.message;
      return result;
    }

    result.data = workspacesResult.data;
    result.pagination = workspacesResult.pagination;
    result.count = workspacesResult.count;
    result.total = workspacesResult.total;
    result.message = "Workspaces retrieved successfully";
    return result;
  }

  /**
   * @name deleteWorkspace
   * @description Deletes a workspace
   */
  public async deleteWorkspace(workspaceId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Find the workspace
    const findResult = await workspaceRepository.findById(workspaceId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Workspace not found";
      return result;
    }

    // Delete the workspace
    const deleteResult = await workspaceRepository.deleteWorkspace(workspaceId);
    if (deleteResult.error) {
      result.error = true;
      result.code = deleteResult.code;
      result.message = deleteResult.message;
      return result;
    }

    result.message = "Workspace deleted successfully";
    result.data = deleteResult.data;
    return result;
  }

  /**
   * @name addMember
   * @description Adds a member to a workspace
   */
  public async addMember(
    workspaceId: string,
    userId: string
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const workspaceResult = await workspaceRepository.findById(workspaceId);
    if (workspaceResult.error || !workspaceResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Workspace not found";
      return result;
    }

    const workspace = workspaceResult.data as IWorkspaceDoc;
    const members = (workspace.members || []).map((m: any) => 
      typeof m === 'object' ? String(m._id || m.id) : String(m)
    );

    if (members.includes(userId)) {
      result.error = true;
      result.code = 400;
      result.message = "User is already a member of this workspace";
      return result;
    }

    members.push(userId);

    const updateResult = await workspaceRepository.updateWorkspace(workspaceId, {
      members: members as any,
    });

    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Member added successfully";
    result.data = updateResult.data;
    return result;
  }

  /**
   * @name removeMember
   * @description Removes a member from a workspace
   */
  public async removeMember(
    workspaceId: string,
    userId: string
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const workspaceResult = await workspaceRepository.findById(workspaceId);
    if (workspaceResult.error || !workspaceResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Workspace not found";
      return result;
    }

    const workspace = workspaceResult.data as IWorkspaceDoc;
    const members = (workspace.members || []).map((m: any) => 
      typeof m === 'object' ? String(m._id || m.id) : String(m)
    ).filter((id: string) => id !== userId);

    const updateResult = await workspaceRepository.updateWorkspace(workspaceId, {
      members: members as any,
    });

    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Member removed successfully";
    result.data = updateResult.data;
    return result;
  }
}

export default new WorkspaceService();

