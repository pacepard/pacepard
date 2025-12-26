//import { Router } from "express";
import { ProjectController } from "./project.controller";
import { protect } from "../../middlewares/";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                               PUBLIC ROUTES                                 */
/* -------------------------------------------------------------------------- */

/**
 * List all published projects
 * Accessible to all authenticated talents
 */
router.get(
  "/",
  protect,
  ProjectController.listProjects
);

/**
 * View project workspace
 * Guards handled in service (membership / creator check)
 */
router.get(
  "/:projectId/workspace",
  protect,
  ProjectController.getProjectWorkspace
);

/* -------------------------------------------------------------------------- */
/*                           PROJECT LIFECYCLE                                  */
/* -------------------------------------------------------------------------- */

/**
 * Create project
 * Only Pacepard Admin or Business
 */
router.post(
  "/",
  protect,
  ProjectController.createProject
);

/**
 * Update project
 * Only project owner
 */
router.patch(
  "/:projectId",
  protect,
  ProjectController.updateProject
);

/**
 * Publish project
 */
router.post(
  "/:projectId/publish",
  protect,
  ProjectController.publishProject
);

/**
 * Close project
 */
router.post(
  "/:projectId/close",
  protect,
  ProjectController.closeProject
);

/* -------------------------------------------------------------------------- */
/*                               INVITATIONS                                   */
/* -------------------------------------------------------------------------- */

/**
 * Invite talent(s) to project
 */
router.post(
  "/invite",
  protect,
  ProjectController.inviteTalent
);

/**
 * Accept project invitation
 */
router.post(
  "/invitations/:invitationId/accept",
  protect,
  ProjectController.acceptInvitation
);

/**
 * Remove talent from project
 */
router.delete(
  "/:projectId/talents/:talentId",
  protect,
  ProjectController.removeTalent
);

export default router;
