import { Types } from "mongoose";
import { dateToday, IDateToday } from "@btffamily/pacitude";
import { IProjectDoc, ProjectStatus } from "./project.interface";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.dto";
import projectRepository from "./project.repository";
import businessRepository from "../business/business.repository";
import { IResult } from "../../utils/interfaces.util";
import { IUserDoc } from "../user/user.interface";
import { genSlug } from "../../utils/helpers.util";
import { genProjectCode } from "../../utils/code.util";
import { DbModels } from "../../utils/enums.util";

type ObjectId = Types.ObjectId;

class ProjectService {
  public result: IResult;
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  /**
   * @method createProject
   * @description Creates a new project profile in the system.
   * @param {CreateProjectDTO} data - The project profile payload.
   * @returns {Promise<IResult>} A structured result object.
   */
  public async createProject(
    data: CreateProjectDTO
  ): Promise<IResult<{ project: IProjectDoc; user: IUserDoc }>> {
    
    let result: IResult<{ project: IProjectDoc; user: IUserDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: {} as { project: IProjectDoc; user: IUserDoc },
    };

    const {
      user,
      title,
      description,
      type,
      category,
      tagline,
      items,
      tags,
      image,
      documentation,
      createdBy,
    } = data;

    if (!user) {
      result.error = true;
      result.code = 400;
      result.message = "User information is required to create a project";
      return result;
    }

    if (!title || !type || !description) {
      result.error = true;
      result.code = 400;
      result.message = "Project title, type, and description are required";
      return result;
    }

    if (!user.isAdmin && !user.isBusiness) {
      result.error = true;
      result.code = 403;
      result.message = "Only Business or Admin accounts can create projects";
      return result;
    }

    let businessId: string | null = null;
    if (user.isBusiness && !user.isAdmin) {
      const findBusiness = await businessRepository.findOne({ user: user.id || user._id });
      if (findBusiness.error || !findBusiness.data) {
        result.error = true;
        result.code = 404;
        result.message = "Active Business profile required to create a project";
        return result;
      }
      businessId = findBusiness.data.id;
    }

    const projectData = {
      code: genProjectCode(),
      title,
      slug: genSlug(title),
      tagline: tagline || "",
      description,
      category: category || "",
      type,
      tags: tags || [],
      image: image || "",
      items: items || [],
      documentation: documentation || "",
      status: ProjectStatus.DRAFT,
      isOpen: false,
      isClosed: false,
      
      createdBy: createdBy || user._id || user.id,
      creatorType: user.isAdmin ? DbModels.ADMIN : DbModels.BUSINESS,

      members: [],
      tasks: [],
      mentors: [],
    };

    const createResult = await projectRepository.createProject(projectData);
    if (createResult.error || !createResult.data) {
      result.error = true;
      result.code = 500;
      result.message = createResult.message || "Failed to create project";
      return result;
    }

    const newProject = createResult.data as IProjectDoc;

    // 5. Cross-linkage (Push project to Business profile)
    if (businessId) {
      await businessRepository.updateBusiness(businessId, {
        $push: { projects: newProject.id } as any
      });
    }

    result.message = "Project created successfully";
    result.code = 201;
    result.data = { project: newProject, user };
    return result;
  }

  /**
   * @name updateProject
   * @description Updates an existing project with new details
   */
  public async updateProject(
    projectId: string,
    user: IUserDoc,
    data: UpdateProjectDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Find project
    const findResult = await projectRepository.findProject(projectId);
    if (findResult.error || !findResult.data) {
      result.error = true;
      result.code = 404;
      result.message = "Project not found";
      return result;
    }

    const project = findResult.data as IProjectDoc;

    // Ownership Verification
    if (!user.isAdmin && project.createdBy.toString() !== (user.id || user._id).toString()) {
      result.error = true;
      result.code = 403;
      result.message = "Unauthorized to update this project";
      return result;
    }

    const updateResult = await projectRepository.updateProject(projectId, data);
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
   * @name getProject
   * @description Retrieves a project by ID or slug with populated relations
   */
  public async getProject(identifier: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const projectResult = await projectRepository.findOne(
      { $or: [{ _id: identifier }, { slug: identifier }] },
      {
        populate: [
          { path: 'tasks' },
          { path: 'mentors' },
          { path: 'maintainers' },
          { path: 'members.user' }
        ],
      }
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
   * @name joinProject
   * @description Handles talent joining a project (Paywall restricted)
   */
  public async joinProject(projectId: string, user: IUserDoc): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    // Paywall Check
    if (!user.isPremium) {
      result.error = true;
      result.code = 402;
      result.message = "Premium subscription required to join projects";
      return result;
    }

    const projectLookup = await projectRepository.findProject(projectId);
    if (projectLookup.error || !projectLookup.data) return projectLookup;

    const project = projectLookup.data as IProjectDoc;
    if (!project.isOpen || project.isClosed) {
      result.error = true;
      result.code = 400;
      result.message = "Project is not currently accepting members";
      return result;
    }

    const updateResult = await projectRepository.updateProject(projectId, {
      $addToSet: { 
        members: { user: user.id || user._id, role: 'member', joinedAt: new Date() } 
      } as any
    });

    result.message = "Successfully joined the project";
    result.data = updateResult.data;
    return result;
  }
}

export default new ProjectService();