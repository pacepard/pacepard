import { Types } from "mongoose";
import { dateToday, IDateToday } from "@btffamily/pacitude";
import { IProjectDoc, ProjectStatus, ProjectCreatorType } from "./project.interface";
import { CreateProjectDTO } from "./project.dto";
import projectRepository from "./project.repository";
import businessRepository from "../business/business.repository";
import workspaceRepository from "../workspace/workspace.repository";
import { IResult } from "../../utils/interfaces.util";
import { IUserDoc } from "../user/user.interface";
import { genSlug } from "../../utils/helpers.util";
import { genProjectCode } from "../../utils/code.util";

class ProjectService {
  public result: IResult;
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  public async createProject(
    data: CreateProjectDTO
  ): Promise<IResult<{ project: IProjectDoc; user: IUserDoc }>> {
    
    let result: IResult<{ project: IProjectDoc; user: IUserDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: {} as { project: IProjectDoc; user: IUserDoc },
    };

    const { user, workspaceId, title, description, type } = data;

    // 1. Context Validation
    if (!user || !workspaceId) {
      result.error = true; result.code = 400;
      result.message = "User and Workspace context are required";
      return result;
    }

    // 2. Permission Check
    if (!user.isAdmin && !user.isBusiness) {
      result.error = true; result.code = 403;
      result.message = "Only Business or Admin accounts can initialize projects";
      return result;
    }

    // 3. Hierarchy Validation (Workspace exists?)
    const workspaceCheck = await workspaceRepository.findById(workspaceId);
    if (workspaceCheck.error || !workspaceCheck.data) {
      result.error = true; result.code = 404;
      result.message = "The targeted Workspace does not exist";
      return result;
    }

    // 4. Business Validation (Does user have a business in this workspace?)
    const businessCheck = await businessRepository.findOne({ 
      user: user.id || user._id,
      // Logic: Ensure this business is authorized in the specific workspace
      workspaces: { $in: [new Types.ObjectId(workspaceId)] } 
    });

    if (businessCheck.error || !businessCheck.data) {
      result.error = true; result.code = 404;
      result.message = "No active Business profile found for this Workspace";
      return result;
    }

    const business = businessCheck.data;

    // 5. Strict Data Initialization (No Optional Fields)
    // We map every field from the DTO and add system defaults
    const projectData: Partial<IProjectDoc> = {
      code: genProjectCode(),
      title: title.trim(),
      slug: genSlug(title),
      tagline: data.tagline || "",
      description: description.trim(),
      
      // Content & Media
      items: data.items || [],
      documentation: data.documentation || "",
      category: data.category || "General",
      tags: data.tags || [],
      image: data.image || "default-thumbnail.png",
      
      // Strict Hierarchy Links (The Direct Lineage Pattern)
      workspaceId: new Types.ObjectId(workspaceId),
      businessId: business._id,
      
      // Ownership
      createdBy: new Types.ObjectId(user.id || user._id),
      creatorType: user.isAdmin ? ProjectCreatorType.ADMIN : ProjectCreatorType.BUSINESS,

      // State
      status: ProjectStatus.DRAFT,
      isOpen: false,
      isClosed: false,
      publishedAt: new Date(),

      // Relational Arrays (Initialized as empty per your schema)
      members: [],
      tasks: [],
    };

    // 6. Persistence
    // We create the project. We DO NOT use $push on Business or Workspace.
    const createResult = await projectRepository.createProject(projectData);
    
    if (createResult.error || !createResult.data) {
      result.error = true; result.code = 500;
      result.message = createResult.message || "Failed to persist project";
      return result;
    }

    result.message = "Project created successfully";
    result.code = 201;
    result.data = { project: createResult.data as IProjectDoc, user };
    
    return result;
  }

  /**
   * @method getProjectsByWorkspace
   * @description Retrieves all projects belonging to a specific workspace.
   * @param {string} workspaceId - The ID of the parent workspace.
   */
  public async getProjectsByWorkspace(
    workspaceId: string
  ): Promise<IResult<{ projects: IProjectDoc[] }>> {
    let result: IResult<{ projects: IProjectDoc[] }> = {
      error: false,
      message: "",
      code: 200,
      data: { projects: [] },
    };

    // 1. Validation
    if (!workspaceId) {
      result.error = true; result.code = 400;
      result.message = "Workspace ID is required to fetch projects";
      return result;
    }

    // 2. Querying the Project collection directly using the index
    // Note: We use the repository to keep the service layer clean
    const findResult = await projectRepository.findAll({ 
      workspaceId: new Types.ObjectId(workspaceId) 
    });

    if (findResult.error) {
      result.error = true;
      result.code = findResult.code;
      result.message = findResult.message;
      return result;
    }

    result.data = { projects: findResult.data as IProjectDoc[] };
    result.message = "Workspace projects retrieved successfully";
    return result;
  }

  /**
   * @name getProject
   * @description Retrieves a project by ID or slug with populated relations
   */
  public async getProject(identifier: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projectResult = await projectRepository.findProject(
      identifier,
      [
        { path: 'tasks' },
        { path: 'workspaceId' },
        { path: 'businessId' },
        { path: 'members.user' },
        { path: 'createdBy' },
      ]
    );

    if (projectResult.error || !projectResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    result.data = projectResult.data;
    result.message = "Project retrieved successfully";
    return result;
  }

  /**
   * @name updateProject
   * @description Updates a project with new details
   */
  public async updateProject(
    projectId: string,
    updateData: Partial<IProjectDoc>
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Find the project
    const findResult = await projectRepository.findById(projectId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    // Build update object with allowed fields
    const dataToUpdate: any = {};
    if (updateData.title !== undefined) {
      dataToUpdate.title = updateData.title.trim();
      dataToUpdate.slug = genSlug(updateData.title);
    }
    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description.trim();
    }
    if (updateData.tagline !== undefined) {
      dataToUpdate.tagline = updateData.tagline;
    }
    if (updateData.category !== undefined) {
      dataToUpdate.category = updateData.category;
    }
    if (updateData.tags !== undefined) {
      dataToUpdate.tags = updateData.tags;
    }
    if (updateData.image !== undefined) {
      dataToUpdate.image = updateData.image;
    }
    if (updateData.documentation !== undefined) {
      dataToUpdate.documentation = updateData.documentation;
    }
    if (updateData.items !== undefined) {
      dataToUpdate.items = updateData.items;
    }
    if (updateData.status !== undefined) {
      dataToUpdate.status = updateData.status;
    }
    if (updateData.isOpen !== undefined) {
      dataToUpdate.isOpen = updateData.isOpen;
    }
    if (updateData.isClosed !== undefined) {
      dataToUpdate.isClosed = updateData.isClosed;
    }

    // Update the project
    const updateResult = await projectRepository.updateProject(projectId, dataToUpdate);
    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Project updated successfully";
    result.data = updateResult.data;
    return result;
  }

  /**
   * @name deleteProject
   * @description Deletes a project
   */
  public async deleteProject(projectId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Find the project
    const findResult = await projectRepository.findById(projectId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    // Delete the project
    const deleteResult = await projectRepository.delete(projectId);
    if (deleteResult.error) {
      result.error = true;
      result.code = deleteResult.code;
      result.message = deleteResult.message;
      return result;
    }

    result.message = "Project deleted successfully";
    result.data = deleteResult.data;
    return result;
  }

  /**
   * @name addMember
   * @description Adds a member to a project
   */
  public async addMember(
    projectId: string,
    userId: string,
    role: any
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projectResult = await projectRepository.findById(projectId);
    if (projectResult.error || !projectResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    const project = projectResult.data as IProjectDoc;
    const members = (project.members || []).map((m: any) => 
      typeof m.user === 'object' ? String(m.user._id || m.user.id) : String(m.user)
    );

    if (members.includes(userId)) {
      result.error = true;
      result.code = 400;
      result.message = "User is already a member of this project";
      return result;
    }

    const newMember = {
      user: new Types.ObjectId(userId),
      role: role,
      joinedAt: new Date()
    };

    const updateResult = await projectRepository.updateProject(projectId, {
      $push: { members: newMember } as any
    } as any);

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
   * @description Removes a member from a project
   */
  public async removeMember(
    projectId: string,
    userId: string
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projectResult = await projectRepository.findById(projectId);
    if (projectResult.error || !projectResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    const updateResult = await projectRepository.updateProject(projectId, {
      $pull: { 
        members: { user: new Types.ObjectId(userId) } 
      } as any
    } as any);

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

  /**
   * @name publishProject
   * @description Publishes a project
   */
  public async publishProject(projectId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projectResult = await projectRepository.findById(projectId);
    if (projectResult.error || !projectResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    const updateResult = await projectRepository.updateProject(projectId, {
      status: ProjectStatus.PUBLISHED,
      isOpen: true,
      publishedAt: new Date()
    } as any);

    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Project published successfully";
    result.data = updateResult.data;
    return result;
  }

  /**
   * @name closeProject
   * @description Closes a project
   */
  public async closeProject(projectId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projectResult = await projectRepository.findById(projectId);
    if (projectResult.error || !projectResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    const updateResult = await projectRepository.updateProject(projectId, {
      status: ProjectStatus.CLOSED,
      isClosed: true,
      isOpen: false
    } as any);

    if (updateResult.error) {
      result.error = true;
      result.code = updateResult.code;
      result.message = updateResult.message;
      return result;
    }

    result.message = "Project closed successfully";
    result.data = updateResult.data;
    return result;
  }
}

export default new ProjectService();
