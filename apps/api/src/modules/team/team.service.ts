// modules/team/team.service.ts

import Team from "./team.model";
import { BadRequestError, NotFoundError } from "../../utils/projectError.utils";

export class TeamService {
  /**
   * @description Rotates a talent between teams in the same project
   */
  public async rotateMember(
    projectId: string,
    userId: string,
    targetTeamId: string,
    actorId: string // The Business/Admin performing the rotation
  ) {
    // 1. Verify target team exists and belongs to the project
    const targetTeam = await Team.findOne({ _id: targetTeamId, projectId });
    if (!targetTeam) throw new NotFoundError("Target team not found in this project");

    // 2. Remove user from ANY team they currently belong to within this project
    // This ensures a talent is only in ONE team per project at a time (Standard Rotation)
    await Team.updateMany(
      { projectId },
      { $pull: { members: userId } }
    );

    // 3. Add to the new team
    targetTeam.members.push(userId as any);
    await targetTeam.save();

    return targetTeam;
  }
}