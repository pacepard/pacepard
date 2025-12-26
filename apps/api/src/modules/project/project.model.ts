import mongoose, { Schema, Model } from "mongoose";
import { IProjectDoc, ProjectStatus, ProjectType } from "./project.interface";
import { DbModels } from "../../utils/enums.util";

const ProjectMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: DbModels.USER,
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "mentor", "maintainer"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProjectDoc>(
  {
    // ===== Identity =====
    code: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tagline: { type: String },
    description: {
      type: String,
      required: true,
    },

    // ===== Content =====
    items: {
      type: [Schema.Types.Mixed], // polymorphic blocks
      default: [],
    },
    documentation: { type: String },

    // ===== Classification =====
    category: { type: String },
    tags: { type: [String], default: [] },
    image: { type: String },

    type: {
      type: String,
      enum: Object.values(ProjectType),
      required: true,
      default: ProjectType.PROJECT,
    },

    // ===== Ownership =====
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "creatorType",
    },
    creatorType: {
      type: String,
      required: true,
      enum: [DbModels.ADMIN, DbModels.BUSINESS],
    },

    // ===== State =====
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.DRAFT,
    },
    isOpen: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    publishedAt: { type: Date },

    // ===== Collaboration =====
    members: {
      type: [ProjectMemberSchema],
      default: [],
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: DbModels.TASK,
      },
    ],
    mentors: [
      {
        type: Schema.Types.ObjectId,
        ref: DbModels.USER,
      },
    ],
    maintainers: [
      {
        type: Schema.Types.ObjectId,
        ref: DbModels.USER,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      virtuals: true,
      transform(_doc, ret: any) { // Use 'any' here to solve the "operand of delete must be optional" error
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v; // This is now allowed because ret is 'any'
        return ret;
      },
    },
  }
);

/* ===========================
   INVARIANTS & GUARDS
=========================== */
/**
 * Invariant 1:
 * isOpen and isClosed cannot both be true
 */
ProjectSchema.pre("save" as any, function (next: (err?: Error) => void) {
  if (this.isOpen && this.isClosed) {
    return next(new Error("Project cannot be open and closed at the same time"));
  }
  next();
});

ProjectSchema.pre("save" as any, function (next: (err?: Error) => void) {
  if (this.isModified("status") && this.status === ProjectStatus.PUBLISHED) {
    this.isOpen = true;
    this.isClosed = false;
    this.publishedAt = new Date();
  }
  next();
});
ProjectSchema.pre("save" as any, function (next: (err?: Error) => void) {
  // Use optional chaining on members to prevent errors during initial creation
  if (this.type === ProjectType.CHALLENGE && (this.members?.length || 0) > 0) {
    return next(new Error("Challenges cannot have members"));
  }
  next();
});

const Project: mongoose.Model<IProjectDoc> = mongoose.model<IProjectDoc>(
  DbModels.PROJECT,
  ProjectSchema
);

export default Project;