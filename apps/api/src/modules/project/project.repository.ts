import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
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
   */
  public async updateProject(
    id: string,
    updateData: UpdateQuery<IProjectDoc> | Partial<IProjectDoc>
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
}

export default new ProjectRepository();
