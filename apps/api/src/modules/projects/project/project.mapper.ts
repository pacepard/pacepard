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
    // Get workspaceId and businessId from populated fields or model
    const workspaceId = (project as any).workspaceId 
      ? String((project as any).workspaceId) 
      : (project.workspace && (project.workspace as any)._id 
        ? String((project.workspace as any)._id) 
        : undefined);
    
    const businessId = (project as any).businessId 
      ? String((project as any).businessId) 
      : (project.business && (project.business as any)._id 
        ? String((project.business as any)._id) 
        : undefined);

    const result: ProjectDTO = {
      id: project._id.toString(),
      code: project.code,
      title: project.title,
      slug: project.slug,
      tagline: project.tagline || "",
      description: project.description,
      
      // Hierarchy
      workspaceId,
      businessId,
      workspace: project.workspace,
      business: project.business,
      
      // Classification & Metadata
      category: project.category || "General",
      type: project.type,
      status: project.status,
      image: typeof project.image === 'string' ? project.image : (project.image?.s3Key || ""),
      tags: project.tags || [],
      documentation: project.documentation || "",

      items: project.items || [],
      
      // Ownership
      createdBy: typeof project.createdBy === 'object' 
        ? String((project.createdBy as any)._id || project.createdBy) 
        : String(project.createdBy),
      
      // State
      isOpen: project.isOpen,
      isClosed: project.isClosed,
      isPublic: project.isPublic,
      isChallenge: project.isChallenge,
      publishedAt: project.publishedAt,
      
      // Participation (Inline Members)
      members: project.members.map(m => ({
        user: typeof m.user === 'object' 
          ? String((m.user as any)._id || m.user) 
          : String(m.user),
        role: m.role,
        joinedAt: m.joinedAt
      })),
      
      // References
      tasks: project.tasks.map(t => 
        typeof t === 'object' 
          ? String((t as any)._id || t) 
          : String(t)
      ),
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
