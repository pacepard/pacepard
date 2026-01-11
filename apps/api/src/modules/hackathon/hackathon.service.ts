// import mongoose from "mongoose";
// import slugify from "slugify";

// import { HackathonRepository } from "@/repositories/hackathon.repository";
// import Submission from "@/models/Submission.model";
// import JudgeScore from "@/models/Judging.model";
// import Team from "@/models/Team.model";
// import Medal from "@/models/Medal.model";
// import MedalAward from "@/models/Medal.model";
// import Badge from "@/models/Badge.model";
// import BadgeAward from "@/models/Badge.model";

// import { IResult } from "@/utils/interfaces.util";

// class HackathonService {
//   public result: IResult;

//   constructor() {
//     this.result = { error: false, message: "", code: 200, data: {} };
//   }

//   /**
//    * Validate hackathon payload before creation
//    */
//   public async validateHackathon(data: any): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     if (!data.title) {
//       result.error = true;
//       result.message = "Title is required";
//     } else if (!data.description) {
//       result.error = true;
//       result.message = "Description is required";
//     } else if (!data.startDate || !data.endDate) {
//       result.error = true;
//       result.message = "Start and End dates are required";
//     } else if (!data.location) {
//       result.error = true;
//       result.message = "Location is required";
//     } else if (!data.registration_deadline) {
//       result.error = true;
//       result.message = "Registration deadline is required";
//     } else if (!data.team_size_limit) {
//       result.error = true;
//       result.message = "Team size limit is required";
//     }

//     return result;
//   }

//   /**
//    * Create new hackathon
//    */
//   public async createHackathon(payload: any): Promise<IResult> {
//     if (!payload.slug) payload.slug = slugify(payload.title, { lower: true });

//     const hackathonData = {
//       title: payload.title,
//       description: payload.description,
//       slug: payload.slug,
//       startDate: payload.startDate,
//       endDate: payload.endDate,
//       status: payload.status,
//       hackOpen: payload.hackOpen,
//       hackClosed: payload.hackClosed,
//       invitedBy: payload.invitedBy,
//       tags: payload.tags || [],
//       domain: payload.domain,
//       resources: payload.resources || [],
//       isActive: payload.isActive,
//       isDeleted: payload.isDeleted,
//       location: payload.location,
//       rules: payload.rules,
//       registration_deadline: payload.registration_deadline,
//       team_size_limit: payload.team_size_limit,
//       prize_details: payload.prize_details,
//       toolkits: payload.toolkits || [],
//       category: payload.category,
//       organizers: payload.organizers || [],
//       judges: payload.judges || [],
//       mentors: payload.mentors || [],
//     };

//     const hackathon = await HackathonRepository.create(hackathonData);
//     this.result.data = hackathon;
//     this.result.message = "Hackathon created successfully";
//     return this.result;
//   }

//   public async getHackathons(): Promise<IResult> {
//     const hackathons = await HackathonRepository.findAll();
//     this.result.data = hackathons;
//     return this.result;
//   }

//   public async getHackathon(id: string): Promise<IResult> {
//     const hackathon = await HackathonRepository.findById(id);
//     if (!hackathon) {
//       return { error: true, message: "Hackathon not found", code: 404, data: {} };
//     }
//     this.result.data = hackathon;
//     return this.result;
//   }

//   /**
//    * Get the current active hackathon
//    */
//   public async getCurrentActiveHackathon(): Promise<IResult> {
//     const now = new Date();
//     const hackathons = await HackathonRepository.findAll({
//       isActive: true,
//       isDeleted: false,
//       startDate: { $lte: now },
//       endDate: { $gte: now }
//     });
    
//     if (hackathons.length === 0) {
//       this.result.error = true;
//       this.result.message = "No active hackathon found";
//       this.result.code = 404;
//       return this.result;
//     }

//     // Return the most recent active hackathon
//     this.result.data = hackathons[0];
//     this.result.message = "Active hackathon found";
//     return this.result;
//   }

//   public async updateHackathon(id: string, payload: any): Promise<IResult> {
//     const updateData = {
//       ...payload,
//       slug: payload.slug || slugify(payload.title, { lower: true }),
//     };

//     const updated = await HackathonRepository.update(id, updateData);
//     this.result.data = updated;
//     this.result.message = "Hackathon updated successfully";
//     return this.result;
//   }

//   public async deleteHackathon(id: string): Promise<IResult> {
//     await HackathonRepository.delete(id);
//     this.result.message = "Hackathon deleted successfully";
//     return this.result;
//   }

//   /**
//    * SUBMISSIONS
//    */
//   public async createSubmission(payload: any): Promise<IResult> {
//     const submission = await Submission.create(payload);
//     await Team.findByIdAndUpdate(payload.teamId, { $push: { submissions: submission._id } });

//     this.result.data = submission;
//     this.result.message = "Submission created successfully";
//     return this.result;
//   }

//   public async likeSubmission(submissionId: string, userId: string): Promise<IResult> {
//     const sub = await Submission.findByIdAndUpdate(
//       submissionId,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );
//     this.result.data = sub;
//     this.result.message = "Submission liked";
//     return this.result;
//   }

//   /**
//    * JUDGE SCORING
//    */
//   public async addJudgeScore({
//     submissionId,
//     judgeId,
//     score,
//     criteriaScores,
//     feedback,
//   }: {
//     submissionId: string;
//     judgeId: string;
//     score: number;
//     criteriaScores: any;
//     feedback?: string;
//   }): Promise<IResult> {
//     const session = await mongoose.startSession();
//     try {
//       session.startTransaction();

//       await JudgeScore.create(
//         [{ submission: submissionId, judge: judgeId, score, criteriaScores, feedback }],
//         { session }
//       );

//       const agg = await JudgeScore.aggregate([
//         { $match: { submission: new mongoose.Types.ObjectId(submissionId) } },
//         { $group: { _id: "$submission", avgScore: { $avg: "$score" } } },
//       ]).session(session);

//       const avgScore = agg[0]?.avgScore ?? 0;
//       await Submission.findByIdAndUpdate(
//         submissionId,
//         { $set: { totalScore: avgScore } },
//         { session }
//       );

//       await session.commitTransaction();

//       this.result.data = { submissionId, avgScore };
//       this.result.message = "Judge score added successfully";
//       return this.result;
//     } catch (err) {
//       await session.abortTransaction();
//       throw err;
//     } finally {
//       session.endSession();
//     }
//   }

//   /**
//    * LEADERBOARD
//    */
//   public async leaderboard(hackathonId: string, limit = 50): Promise<IResult> {
//     const leaderboard = await Submission.find({ hackathon: hackathonId })
//       .sort({ totalScore: -1, submissionDate: 1 })
//       .limit(limit)
//       .lean();

//     this.result.data = leaderboard;
//     return this.result;
//   }

//   /**
//    * AWARD MEDALS
//    */
//   // public async awardMedalsForHackathon(hackathonId: string): Promise<IResult> {
//   //   const top = await Submission.find({ hackathon: hackathonId })
//   //     .sort({ totalScore: -1 })
//   //     .limit(3)
//   //     .populate("team");

//   //   const types = ["gold", "silver", "bronze"];
//   //   for (let i = 0; i < top.length; i++) {
//   //     const medalDoc = await Medal.findOneAndUpdate(
//   //       { type: types[i], context: "hackathon" },
//   //       { $setOnInsert: { name: `${types[i]} medal` } },
//   //       { upsert: true, new: true }
//   //     );
//   //     await MedalAward.create({
//   //       medal: medalDoc._id,
//   //       team: top[i].team._id,
//   //       referenceId: hackathonId,
//   //     });
//   //   }

//   //   this.result.message = "Medals awarded successfully";
//   //   return this.result;
//   // }

//   /**
//    * AWARD BADGES
//    */
//   // public async awardBadgeForPopularSubmission(
//   //   submissionId: string,
//   //   threshold = 100
//   // ): Promise<IResult> {
//   //   const sub = await Submission.findById(submissionId).populate("team");

//   //   if (sub && sub.likes >= threshold) {
//   //     const badge =
//   //       (await Badge.findOne({ name: "Popular" })) ??
//   //       (await Badge.create({
//   //         name: "Popular",
//   //         description: "Popular submission",
//   //       }));

//   //     await BadgeAward.create({
//   //       badge: badge._id,
//   //       team: sub.team._id,
//   //       referenceId: submissionId,
//   //     });
//   //   }

//   //   this.result.message = "Badge check completed";
//   //   return this.result;
//   // }
// }

// export default new HackathonService();
