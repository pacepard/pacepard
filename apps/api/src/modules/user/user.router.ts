import { Router } from "express";
import Protect from "../../middlewares/checkAuth.mdw";
import {
  InviteUser,
  getUser,
  editUser,
  deactivateAccount,
  onboardStep1,
  onboardStep2,
  onboardStep3Talent,
  onboardStep3Business,
  onboardComplete,
  getOnboardingStatus,
} from "./user.controller";

const userRoutes = Router({ mergeParams: true });

// User profile routes
userRoutes.get("/", Protect, getUser);
userRoutes.put("/", Protect, editUser);
userRoutes.delete("/deactivate", Protect, deactivateAccount);

// User invitation route (admin only - add admin check if needed)
userRoutes.post("/invite", Protect, InviteUser);

// Onboarding routes - all require authentication
userRoutes.post("/onboard/step-1", Protect, onboardStep1);
userRoutes.post("/onboard/step-2", Protect, onboardStep2);
userRoutes.post("/onboard/step-3-talent", Protect, onboardStep3Talent);
userRoutes.post("/onboard/step-3-business", Protect, onboardStep3Business);
userRoutes.post("/onboard/complete", Protect, onboardComplete);
userRoutes.get("/onboard/status", Protect, getOnboardingStatus);

export default userRoutes;
