import express, { Request, Response, NextFunction } from "express";


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
