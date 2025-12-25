import { ObjectId } from "mongoose";
import { IProjectDoc } from "../../utils/interfaces.util";
import { SubmissionStatus, ProjectStageType, EvaluationStatusType } from "../../utils/eums.util";

//
// CREATE DTO
//
export interface CreateProjectDTO {
  // core info
  title: string;                     
  teamName: string;              
  tagline: string;
  description: string;
  projectDetails: string;
  category: string;
  tags?: string[];
  techStack?: string[];
  image?: string;

  // relationships
  hackathonId: ObjectId;
  teamId: ObjectId;
  submittedBy: ObjectId; // creator/lead

  // system
  submissionId: string;
}

//
// UPDATE DTO
//
export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  // submission info
  isSubmitted?: boolean;
  isDraft?: boolean;
  isApproved?: boolean;
  isFinalist?: boolean;
  isWinner?: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  isFeatured?: boolean;
  isDeleted?: boolean;

  submissionDate?: Date;
  status?: SubmissionStatus;
  submissionURL?: string;
  demoURL?: string;
  repositoryURL?: string;
  videoURL?: string;
  attachments?: string[];

  // achievements
  badgesEarned?: string[];
  rank?: number;
  score?: number;

  // stage tracking
  projectStage?: ProjectStageType;

  // relationships
  evaluationId?: ObjectId;
  evaluationStatus?: EvaluationStatusType;
  likes?: ObjectId[];

  // system
  deletedAt?: Date;
}

//
// MAP DTO
//
export interface MapProjectDTO {
  id: ObjectId;

  // core info
  title: string;                     
  teamName: string;              
  tagline: string;
  description: string;
  projectDetails: string;
  category: string;
  tags: string[];
  techStack: string[];
  image?: string;

  // submission info
  isSubmitted: boolean;
  isDraft?: boolean;
  isApproved?: boolean;
  isFinalist?: boolean;
  isWinner?: boolean;
  isPublished?: boolean;
  isArchived?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  isFeatured?: boolean;
  isDeleted?: boolean;

  submissionDate?: Date;
  status: SubmissionStatus;
  submissionURL?: string;
  demoURL?: string;
  repositoryURL?: string;
  videoURL?: string;
  attachments: string[];

  // achievements
  badgesEarned: string[];
  rank?: number;
  score?: number;

  // stage tracking
  projectStage: ProjectStageType;

  // relationships
  hackathonId: ObjectId;
  teamId: ObjectId;
  submittedBy: ObjectId;
  evaluationId?: ObjectId;
  evaluationStatus?: EvaluationStatusType;
  likes: ObjectId[];

  // system
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  submissionId: string;
}

//
// MAPPER
//
export const mapProject = (doc: IProjectDoc): MapProjectDTO => {
  return {
    id: doc._id,
    title: doc.title,
    teamName: doc.teamName,
    tagline: doc.tagline,
    description: doc.description,
    projectDetails: doc.projectDetails,
    category: doc.category,
    tags: doc.tags || [],
    techStack: doc.techStack || [],
    image: doc.image, 
    isSubmitted: doc.isSubmitted,
    isDraft: doc.isDraft,
    isApproved: doc.isApproved,
    isFinalist: doc.isFinalist,
    isWinner: doc.isWinner,
    isPublished: doc.isPublished,
    isArchived: doc.isArchived,
    isActive: doc.isActive,
    isLocked: doc.isLocked,
    isFeatured: doc.isFeatured,
    isDeleted: doc.isDeleted,
    submissionDate: doc.submissionDate,
    status: doc.status,
    submissionURL: doc.submissionURL,
    demoURL: doc.demoURL,
    repositoryURL: doc.repositoryURL,
    videoURL: doc.videoURL,
    attachments: doc.attachments || [],
    badgesEarned: doc.badgesEarned || [],
    rank: doc.rank,
    score: doc.score,
    projectStage: doc.projectStage,
    hackathonId: doc.hackathonId,
    teamId: doc.teamId,
    submittedBy: doc.submittedBy,
    evaluationId: doc.evaluationId,
    evaluationStatus: doc.evaluationStatus,
    likes: doc.likes || [],
    createdAt: doc.createdAt,
    updatedAt: (doc as any).updatedAt, // since timestamps: true

    submissionId: doc.submissionId,
  };
};
