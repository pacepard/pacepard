import mongoose, { Schema, Model } from "mongoose";
import { IProjectDoc, ProjectStatus, ProjectType } from "./project.interface";
import { DbModels, ProjectMemberRole } from "../../utils/enums.util";

const ProjectSchema = new Schema<IProjectDoc>(
  {
    code: { type: String, unique: true, index: true, required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    
    // Ownership & Lineage (Direct Linking)
    workspaceId: { type: Schema.Types.ObjectId, ref: DbModels.WORKSPACE, required: true, index: true },
    businessId: { type: Schema.Types.ObjectId, ref: DbModels.BUSINESS, required: true, index: true },

    // Consolidated Members Definition (Inline)
    members: [{
      _id: false,
      user: { type: Schema.Types.ObjectId, ref: DbModels.USER, required: true },
      role: { 
        type: String, 
        enum: Object.values(ProjectMemberRole), 
        default: ProjectMemberRole.MEMBER 
      },
      joinedAt: { type: Date, default: Date.now }
    }],

    // Classification & State
    category: { type: String, default: "General" },
    type: { type: String, enum: Object.values(ProjectType), default: ProjectType.PROJECT },
    status: { type: String, enum: Object.values(ProjectStatus), default: ProjectStatus.DRAFT },
    
    // Ownership
    createdBy: { type: Schema.Types.ObjectId, required: true, refPath: "creatorType" },
    creatorType: { type: String, required: true, enum: [DbModels.ADMIN, DbModels.BUSINESS] },

    // Initialized fields (No optionality)
    items: { type: [Schema.Types.Mixed], default: [] },
    tags: { type: [String], default: [] },
    tasks: [{ type: Schema.Types.ObjectId, ref: DbModels.TASK }],
    image: { type: String, default: "" },
    documentation: { type: String, default: "" },
    publishedAt: { type: Date, default: Date.now },
    isOpen: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: { 
      virtuals: true,
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);


ProjectSchema.index({ workspaceId: 1, status: 1 });

const Project: Model<IProjectDoc> = mongoose.model<IProjectDoc>(DbModels.PROJECT, ProjectSchema);
export default Project;