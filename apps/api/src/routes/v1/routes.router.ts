import express, { Request, Response, NextFunction } from "express";
import authRoutes from "../../modules/auth/auth.router";
import userRoutes from "../../modules/user/user.router";
import businessRoutes from "../../modules/business/business.router";
import talentRoutes from "../../modules/talents/talent.router";
import workspaceRoutes from "../../modules/workspace/workspace.router";

const router = express.Router();

// Add new routes
//router.use("/user", userRoutes);


router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    error: false,
    errors: [],
    data: {
      name: "Pacepard API",
      version: "1.00.00",
    },
    message: "Pacepard api v1.0.0 is healthy",
    status: 200,
  });
});

export default router;
