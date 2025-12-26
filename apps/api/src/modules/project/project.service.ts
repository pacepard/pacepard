import { Types } from "mongoose";
import ErrorResponse from "../../utils/error.util";
import Project from "./project.model";
import Team from "../team/team.model";
import { IProjectDoc } from "./project.interface";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  PublishProjectDTO,
  CloseProjectDTO,
  InviteTalentToProjectDTO,
  ProjectPreviewDTO,
  ProjectWorkspaceDTO,
} from "./project.dto";

import { IUserDoc } from "../user/user.interface";
import { ProjectStatus, ProjectCreatorType } from "./project.interface";
import { ForbiddenError, NotFoundError, BadRequestError } from "../../utils/projectError.utils";
import { DbModels } from "../../utils/enums.util";

export class ProjectService {
  /* -------------------------------------------------------------------------- */
  /* CREATE PROJECT                               */
  /* -------------------------------------------------------------------------- */
static async createProject(
  actor: IUserDoc,
  dto: CreateProjectDTO
): Promise<IProjectDoc> {
  this.assertCanCreateProject(actor);

  /**
   * FIX: We map to DbModels strings directly to satisfy the Schema Enum 
   * [DbModels.ADMIN, DbModels.BUSINESS]
   */
  const creatorType = actor.isAdmin ? DbModels.ADMIN : DbModels.BUSINESS;

  // We cast to 'any' inside create if the interface is still being difficult, 
  // but mapping 'creatorType' correctly usually solves it.
  const projectData = {
    code: this.generateProjectCode(),
    title: dto.title,
    slug: this.generateSlug(dto.title),
    tagline: dto.tagline ?? "",
    description: dto.description,
    items: dto.items ?? [],
    category: dto.category ?? "",
    tags: dto.tags ?? [],
    image: dto.image ?? "",
    documentation: dto.documentation ?? "",
    type: dto.type,
    status: ProjectStatus.DRAFT,
    isOpen: false,
    isClosed: false,
    createdBy: actor._id as any, // Cast to any or Types.ObjectId
    creatorType: creatorType,    // Now matches DbModels.ADMIN or DbModels.BUSINESS
    members: [],
    tasks: [],
    maintainers: [],
    mentors: [],
  };

    const project = new Project(projectData);
    return await project.save();
  }
  // static async createProject(
  //   actor: IUserDoc,
  //   dto: CreateProjectDTO
  // ): Promise<IProjectDoc> {
  //   this.assertCanCreateProject(actor);

  //   const creatorType = actor.isAdmin ? ProjectCreatorType.ADMIN : ProjectCreatorType.BUSINESS;

  //   const project = await Project.create({
  //     code: this.generateProjectCode(),
  //     title: dto.title,
  //     slug: this.generateSlug(dto.title),
  //     tagline: dto.tagline ?? "",
  //     description: dto.description,
  //     items: dto.items ?? [],
  //     category: dto.category ?? "",
  //     tags: dto.tags ?? [],
  //     image: dto.image ?? "",
  //     documentation: dto.documentation ?? "",
  //     type: dto.type,
  //     status: ProjectStatus.DRAFT,
  //     isOpen: false,
  //     isClosed: false,
  //     createdBy: actor._id,
  //     creatorType,
  //     members: [],
  //     tasks: [],
  //     maintainers: [],
  //     mentors: [],
  //   });

  //   return project;
  // }

  /* -------------------------------------------------------------------------- */
  /* JOIN PROJECT (Paywall)                       */
  /* -------------------------------------------------------------------------- */

  /**
   * Allows a talent to join a project. 
   * Enforces Premium Paywall and assigns to a default "General" team.
   */
  static async joinProject(projectId: string, talent: IUserDoc): Promise<void> {
    // 1. Paywall Guard
    if (!talent.isPremium) {
      throw new ErrorResponse(
        "Premium subscription required to join projects", 
        402, 
        ["PAYWALL_TRIGGER"]
      );
    }

    const project = await this.getProjectOrFail(projectId);
    this.assertProjectOpen(project);

    // 2. Prevent duplicate joining
    const alreadyMember = project.members.some(
      (m: any) => m.user.toString() === talent._id.toString()
    );
    if (alreadyMember) throw new BadRequestError("You are already a member of this project");

    // 3. Add to Project Registry
    project.members.push({
      user: talent._id,
      role: 'member',
      joinedAt: new Date()
    });
    await project.save();

    // 4. Team Integration: Add to 'General' squad for later rotation
    let defaultTeam = await Team.findOne({ projectId: project._id, name: "General" });
    if (!defaultTeam) {
      await Team.create({ 
        projectId: project._id, 
        name: "General", 
        members: [talent._id] 
      });
    } else {
      await Team.findByIdAndUpdate(defaultTeam._id, { 
        $addToSet: { members: talent._id } 
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /* INVITATIONS & QUOTAS                         */
  /* -------------------------------------------------------------------------- */

  static async inviteTalent(
    actor: IUserDoc,
    dto: InviteTalentToProjectDTO
  ): Promise<void> {
    const project = await this.getProjectOrFail(dto.projectId);
    this.assertIsProjectOwner(actor, project);
    this.assertProjectOpen(project);

    // 👉 QUOTA CHECK: Collaborators (Mentors/Maintainers)
    if (dto.role === "mentor" || dto.role === "maintainer") {
      const currentCollaborators = project.maintainers.length + project.mentors.length;
      
      // Logic: Define limits based on plan (Actor should have plan info)
      const maxCollaborators = actor.isAdmin ? Infinity : 5; // Example: 5 for Business

      if (currentCollaborators >= maxCollaborators) {
        throw new ErrorResponse(
          `Collaborator limit reached for your plan (${maxCollaborators}). Please upgrade.`, 
          403,
          ["COLLABORATOR_LIMIT"]
        );
      }
    }

    // Delegate to actual InviteService
    // await InviteService.createProjectInvite(actor, dto);
  }

  /* -------------------------------------------------------------------------- */
  /* LIFECYCLE METHODS                            */
  /* -------------------------------------------------------------------------- */

  static async updateProject(
    projectId: string,
    actor: IUserDoc,
    dto: UpdateProjectDTO
  ): Promise<IProjectDoc> {
    const project = await this.getProjectOrFail(projectId);
    this.assertIsProjectOwner(actor, project);
    this.assertProjectNotClosed(project);

    Object.assign(project, dto);
    await project.save();
    return project;
  }

  static async publishProject(
    actor: IUserDoc,
    dto: PublishProjectDTO
  ): Promise<IProjectDoc> {
    const project = await this.getProjectOrFail(dto.projectId);
    this.assertIsProjectOwner(actor, project);

    if (project.status !== ProjectStatus.DRAFT) {
      throw new BadRequestError("Project is not in draft state");
    }

    project.status = ProjectStatus.PUBLISHED;
    project.isOpen = true;
    project.publishedAt = new Date();

    await project.save();
    return project;
  }

  static async closeProject(
    actor: IUserDoc,
    dto: CloseProjectDTO
  ): Promise<IProjectDoc> {
    const project = await this.getProjectOrFail(dto.projectId);
    this.assertIsProjectOwner(actor, project);

    project.isOpen = false;
    project.isClosed = true;
    project.status = ProjectStatus.CLOSED;

    await project.save();
    return project;
  }

  /* -------------------------------------------------------------------------- */
  /* PROJECT DISCOVERY                              */
  /* -------------------------------------------------------------------------- */

  static async listProjects(): Promise<ProjectPreviewDTO[]> {
    const projects = await Project.find({
      status: ProjectStatus.PUBLISHED,
    }).sort({ publishedAt: -1 });

    return projects.map(this.mapToProjectPreview);
  }

  static async getProjectWorkspace(
    projectId: string,
    talent: IUserDoc
  ): Promise<ProjectWorkspaceDTO> {
    const project = await Project.findById(projectId)
      .populate('members.user', 'firstName lastName avatar')
      .populate('maintainers mentors');
      
    if (!project) throw new NotFoundError("Project not found");

    this.assertProjectAccess(talent, project);

    return this.mapToProjectWorkspace(project);
  }

  /* -------------------------------------------------------------------------- */
  /* GUARD METHODS                                */
  /* -------------------------------------------------------------------------- */

  private static assertCanCreateProject(actor: IUserDoc) {
    if (!actor.isAdmin && !actor.isBusiness) {
      throw new ForbiddenError("You cannot create projects");
    }
  }

  private static assertIsProjectOwner(actor: IUserDoc, project: IProjectDoc) {
    if (project.createdBy.toString() !== actor._id.toString()) {
      throw new ForbiddenError("Not project owner");
    }
  }

  private static assertProjectOpen(project: IProjectDoc) {
    if (!project.isOpen || project.isClosed) {
      throw new BadRequestError("Project is closed");
    }
  }

  private static assertProjectNotClosed(project: IProjectDoc) {
    if (project.isClosed) {
      throw new BadRequestError("Project is already closed");
    }
  }

  private static assertProjectAccess(user: IUserDoc, project: IProjectDoc) {
    const isMember = project.members.some(
      (m: any) => m.user.toString() === user._id.toString()
    );
    const isCreator = project.createdBy.toString() === user._id.toString();

    if (!isMember && !isCreator && !user.isAdmin) {
      throw new ForbiddenError("Access denied to project workspace");
    }
  }

  /* -------------------------------------------------------------------------- */
  /* HELPERS                                      */
  /* -------------------------------------------------------------------------- */

  private static async getProjectOrFail(projectId: string): Promise<IProjectDoc> {
    const project = await Project.findById(projectId);
    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  private static generateProjectCode(): string {
    return `PRJ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  private static generateSlug(title: string): string {
    return title.toLowerCase().replace(/\s+/g, "-");
  }

  private static mapToProjectPreview(project: IProjectDoc): ProjectPreviewDTO {
    return {
      id: project._id.toString(),
      title: project.title,
      slug: project.slug,
      tagline: project.tagline,
      image: project.image,
      category: project.category,
      tags: project.tags,
      type: project.type,
      isOpen: project.isOpen,
      publishedAt: project.publishedAt,
      createdBy: {
        id: project.createdBy.toString(),
        name: "—", 
        type: project.creatorType as any,
      },
    };
  }

  private static mapToProjectWorkspace(project: IProjectDoc): ProjectWorkspaceDTO {
    return {
      id: project._id.toString(),
      code: project.code,
      title: project.title,
      slug: project.slug,
      tagline: project.tagline,
      description: project.description,
      documentation: project.documentation,
      // items: project.items ?? [],
      category: project.category,
      tags: project.tags,
      image: project.image,
      status: project.status,
      isOpen: project.isOpen,
      isClosed: project.isClosed,
      publishedAt: project.publishedAt,
      members: project.members.map((m: any) => ({
        id: m.user?._id || m.user,
        name: m.user?.firstName ? `${m.user.firstName} ${m.user.lastName}` : "Unknown",
        role: m.role
      })),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}

































































































// import { ProjectRepository } from "@/repositories/project.repository";
// import { IProjectDoc, IResult } from "@/utils/interfaces.util";
// import {
//   CreateProjectDTO,
//   UpdateProjectDTO,
// } from "@/dtos/project.dto";
// import {
//   SubmissionStatus,
//   ProjectStageType,
//   EvaluationStatusType,
// } from "@/utils/enums.util";

// class ProjectService {
//   /** ── VALIDATION ── */
//   public async validateProject(data: any): Promise<IResult> {
//     if (!data.title) {
//       return { error: true, message: "Title is required", code: 400, data: {} };
//     }
//     if (!data.description) {
//       return { error: true, message: "Description is required", code: 400, data: {} };
//     }
//     if (!data.hackathonId) {
//       return { error: true, message: "Hackathon ID is required", code: 400, data: {} };
//     }

//     return { error: false, message: "Validation passed", code: 200, data: {} };
//   }

//   /** ── CREATE ── */
//   public async createProject(payload: CreateProjectDTO, userId: string): Promise<IResult> {
//     const projectData: Partial<IProjectDoc> = {
//       ...payload,
//       createdBy: userId,
//       status: SubmissionStatus.PENDING,
//       projectStage: ProjectStageType.DRAFT,
//       evaluationStatus: EvaluationStatusType.PENDING,
//       isDraft: true,
//       isSubmitted: false,
//       isApproved: false,
//       likes: [],
//       attachments: [],
//       badgesEarned: [],
//       image: payload.image || "", // ✅ new field
//     };

//     const project = await ProjectRepository.create(projectData);

//     return { error: false, message: "Project created successfully", code: 201, data: project };
//   }

//   /** ── UPDATE ── */
//   public async updateProject(id: string, payload: UpdateProjectDTO): Promise<IResult> {
//     const updated = await ProjectRepository.update(id, {
//       ...payload,
//       ...(payload.image !== undefined && { image: payload.image }), // ✅ safely update if provided
//     });

//     if (!updated) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     return { error: false, message: "Project updated successfully", code: 200, data: updated };
//   }

//   /** ── GETTERS ── */
//   public async getProjectById(id: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(id);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     return { error: false, message: "Project fetched successfully", code: 200, data: project };
//   }

//   public async getAllProjects(filters: Partial<IProjectDoc> = {}): Promise<IResult> {
//     const projects = await ProjectRepository.findAll(filters);
//     return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
//   }

//   public async getProjectsByHackathon(hackathonId: string): Promise<IResult> {
//     const projects = await ProjectRepository.findByHackathon(hackathonId);
//     return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
//   }

//   public async getProjectsByTeam(teamId: string): Promise<IResult> {
//     const projects = await ProjectRepository.findByTeam(teamId);
//     return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
//   }

//   public async getProjectsByStatus(status: SubmissionStatus): Promise<IResult> {
//     const projects = await ProjectRepository.findByStatus(status);
//     return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
//   }

//   public async getProjectsByStage(stage: ProjectStageType): Promise<IResult> {
//     const projects = await ProjectRepository.findByStage(stage);
//     return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
//   }

//   public async searchProjects(query: string, filters: Partial<IProjectDoc> = {}): Promise<IResult> {
//     const projects = await ProjectRepository.search(query, filters);

//     if (!projects || projects.length === 0) {
//       return {
//         error: true,
//         message: "No projects found for the given query",
//         code: 404,
//         data: [],
//       };
//     }

//     return {
//       error: false,
//       message: "Projects fetched successfully",
//       code: 200,
//       data: projects,
//     };
//   }

//   /** ── APPROVAL ── */
//   public async approveProject(projectId: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     project.isApproved = true;
//     project.status = SubmissionStatus.APPROVED;
//     await project.save();

//     return { error: false, message: "Project approved successfully", code: 200, data: project };
//   }

//   public async rejectProject(projectId: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     project.isApproved = false;
//     project.status = SubmissionStatus.REJECTED;
//     await project.save();

//     return { error: false, message: "Project rejected successfully", code: 200, data: project };
//   }

//   /** ── STAGE MANAGEMENT ── */
//   public async advanceStage(projectId: string, nextStage: ProjectStageType): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     const stageOrder: ProjectStageType[] = [
//       ProjectStageType.DRAFT,
//       ProjectStageType.SUBMITTED,
//       ProjectStageType.EVALUATED,
//       ProjectStageType.FINALIST,
//       ProjectStageType.WINNER,
//       ProjectStageType.CLOSED,
//       ProjectStageType.ARCHIVED,
//     ];

//     const currentIndex = stageOrder.indexOf(project.projectStage);
//     const nextIndex = stageOrder.indexOf(nextStage);

//     if (nextIndex < currentIndex) {
//       return { error: true, message: "Cannot move project to a previous stage", code: 400, data: {} };
//     }

//     project.projectStage = nextStage;
//     await project.save();

//     return { error: false, message: "Project advanced to next stage", code: 200, data: project };
//   }

//   public async rollbackStage(projectId: string, prevStage: ProjectStageType): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     const stageOrder: ProjectStageType[] = [
//       ProjectStageType.DRAFT,
//       ProjectStageType.SUBMITTED,
//       ProjectStageType.EVALUATED,
//       ProjectStageType.FINALIST,
//       ProjectStageType.WINNER,
//       ProjectStageType.CLOSED,
//       ProjectStageType.ARCHIVED,
//     ];

//     const currentIndex = stageOrder.indexOf(project.projectStage);
//     const prevIndex = stageOrder.indexOf(prevStage);

//     if (prevIndex > currentIndex) {
//       return { error: true, message: "Cannot rollback to a later stage", code: 400, data: {} };
//     }

//     project.projectStage = prevStage;
//     await project.save();

//     return { error: false, message: "Project rolled back to previous stage", code: 200, data: project };
//   }

//   public async getCurrentStage(projectId: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     return { error: false, message: "Project stage fetched", code: 200, data: { stage: project.projectStage } };
//   }

//   /** ── EVALUATION ── */
//   public async updateEvaluationStatus(projectId: string, status: EvaluationStatusType): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     project.evaluationStatus = status;
//     await project.save();

//     return { error: false, message: "Evaluation status updated", code: 200, data: project };
//   }

//   public async assignScore(projectId: string, score: number): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }
//     if (!project.isApproved) {
//       return { error: true, message: "Only approved projects can be scored", code: 400, data: {} };
//     }

//     project.score = score;
//     await project.save();

//     return { error: false, message: "Score assigned", code: 200, data: project };
//   }

//   public async calculateRank(hackathonId: string): Promise<IResult> {
//     const projects = await ProjectRepository.findByHackathon(hackathonId);
//     const sorted = projects
//       .filter(p => p.score != null)
//       .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

//     sorted.forEach((p, index) => {
//       p.rank = index + 1;
//       p.save();
//     });

//     return { error: false, message: "Ranks calculated", code: 200, data: sorted };
//   }

//   /** ── BADGES ── */
//   public async awardBadge(projectId: string, badge: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     project.badgesEarned = [...(project.badgesEarned || []), badge];
//     await project.save();

//     return { error: false, message: "Badge awarded", code: 200, data: project };
//   }

//   /** ── LIKES ── */
//   public async likeProject(projectId: string, userId: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     if (project.likes.includes(userId as any)) {
//       return { error: true, message: "User already liked this project", code: 400, data: {} };
//     }

//     project.likes.push(userId as any);
//     await project.save();

//     return { error: false, message: "Project liked", code: 200, data: project };
//   }

//   public async unlikeProject(projectId: string, userId: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     project.likes = project.likes.filter(id => id.toString() !== userId);
//     await project.save();

//     return { error: false, message: "Project unliked", code: 200, data: project };
//   }

//   public async getLikesCount(projectId: string): Promise<IResult> {
//     const project = await ProjectRepository.findById(projectId);
//     if (!project) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     return { error: false, message: "Likes count fetched", code: 200, data: { count: project.likes.length } };
//   }

//   /** ── DELETE ── */
//   public async deleteProject(id: string): Promise<IResult> {
//     const deleted = await ProjectRepository.delete(id);
//     if (!deleted) {
//       return { error: true, message: "Project not found", code: 404, data: {} };
//     }

//     return { error: false, message: "Project deleted successfully", code: 200, data: {} };
//   }
// }

// export default new ProjectService();
