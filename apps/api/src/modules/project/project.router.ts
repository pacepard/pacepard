import { Router } from "express";
import Protect from "../../middlewares/checkAuth.mdw";
import {
  createProject,
  getProject,
  getWorkspaceProjects,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  publishProject,
  closeProject,
} from "./project.controller";

const projectRoutes = Router({ mergeParams: true });

// Project routes
projectRoutes.get("/:id", Protect, getProject);
projectRoutes.put("/:id", Protect, updateProject);
projectRoutes.delete("/:id", Protect, deleteProject);

// Workspace projects routes
projectRoutes.post("/workspaces/:workspaceId/projects", Protect, createProject);
projectRoutes.get("/workspaces/:workspaceId/projects", Protect, getWorkspaceProjects);

// Project lifecycle routes
projectRoutes.post("/:id/publish", Protect, publishProject);
projectRoutes.post("/:id/close", Protect, closeProject);

// Project members routes
projectRoutes.post("/:id/members", Protect, addMember);
projectRoutes.delete("/:id/members/:userId", Protect, removeMember);

export default projectRoutes;
