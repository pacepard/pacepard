import { Router } from "express";
import Protect from "../../middlewares/checkAuth.mdw";
import {
  createTeam,
  getTeam,
  getProjectTeams,
  addTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
  rotateMember,
  deleteTeam,
} from "./team.controller";

const teamRoutes = Router({ mergeParams: true });

// Team CRUD routes
teamRoutes.get("/:id", Protect, getTeam);
teamRoutes.delete("/:id", Protect, deleteTeam);

// Project teams routes
teamRoutes.post("/projects/:projectId/teams", Protect, createTeam);
teamRoutes.get("/projects/:projectId/teams", Protect, getProjectTeams);

// Team members routes
teamRoutes.post("/:teamId/members", Protect, addTeamMember);
teamRoutes.delete("/:teamId/members/:userId", Protect, removeTeamMember);
teamRoutes.put("/:teamId/members/:userId/role", Protect, updateTeamMemberRole);

// Team rotation route
teamRoutes.post("/projects/:projectId/teams/rotate", Protect, rotateMember);

export default teamRoutes;
