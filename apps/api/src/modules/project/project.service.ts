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
}

export default new ProjectService();






// import { Types } from "mongoose";
// import { dateToday, IDateToday } from "@btffamily/pacitude";
// import { IProjectDoc, ProjectStatus, ProjectCreatorType } from "./project.interface";
// import { CreateProjectDTO, UpdateProjectDTO } from "./project.dto";
// import projectRepository from "./project.repository";
// import businessRepository from "../business/business.repository";
// import workspaceRepository from "../workspace/workspace.repository"; // Added
// import { IResult } from "../../utils/interfaces.util";
// import { IUserDoc } from "../user/user.interface";
// import { genSlug } from "../../utils/helpers.util";
// import { genProjectCode } from "../../utils/code.util";
// import { DbModels } from "../../utils/enums.util";

// type ObjectId = Types.ObjectId;

// class ProjectService {
//   public result: IResult;
//   public today: IDateToday;

//   constructor() {
//     this.today = dateToday(new Date());
//     this.result = { error: false, message: "", code: 200, data: {} };
//   }

//   /**
//    * @method createProject
//    * @description Creates a project linked to a Business and a Workspace without $push.
//    * @param {CreateProjectDTO} data - The project payload including workspaceId.
//    */
//   public async createProject(
//     data: CreateProjectDTO
//   ): Promise<IResult<{ project: IProjectDoc; user: IUserDoc }>> {
    
//     let result: IResult<{ project: IProjectDoc; user: IUserDoc }> = {
//       error: false,
//       message: "",
//       code: 200,
//       data: {} as { project: IProjectDoc; user: IUserDoc },
//     };

//     const {
//       user,
//       workspaceId,
//       title,
//       description,
//       type,
//       category,
//       tagline,
//       items,
//       tags,
//       image,
//       documentation,
//     } = data;

//     // 1. Basic Validation
//     if (!user || !workspaceId) {
//       result.error = true;
//       result.code = 400;
//       result.message = "User and Workspace context are required";
//       return result;
//     }

//     if (!title || !type || !description) {
//       result.error = true;
//       result.code = 400;
//       result.message = "Project title, type, and description are required";
//       return result;
//     }

//     // 2. Permission Check
//     if (!user.isAdmin && !user.isBusiness) {
//       result.error = true;
//       result.code = 403;
//       result.message = "Only Business or Admin accounts can initialize projects";
//       return result;
//     }

//     // 3. Workspace & Business Hierarchy Validation
//     // We verify the Workspace exists first
//     const workspaceCheck = await workspaceRepository.findById(workspaceId);
//     if (workspaceCheck.error || !workspaceCheck.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "The targeted Workspace does not exist";
//       return result;
//     }

//     // Find the Business associated with this user that belongs to this workspace
//     // Note: We use the user ID to find the business profile
//     const businessCheck = await businessRepository.findOne({ 
//       user: user.id || user._id,
//       // Assuming your business model has a workspaces array or field
//       // If your business model uses a different link, adjust this query
//     });

//     if (businessCheck.error || !businessCheck.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Active Business profile required to create a project";
//       return result;
//     }

//     const business = businessCheck.data;

//     // 4. Strict Data Construction (No Optional Fields)
//     // We explicitly define every field required by IProjectDoc
//     const projectData: Partial<IProjectDoc> = {
//       code: genProjectCode(),
//       title: title.trim(),
//       slug: genSlug(title),
//       tagline: tagline || "",
//       description: description.trim(),
      
//       // Content & Media
//       items: items || [],
//       documentation: documentation || "",
//       category: category || "General",
//       tags: tags || [],
//       image: image || "default-project-thumbnail.png",
      
//       // Status & Lifecycle
//       status: ProjectStatus.DRAFT,
//       isOpen: false,
//       isClosed: false,
//       publishedAt: new Date(), // Using current date as default required field
      
//       // Strict Hierarchy Links (The Direct Lineage)
//       workspaceId: new Types.ObjectId(workspaceId),
//       businessId: business._id,
      
//       // Ownership
//       createdBy: new Types.ObjectId(user.id || user._id),
//       creatorType: user.isAdmin ? ProjectCreatorType.ADMIN : ProjectCreatorType.BUSINESS,

//       // Initializing empty relational arrays
//       members: [],
//       tasks: [],
//     };

//     // 5. Execution
//     // This creates the project document. 
//     // We NO LONGER call businessRepository.updateBusiness with $push.
//     const createResult = await projectRepository.createProject(projectData);
    
//     if (createResult.error || !createResult.data) {
//       result.error = true;
//       result.code = 500;
//       result.message = createResult.message || "Failed to persist project document";
//       return result;
//     }

//     result.message = "Project initialized successfully within the workspace hierarchy";
//     result.code = 201;
//     result.data = { project: createResult.data as IProjectDoc, user };
    
//     return result;
//   }
  
//   /**
//    * @name updateProject
//    * @description Updates an existing project with new details
//    */
//   public async updateProject(
//     projectId: string,
//     user: IUserDoc,
//     data: UpdateProjectDTO
//   ): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     // Find project
//     const findResult = await projectRepository.findProject(projectId);
//     if (findResult.error || !findResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     const project = findResult.data as IProjectDoc;

//     // Ownership Verification
//     if (!user.isAdmin && project.createdBy.toString() !== (user.id || user._id).toString()) {
//       result.error = true;
//       result.code = 403;
//       result.message = "Unauthorized to update this project";
//       return result;
//     }

//     const updateResult = await projectRepository.updateProject(projectId, data);
//     if (updateResult.error) {
//       result.error = true;
//       result.code = updateResult.code;
//       result.message = updateResult.message;
//       return result;
//     }

//     result.message = "Project updated successfully";
//     result.data = updateResult.data;
//     return result;
//   }

//   /**
//    * @name getProject
//    * @description Retrieves a project by ID or slug with populated relations
//    */
//   public async getProject(identifier: string): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     const projectResult = await projectRepository.findOne(
//       { $or: [{ _id: identifier }, { slug: identifier }] },
//       {
//         populate: [
//           { path: 'tasks' },
//           { path: 'mentors' },
//           { path: 'maintainers' },
//           { path: 'members.user' }
//         ],
//       }
//     );

//     if (projectResult.error || !projectResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     result.data = projectResult.data;
//     result.message = "Project retrieved successfully";
//     return result;
//   }

//   /**
//    * @name joinProject
//    * @description Handles talent joining a project (Paywall restricted)
//    */
//   public async joinProject(projectId: string, user: IUserDoc): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     // Paywall Check
//     if (!user.isPremium) {
//       result.error = true;
//       result.code = 402;
//       result.message = "Premium subscription required to join projects";
//       return result;
//     }

//     const projectLookup = await projectRepository.findProject(projectId);
//     if (projectLookup.error || !projectLookup.data) return projectLookup;

//     const project = projectLookup.data as IProjectDoc;
//     if (!project.isOpen || project.isClosed) {
//       result.error = true;
//       result.code = 400;
//       result.message = "Project is not currently accepting members";
//       return result;
//     }

//     const updateResult = await projectRepository.updateProject(projectId, {
//       $addToSet: { 
//         members: { user: user.id || user._id, role: 'member', joinedAt: new Date() } 
//       } as any
//     });

//     result.message = "Successfully joined the project";
//     result.data = updateResult.data;
//     return result;
//   }
// }

// export default new ProjectService();