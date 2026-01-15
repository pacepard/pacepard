import { WorkspaceDTO } from "./workspace.dto";
import { IWorkspaceDoc } from "./workspace.interface";

class WorkspaceMapper {
  constructor() {}

  /**
   * @name mapWorkspace
   * @param workspace
   * @returns WorkspaceDTO
   */
  public async mapWorkspace(workspace: IWorkspaceDoc): Promise<WorkspaceDTO> {
    const result: WorkspaceDTO = {
      id: workspace.id.toString(),
      code: workspace.code,
      name: workspace.name,
      createdBy: workspace.createdBy.toString(),
      hackathons: workspace.hackathons || [],
      projects: workspace.projects || [],
      members: workspace.members || [],
      invites: workspace.invites || [],
      mentors: workspace.mentors || [],
      judges: workspace.judges || [],
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };

    return result;
  }
}

export default new WorkspaceMapper();

