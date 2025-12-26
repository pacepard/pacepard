import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  PublishProjectDTO,
  CloseProjectDTO,
  InviteTalentToProjectDTO,
} from "./project.dto";
import { IUserDoc } from "../user/user.interface";

export class ProjectController {
/*                             
  CREATE PROJECT 
*/
  static async createProject(
    req: Request & { user: IUserDoc },
    res: Response,
    next: NextFunction
  ) {
    try {
      const actor = req.user as IUserDoc;
      const dto: CreateProjectDTO = req.body;

      const project = await ProjectService.createProject(actor, dto);

      res.status(201).json({
        error: false,
        message: "Project created successfully",
        data: project,
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  }
  /*              
  // UPDATE PROJECT
  */
  static async updateProject(
    req: Request & { user: IUserDoc },
    res: Response,
    next: NextFunction
  ) {
    try {
      const actor = req.user as IUserDoc;
      const { projectId } = req.params;
      const dto: UpdateProjectDTO = req.body;

      const project = await ProjectService.updateProject(
        projectId,
        actor,
        dto
      );

      res.status(200).json({
        error: false,
        message: "Project updated successfully",
        data: project,
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  }

  /*              
  // PUBLISH PROJECT
  */
  static async publishProject(
    req: Request & { user: IUserDoc },
    res: Response,
    next: NextFunction
  ) {
    try {
      const actor = req.user as IUserDoc;
      const dto: PublishProjectDTO = {projectId: req.params.projectId};

      const project = await ProjectService.publishProject(actor, dto);

      res.status(200).json({
        error: false,
        message: "Project published successfully",
        data: project,
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  }
  
    /*
    // CLOSE PROJECT
    */
    static async closeProject(
        req: Request & { user: IUserDoc },
        res: Response,
        next: NextFunction
    ) {
        try {
        const actor = req.user as IUserDoc;
        const dto: CloseProjectDTO = {
            projectId: req.params.projectId,
            reason: req.body.reason,
        };  

        const project = await ProjectService.closeProject(actor, dto);

        res.status(200).json({
            error: false,
            message: "Project closed successfully",
            data: project,
            status: 200,
        });
        } catch (err) {
        next(err);
        }
    }
    /*              
    // LIST PROJECT
    */

    static async listProjects(
        req: Request & { user: IUserDoc },
        res: Response,
        next: NextFunction
    ) {
        try {
        const actor = req.user as IUserDoc;
        const projects = await ProjectService.listProjects();
        
        res.status(200).json({
            error: false,
            message: "Projects fetched successfully",
            data: projects,
            status: 200,
        });
        } catch (err) {
        next(err);
        }
    }

    /* 
    // PROJECT WORKSPACE 
    */  
    static async getProjectWorkspace(
        req: Request & { user: IUserDoc },
        res: Response,
        next: NextFunction
    ) {
        try {
        const actor = req.user as IUserDoc;
        const { projectId } = req.params;

        const workspace = await ProjectService.getProjectWorkspace(projectId, actor);   

        res.status(200).json({
            error: false,
            message: "Project workspace fetched successfully",
            data: workspace,
            status: 200,
        });
        } catch (err) {
        next(err);
        }
    }

    /*
    // INVITE TALENT TO PROJECT
    */
    static async inviteTalent(
        req: Request & { user: IUserDoc },
        res: Response,
        next: NextFunction
    ) {
        try {
        const actor = req.user as IUserDoc;
        const dto: InviteTalentToProjectDTO = {
            projectId: req.params.projectId,
            email: req.body.email,
            talentId: req.body.talentId,
            role: req.body.role,
        };

        const invitation = await ProjectService.inviteTalent(actor, dto);

        res.status(200).json({
            error: false,
            message: "Talent invited to project successfully",
            data: invitation,
            status: 200,
        });
        } catch (err) {
        next(err);
        }
    }

    /*
    // ACCEPT PROJECT INVITATION
    */
    static async acceptProjectInvitation(
        req: Request & { user: IUserDoc },
        res: Response,
        next: NextFunction
    ) {
        try {
        const actor = req.user as IUserDoc;
        const { invitationId } = req.params;

        const result = await ProjectService.acceptInvitation(actor, invitationId);
}   