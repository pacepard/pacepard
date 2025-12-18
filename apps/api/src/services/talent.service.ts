import storageService from "../services/storage.service";
import { IFile, IResult, ITalentDoc, IUserDoc } from "../utils/interfaces.util";
import Talent from "../modules/Talent/talent.model.ts";
import { generateRandomChars } from "../utils/helpers.utl.ts";
import { createTalentDTO, updateTalentDTO } from "../modules/Talent/talent.dto.ts";

class TalentService {
  constructor() {}

  /**
   * @method createTalent
   * @description Creates a new talent profile in the system.
   *
   * @param {Partial<ITalentDoc>} data - The talent profile payload.
   *
   * @returns {Promise<IResult>} A structured result object containing:
   * - {boolean} error - Whether the creation failed.
   * - {string} message - Human-readable description of the result.
   * - {number} code - HTTP-style status code.
   * - {object} data - The created talent document.
   *
   * @throws {Error} If validation or database save fails.
   */
  public async createTalent(
    data: createTalentDTO
  ): Promise<IResult<{ talent: ITalentDoc; user: IUserDoc }>> {
    let result: IResult<{ talent: ITalentDoc; user: IUserDoc }> = {
      error: false,
      message: "",
      code: 200,
      data: null,
    };

    const {
      user,
      bio,
      skills,
      expertise,
      tools,
      employer,
      school,
      interests,
      resume,
      experienceLevel,
      socialLinks,
      backgroundImage,
      portfolio,
    } = data;

    if (!user) {
      result.error = true;
      result.code = 400;
      result.message =
        "User information is required to create a talent profile";
      return result;
    }

    const existingTalent = await Talent.findOne({ user: user._id });
    if (existingTalent) {
      result.error = true;
      result.code = 400;
      result.message = "Talent profile already exists for this user";
      return result;
    }

    const talentData = {
      // Basic user info
      _id: user._id,
      id: user.id,
      username: generateRandomChars(12),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      passwordType: user.passwordType,
      userType: user.userType,

      // Profile details
      bio: bio,
      skills: skills,
      expertise: expertise,
      tools: tools,
      employer: employer,
      school: school,
      interests: interests,
      resume: resume,
      experienceLevel: experienceLevel,
      socialLinks: socialLinks,
      backgroundImage: backgroundImage,

      // Relationships
      user: user._id,
      createdBy: user._id,
      organizations: [],
      competitions: [],
      teams: [],
      projects: [],
      portfolio: portfolio || null,
      achievements: [],
    };

    const talent = await Talent.create(talentData);
    if (!talent) {
      result.error = true;
      result.code = 500;
      result.message = "Failed to create talent profile";
      return result;
    }

    result.message = "Talent profile created successfully";
    result.code = 201;
    result.data = { talent, user };
    return result;
  }
  /**
   * @name updateTalentProfile
   * @description Updates a talent profile with new details
   */
  public async updateProfile(
    userId: string,
    data: updateTalentDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const updatedProfile = await Talent.findOneAndUpdate(
      { user: userId },
      { $set: { ...data } },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      result.error = true;
      result.code = 404;
      result.message = "Talent profile not found";
      return result;
    }

    result.message = "Talent profile updated successfully";
    result.data = updatedProfile;
    return result;
  }

  /**
   * @name getTalentProfile
   * @description Retrieves a full talent profile, including populated relations
   */
  public async getTalentProfile(userId: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const talent = await Talent.findOne({ user: userId })
      .populate("organizations")
      .populate("competitions")
      .populate("teams")
      .populate("projects")
      .populate("portfolio")
      .populate("achievements");

    if (!talent) {
      result.error = true;
      result.code = 404;
      result.message = "Talent profile not found";
      return result;
    }

    result.data = talent;
    return result;
  }

  /**
   * @name updateInterests
   * @description Updates a talent's interests
   */
  public async updateInterests(
    userId: string,
    interests: string[]
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (!interests || interests.length === 0) {
      result.error = true;
      result.code = 400;
      result.message = "Invalid interests: must provide at least one interest";
      return result;
    }

    const updatedTalent = await Talent.findOneAndUpdate(
      { user: userId },
      { $set: { interests } },
      { new: true }
    );

    if (!updatedTalent) {
      result.error = true;
      result.code = 404;
      result.message = "Talent profile not found";
      return result;
    }

    result.message = "Interests updated successfully";
    result.data = updatedTalent.interests;
    return result;
  }

  /**
   * @name addSkill
   * @description Adds a new skill to a talent profile
   */
  public async addSkill(userId: string, skill: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (!skill) {
      result.error = true;
      result.code = 400;
      result.message = "Invalid skill";
      return result;
    }

    const updatedTalent = await Talent.findOneAndUpdate(
      { user: userId },
      { $addToSet: { skills: skill } },
      { new: true }
    );

    if (!updatedTalent) {
      result.error = true;
      result.code = 404;
      result.message = "Talent profile not found";
      return result;
    }

    result.message = "Skill added successfully";
    result.data = updatedTalent.skills;
    return result;
  }

  /**
   * @name removeSkill
   * @description Removes a skill from a talent profile
   */
  public async removeSkill(userId: string, skill: string): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    const updatedTalent = await Talent.findOneAndUpdate(
      { user: userId },
      { $pull: { skills: skill } },
      { new: true }
    );

    if (!updatedTalent) {
      result.error = true;
      result.code = 404;
      result.message = "Talent profile not found";
      return result;
    }

    result.message = "Skill removed successfully";
    result.data = updatedTalent.skills;
    return result;
  }

  /**
   * @name addAchievement
   * @description Adds an achievement reference to a talent profile
   */
  public async addAchievement(
    userId: string,
    achievementId: string
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (!achievementId) {
      result.error = true;
      result.code = 400;
      result.message = "Invalid achievement ID";
      return result;
    }

    const updatedTalent = await Talent.findOneAndUpdate(
      { user: userId },
      { $addToSet: { achievements: achievementId } },
      { new: true }
    );

    if (!updatedTalent) {
      result.error = true;
      result.code = 404;
      result.message = "Talent profile not found";
      return result;
    }

    result.message = "Achievement added successfully";
    result.data = updatedTalent.achievements;
    return result;
  }

  /**
   * @method uploadTalentImage
   * @description Uploads a talent's profile image to S3 and returns upload metadata.
   * Wraps around the generic uploadFile method.
   *
   * @param {IFile} file - The profile image to upload.
   * @returns {Promise<IResult>} Upload result containing file metadata or error details.
   */
  public async uploadTalentImage(file: IFile): Promise<IResult> {
    return storageService.uploadFile(file);
  }
}

export default new TalentService();
