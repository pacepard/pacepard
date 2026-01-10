import { Router } from "express";
import Protect from "../../middlewares/checkAuth.mdw";
import {
  getTalent,
  getTalents,
  updateTalent,
  updateInterests,
  addSkill,
  removeSkill,
} from "./talent.controller";

const talentRoutes = Router({ mergeParams: true });

// Talent profile routes
talentRoutes.get("/", Protect, getTalent);
talentRoutes.get("/list", Protect, getTalents);
talentRoutes.put("/", Protect, updateTalent);

// Talent interests routes
talentRoutes.put("/interests", Protect, updateInterests);

// Talent skills routes
talentRoutes.post("/skills", Protect, addSkill);
talentRoutes.delete("/skills/:skill", Protect, removeSkill);

export default talentRoutes;

