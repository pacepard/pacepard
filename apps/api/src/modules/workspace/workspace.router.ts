import { Router } from "express";
import Protect from "../../middlewares/checkAuth.mdw";
import {
  createWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
} from "./workspace.controller";

const workspaceRoutes = Router({ mergeParams: true });

// Workspace routes
workspaceRoutes.post("/", Protect, createWorkspace);
workspaceRoutes.get("/list", Protect, getWorkspaces);
workspaceRoutes.get("/:id", Protect, getWorkspace);
workspaceRoutes.put("/:id", Protect, updateWorkspace);
workspaceRoutes.delete("/:id", Protect, deleteWorkspace);

// Workspace members routes
workspaceRoutes.post("/:id/members", Protect, addMember);
workspaceRoutes.delete("/:id/members/:userId", Protect, removeMember);

export default workspaceRoutes;

