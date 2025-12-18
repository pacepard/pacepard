import mongoose, { Schema, Model, ObjectId } from "mongoose";
import { ITalentDoc } from "../../utils/interfaces.util";
import {
  DbModels,
  PasswordType,
  UserType,
  FileType,
  UploadStatus,
} from "../../utils/eums.util";

const TalentSchema = new Schema<ITalentDoc>(
  {
    username: { type: String, unique: true, index: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, index: true },
    password: { type: String, select: false },
    passwordType: {
      type: String,
      enum: Object.values(PasswordType),
      default: PasswordType.USERGENERATED,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.TALENT,
    },

    bio: { type: String },
    skills: [{ type: String }],
    expertise: { type: String },
    tools: [{ type: String }],
    employer: { type: String },
    school: { type: String },

    interests: [{ type: String }],
    resume: { type: String },
    experienceLevel: { type: String },

    socialLinks: {
      github: String,
      twitter: String,
      facebook: String,
      instagram: String,
      website: String,
    },

    backgroundImage: { type: String },
    upload: {
      fileName: { type: String },
      fileSize: { type: Number },
      fileType: { type: String, enum: Object.values(FileType) },
      mimetype: { type: String },
      uploadedBy: { type: Schema.Types.ObjectId, ref: DbModels.USER },
      uploadStatus: { type: String, enum: Object.values(UploadStatus) },
      uploadId: { type: String },
      s3Key: { type: String },
      rawFile: { type: String },
    },

    // relationships
    user: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    createdBy: { type: Schema.Types.ObjectId, ref: DbModels.USER },
    organizations: [{ type: Schema.Types.ObjectId, ref: DbModels.ORGANIZATION }],
    competitions: [{ type: Schema.Types.ObjectId, ref: DbModels.COMPETITION }],
    teams: [{ type: Schema.Types.ObjectId, ref: DbModels.TEAM }],
    projects: [{ type: Schema.Types.ObjectId, ref: DbModels.PROJECT }],
    portfolio: { type: Schema.Types.ObjectId, ref: DbModels.PORTFOLIO },
    achievements: [{ type: Schema.Types.ObjectId, ref: DbModels.ACHIEVEMENT }],
  },
  {
    timestamps: true,
    versionKey: "_version",
    toJSON: {
      virtuals: true,
      getters: true,
      transform(_doc, ret) {
        return {
          ...ret,
          id: ret._id.toString(),
        };
      },
    },
  }
);

TalentSchema.set("toJSON", { virtuals: true, getters: true });

const Talent: Model<ITalentDoc> = mongoose.model<ITalentDoc>(
  DbModels.TALENT,
  TalentSchema
);

export default Talent;
