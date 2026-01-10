import mongoose, { Schema, Model } from "mongoose";
import { IWorkspaceDoc } from "./workspace.interface";
import { DbModels } from "../../utils/enums.util";

const WorkspaceSchema = new Schema<IWorkspaceDoc>(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
<<<<<<< HEAD
    description: { type: String, default: "" },
    index: { type: Number, default: 0 },
=======
>>>>>>> e9b271575d2fb6a1f86e71cf31df11e103bbff36
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: DbModels.USER,
      required: true,
    },
    hackathons: [{ type: Schema.Types.ObjectId, ref: DbModels.HACKATHON }],
    projects: [{ type: Schema.Types.ObjectId, ref: DbModels.PROJECT }],
    members: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    invites: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    mentors: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
    judges: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      virtuals: true,
      getters: true,
      transform(_doc, ret) {
        ret.id = ret._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

/**
 * Indexes
 */
WorkspaceSchema.index({ code: 1 });
WorkspaceSchema.index({ name: 1 });
WorkspaceSchema.index({ createdBy: 1 });

const Workspace: Model<IWorkspaceDoc> = mongoose.model<IWorkspaceDoc>(
  DbModels.WORKSPACE,
  WorkspaceSchema
);

export default Workspace;

