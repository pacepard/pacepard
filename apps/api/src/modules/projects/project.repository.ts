import { FilterQuery } from "mongoose";
import Project from "@/models/Project.model";
import { IProjectDoc } from "@/utils/interfaces.util";
import {
  SubmissionStatus,
  ProjectStageType,
} from "@/utils/enums.util";

export const ProjectRepository = {
  /** ── CREATE ── */
  create: (data: Partial<IProjectDoc>) => Project.create(data),

  /** ── GETTERS ── */
  findAll: (filter = {}) =>
    Project.find(filter).sort({ createdAt: -1 }).lean(),

  findById: (id: string) => Project.findById(id),

  findBySubmissionId: (submissionId: string) =>
    Project.findOne({ submissionId }),

  /** ── FILTERED FINDS ── */
  findByHackathon: (hackathonId: string) =>
    Project.find({ hackathonId, isDeleted: false }).sort({ createdAt: -1 }),

  findByTeam: (teamId: string) =>
    Project.find({ teamId, isDeleted: false }).sort({ createdAt: -1 }),

  findByStatus: (status: SubmissionStatus) =>
    Project.find({ status, isDeleted: false }).sort({ createdAt: -1 }),

  findByStage: (stage: ProjectStageType) =>
    Project.find({ projectStage: stage, isDeleted: false }).sort({ createdAt: -1 }),

  /** ── SEARCH ── */

search: (query: string, filters: Partial<IProjectDoc> = {}) => {
    const regex = new RegExp(query, "i");
    const orConditions: Record<string, unknown>[] = [
      { title: regex },
      { description: regex },
      { teamName: regex },
      { category: regex },
      { tags: regex },
      { techStack: regex },
    ];
    const finalFilter = {
      ...filters,
      isDeleted: false,
      $or: orConditions,
    } as FilterQuery<IProjectDoc>;

    return Project.find(finalFilter).sort({ createdAt: -1 });
  },

  /** ── UPDATE ── */
  update: (id: string, data: Partial<IProjectDoc>) =>
    Project.findByIdAndUpdate(id, data, { new: true }),

  updateBySubmissionId: (submissionId: string, data: Partial<IProjectDoc>) =>
    Project.findOneAndUpdate({ submissionId }, data, { new: true }),

  /** ── DELETE ── */
  delete: (id: string) =>
    Project.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }),
};

