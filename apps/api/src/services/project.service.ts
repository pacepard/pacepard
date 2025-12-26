import { ProjectRepository } from "../modules/projects/project.repository";
import { IProjectDoc, IResult } from "../utils/interfaces.util";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
} from "../modules/projects/project.dto";
import {
  SubmissionStatus,
  ProjectStageType,
  EvaluationStatusType,
} from "../utils/eums.util"

class ProjectService {
  /** ── VALIDATION ── */
  public async validateProject(data: any): Promise<IResult> {
    if (!data.title) {
      return { error: true, message: "Title is required", code: 400, data: {} };
    }
    if (!data.description) {
      return { error: true, message: "Description is required", code: 400, data: {} };
    }
    if (!data.hackathonId) {
      return { error: true, message: "Hackathon ID is required", code: 400, data: {} };
    }

    return { error: false, message: "Validation passed", code: 200, data: {} };
  }

  /** ── CREATE ── */
  public async createProject(payload: CreateProjectDTO, userId: string): Promise<IResult> {
    const projectData: Partial<IProjectDoc> = {
      ...payload,
      createdBy: userId,
      status: SubmissionStatus.PENDING,
      projectStage: ProjectStageType.DRAFT,
      evaluationStatus: EvaluationStatusType.PENDING,
      isDraft: true,
      isSubmitted: false,
      isApproved: false,
      likes: [],
      attachments: [],
      badgesEarned: [],
      image: payload.image || "", // ✅ new field
    };

    const project = await ProjectRepository.create(projectData);

    return { error: false, message: "Project created successfully", code: 201, data: project };
  }

  /** ── UPDATE ── */
  public async updateProject(id: string, payload: UpdateProjectDTO): Promise<IResult> {
    const updated = await ProjectRepository.update(id, {
      ...payload,
      ...(payload.image !== undefined && { image: payload.image }), // ✅ safely update if provided
    });

    if (!updated) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    return { error: false, message: "Project updated successfully", code: 200, data: updated };
  }

  /** ── GETTERS ── */
  public async getProjectById(id: string): Promise<IResult> {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    return { error: false, message: "Project fetched successfully", code: 200, data: project };
  }

  public async getAllProjects(filters: Partial<IProjectDoc> = {}): Promise<IResult> {
    const projects = await ProjectRepository.findAll(filters);
    return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
  }

  public async getProjectsByHackathon(hackathonId: string): Promise<IResult> {
    const projects = await ProjectRepository.findByHackathon(hackathonId);
    return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
  }

  public async getProjectsByTeam(teamId: string): Promise<IResult> {
    const projects = await ProjectRepository.findByTeam(teamId);
    return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
  }

  public async getProjectsByStatus(status: SubmissionStatus): Promise<IResult> {
    const projects = await ProjectRepository.findByStatus(status);
    return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
  }

  public async getProjectsByStage(stage: ProjectStageType): Promise<IResult> {
    const projects = await ProjectRepository.findByStage(stage);
    return { error: false, message: "Projects fetched successfully", code: 200, data: projects };
  }

  public async searchProjects(query: string, filters: Partial<IProjectDoc> = {}): Promise<IResult> {
    const projects = await ProjectRepository.search(query, filters);

    if (!projects || projects.length === 0) {
      return {
        error: true,
        message: "No projects found for the given query",
        code: 404,
        data: [],
      };
    }

    return {
      error: false,
      message: "Projects fetched successfully",
      code: 200,
      data: projects,
    };
  }

  /** ── APPROVAL ── */
  public async approveProject(projectId: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    project.isApproved = true;
    project.status = SubmissionStatus.APPROVED;
    await project.save();

    return { error: false, message: "Project approved successfully", code: 200, data: project };
  }

  public async rejectProject(projectId: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    project.isApproved = false;
    project.status = SubmissionStatus.REJECTED;
    await project.save();

    return { error: false, message: "Project rejected successfully", code: 200, data: project };
  }

  /** ── STAGE MANAGEMENT ── */
  public async advanceStage(projectId: string, nextStage: ProjectStageType): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    const stageOrder: ProjectStageType[] = [
      ProjectStageType.DRAFT,
      ProjectStageType.SUBMITTED,
      ProjectStageType.EVALUATED,
      ProjectStageType.FINALIST,
      ProjectStageType.WINNER,
      ProjectStageType.CLOSED,
      ProjectStageType.ARCHIVED,
    ];

    const currentIndex = stageOrder.indexOf(project.projectStage);
    const nextIndex = stageOrder.indexOf(nextStage);

    if (nextIndex < currentIndex) {
      return { error: true, message: "Cannot move project to a previous stage", code: 400, data: {} };
    }

    project.projectStage = nextStage;
    await project.save();

    return { error: false, message: "Project advanced to next stage", code: 200, data: project };
  }

  public async rollbackStage(projectId: string, prevStage: ProjectStageType): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    const stageOrder: ProjectStageType[] = [
      ProjectStageType.DRAFT,
      ProjectStageType.SUBMITTED,
      ProjectStageType.EVALUATED,
      ProjectStageType.FINALIST,
      ProjectStageType.WINNER,
      ProjectStageType.CLOSED,
      ProjectStageType.ARCHIVED,
    ];

    const currentIndex = stageOrder.indexOf(project.projectStage);
    const prevIndex = stageOrder.indexOf(prevStage);

    if (prevIndex > currentIndex) {
      return { error: true, message: "Cannot rollback to a later stage", code: 400, data: {} };
    }

    project.projectStage = prevStage;
    await project.save();

    return { error: false, message: "Project rolled back to previous stage", code: 200, data: project };
  }

  public async getCurrentStage(projectId: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    return { error: false, message: "Project stage fetched", code: 200, data: { stage: project.projectStage } };
  }

  /** ── EVALUATION ── */
  public async updateEvaluationStatus(projectId: string, status: EvaluationStatusType): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    project.evaluationStatus = status;
    await project.save();

    return { error: false, message: "Evaluation status updated", code: 200, data: project };
  }

  public async assignScore(projectId: string, score: number): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }
    if (!project.isApproved) {
      return { error: true, message: "Only approved projects can be scored", code: 400, data: {} };
    }

    project.score = score;
    await project.save();

    return { error: false, message: "Score assigned", code: 200, data: project };
  }

  public async calculateRank(hackathonId: string): Promise<IResult> {
    const projects = await ProjectRepository.findByHackathon(hackathonId);
    const sorted = projects
      .filter((p: { score: null; }) => p.score != null)
      .sort((a: { score: any; }, b: { score: any; }) => (b.score ?? 0) - (a.score ?? 0));

    sorted.forEach((p: { rank: any; save: () => void; }, index: number) => {
      p.rank = index + 1;
      p.save();
    });

    return { error: false, message: "Ranks calculated", code: 200, data: sorted };
  }

  /** ── BADGES ── */
  public async awardBadge(projectId: string, badge: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    project.badgesEarned = [...(project.badgesEarned || []), badge];
    await project.save();

    return { error: false, message: "Badge awarded", code: 200, data: project };
  }

  /** ── LIKES ── */
  public async likeProject(projectId: string, userId: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    if (project.likes.includes(userId as any)) {
      return { error: true, message: "User already liked this project", code: 400, data: {} };
    }

    project.likes.push(userId as any);
    await project.save();

    return { error: false, message: "Project liked", code: 200, data: project };
  }

  public async unlikeProject(projectId: string, userId: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    project.likes = project.likes.filter((id: { toString: () => string; }) => id.toString() !== userId);
    await project.save();

    return { error: false, message: "Project unliked", code: 200, data: project };
  }

  public async getLikesCount(projectId: string): Promise<IResult> {
    const project = await ProjectRepository.findById(projectId);
    if (!project) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    return { error: false, message: "Likes count fetched", code: 200, data: { count: project.likes.length } };
  }

  /** ── DELETE ── */
  public async deleteProject(id: string): Promise<IResult> {
    const deleted = await ProjectRepository.delete(id);
    if (!deleted) {
      return { error: true, message: "Project not found", code: 404, data: {} };
    }

    return { error: false, message: "Project deleted successfully", code: 200, data: {} };
  }
}

export default new ProjectService();
