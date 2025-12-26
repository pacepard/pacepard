import mongoose, { Schema, Model } from 'mongoose';
import { ITeamDoc } from './team.interface';
import { DbModels } from '../../utils/enums.util';

const TeamSchema = new Schema<ITeamDoc>({
  projectId: { type: Schema.Types.ObjectId, ref: DbModels.PROJECT, required: true },
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: DbModels.USER }]
}, { timestamps: true });

const Team: Model<ITeamDoc> = mongoose.model<ITeamDoc>(DbModels.TEAM || 'Team', TeamSchema);
export default Team;