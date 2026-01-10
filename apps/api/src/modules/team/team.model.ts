import mongoose, { Schema, Model } from 'mongoose';
import { ITeamDoc } from './team.interface';
import { DbModels, ProjectMemberRole } from '../../utils/enums.util';

const TeamSchema = new Schema<ITeamDoc>({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  
  // Strict Hierarchy Chain
  workspaceId: { type: Schema.Types.ObjectId, ref: DbModels.WORKSPACE, required: true, index: true },
  businessId: { type: Schema.Types.ObjectId, ref: DbModels.BUSINESS, required: true, index: true },
  projectId: { type: Schema.Types.ObjectId, ref: DbModels.PROJECT, required: true, index: true },

  // Participation
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
  
  // Work Reference
  tasks: [{ type: Schema.Types.ObjectId, ref: DbModels.TASK }],

  // System
  createdBy: { type: Schema.Types.ObjectId, ref: DbModels.USER, required: true }
}, { 
  timestamps: true,
  versionKey: "_version",
  toJSON: {
    virtuals: true,
    getters: true,
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
TeamSchema.index({ code: 1 });
TeamSchema.index({ projectId: 1, workspaceId: 1 });

const Team: Model<ITeamDoc> = mongoose.model<ITeamDoc>(DbModels.TEAM || 'Team', TeamSchema);
export default Team;