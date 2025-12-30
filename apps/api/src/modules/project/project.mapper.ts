import { IProjectDoc } from "./project.interface";
import { ProjectDTO } from "./project.dto"; // Assuming you define a DTO for the response

class ProjectMapper {
  constructor() {}

  /**
   * @name mapProject
   * @param project
   * @returns ProjectDTO
   */
  public async mapProject(project: IProjectDoc): Promise<ProjectDTO> {
    const result: ProjectDTO = {
      id: project._id.toString(),
      code: project.code,
      title: project.title,
      slug: project.slug,
      tagline: project.tagline || "",
      description: project.description,
      
      // Hierarchy
      workspaceId: project.workspaceId.toString(),
      businessId: project.businessId.toString(),
      
      // Classification & Metadata
      category: project.category || "General",
      type: project.type,
      status: project.status,
      image: project.image || "",
      tags: project.tags || [],
      documentation: project.documentation || "",

      items: project.items || [],
      
      // Ownership
      createdBy: project.createdBy.toString(),
      creatorType: project.creatorType,
      
      // State
      isOpen: project.isOpen,
      isClosed: project.isClosed,
      publishedAt: project.publishedAt,
      
      // Participation (Inline Members)
      members: project.members.map(m => ({
      user: m.user.toString(),
      role: m.role,
      joinedAt: m.joinedAt
      })),
      
      // References
      tasks: project.tasks.map(t => t.toString()),
      // System
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    return result;
  }

  /**
   * @name mapProjectList
   * @param projects 
   */
  public async mapProjectList(projects: IProjectDoc[]): Promise<ProjectDTO[]> {
    return Promise.all(projects.map((project) => this.mapProject(project)));
  }
}

export default new ProjectMapper();