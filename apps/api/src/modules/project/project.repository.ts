import mongoose from "mongoose";
import Project from "./project.model";
import { IProjectDoc } from "./project.interface";
import RepositoryService from "../../services/repository.service";
import { IResult } from "../../utils/interfaces.util";

class ProjectRepository extends RepositoryService<IProjectDoc> {
  constructor() {
    super(Project, "Project");
  }

  /**
   * @name findProject
   * @description Find a project by ID or slug
   */
  public async findProject(
    input: string | number,
    populate = false
  ): Promise<IResult> {
    return this.findByIdOrSlug(input, populate);
  }

  /**
   * @name createProject
   * @description Create a new project instance
   */
  public async createProject(
    projectData: Partial<IProjectDoc>
  ): Promise<IResult> {
    return this.create(projectData);
  }

  /**
   * @name updateProject
   * @description Update a project
   */
  public async updateProject(
    id: string,
    updateData: mongoose.UpdateQuery<IProjectDoc> | Partial<IProjectDoc>
  ): Promise<IResult> {
    return this.update(id, updateData as any);
  }

  /**
   * @name findByWorkspace
   * @description Efficiently find all projects belonging to a workspace
   */
  public async findByWorkspace(workspaceId: string): Promise<IResult> {
    return this.findAll({ workspaceId: new mongoose.Types.ObjectId(workspaceId) });
  }

  /**
   * @name addMember
   * @description Add a member to project using type-safe array operation
   */
  public async addMember(
    projectId: string,
    userId: string,
    role: any
  ): Promise<IResult> {
    return this.pushToArray(projectId, 'members', {
      user: new mongoose.Types.ObjectId(userId),
      role: role,
      joinedAt: new Date()
    });
  }

  /**
   * @name removeMember
   * @description Remove a member from project using type-safe array operation
   */
  public async removeMember(
    projectId: string,
    userId: string
  ): Promise<IResult> {
    return this.pullFromArray(projectId, 'members', {
      user: new mongoose.Types.ObjectId(userId)
    });
  }
}

export default new ProjectRepository();
