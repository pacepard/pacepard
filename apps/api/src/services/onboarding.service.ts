import {
  IResult,
  IUserDoc,
  IOnboardingProgress,
  ISimplifiedOnboardingProgress,
} from "../utils/interfaces.util";
import { dateToday, IDateToday } from "@btffamily/pacitude";
import {
  SimplifiedOnboardingStep,
  SimplifiedOnboardingPhase,
  UserType,
  TeamVisibilty,
} from "../utils/eums.util";
import {
  TalentOnboardingDTO,
  HackathonOnboardingDTO,
  TermsOnboardingDTO,
  SimplifiedOnboardingProgressWithSteps,
} from "../modules/user/user.dto";
import User from "../modules/user/user.model";
import talentService from "../services/talent.service"
import projectService from "../modules/projects/project.service";
// import mentorService from "./mentor.service";
import teamService from "../modules/team/team.service";
import hackathonService from "../modules/hackathon/hackathon.service"
// import invitationService from "./invitation.service";
// import { createTalentDTO } from "../dtos/talent.dto";
import { CreateProjectDTO } from "../modules/projects/project.dto"
import { createTeamDto } from "../modules/team/team.dto"

class OnboardingService {
  public result: IResult;
  public today: IDateToday;

  constructor() {
    this.today = dateToday(new Date());
    this.result = { error: false, message: "", code: 200, data: {} };
  }

  /**
   * Type guard to check if onboarding is simplified onboarding
   */
  private isSimplifiedOnboarding(onboarding: IOnboardingProgress | ISimplifiedOnboardingProgress): onboarding is ISimplifiedOnboardingProgress {
    return 'currentPhase' in onboarding;
  }

  /**
   * @name startOnboarding
   * @description Initialize onboarding for a new talent user
   */
  public async startOnboarding(user: IUserDoc): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (user.userType !== UserType.TALENT) {
      result.error = true;
      result.message = "Onboarding is only for Talent users";
      result.code = 403;
      return result;
    }

    if (user.onboarding?.isOnboarded) {
      result.error = true;
      result.message = "User already completed onboarding";
      result.code = 400;
      return result;
    }

    // Check if user is already in onboarding process
    if (user.onboarding && this.isSimplifiedOnboarding(user.onboarding) && user.onboarding.currentPhase !== SimplifiedOnboardingPhase.TALENT_SETUP) {
      result.error = true;
      result.message = "User is already in onboarding process";
      result.code = 400;
      return result;
    }

    // Initialize onboarding structure (preserve existing onboarding data if any)
    if (!user.onboarding) {
      user.onboarding = {
        isOnboarded: false,
        currentPhase: SimplifiedOnboardingPhase.TALENT_SETUP,
        talentCompleted: false,
        hackathonDecision: null,
        projectCreated: false,
        termsAccepted: false,
        lastUpdated: this.today.ISO,
      } as ISimplifiedOnboardingProgress;
    } else {
      // Update existing onboarding structure to new format if needed
      if (!this.isSimplifiedOnboarding(user.onboarding)) {
        user.onboarding = {
          isOnboarded: user.onboarding.isOnboarded || false,
          currentPhase: SimplifiedOnboardingPhase.TALENT_SETUP,
          talentCompleted: false,
          hackathonDecision: null,
          projectCreated: false,
          termsAccepted: false,
          lastUpdated: this.today.ISO,
        } as ISimplifiedOnboardingProgress;
      }
    }

    // Only update status if not already set
    if (!user.isActive) {
      user.isActive = true;
    }
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }

    await user.save();

    const progress = this.calculateProgress(user);

    result.error = false;
    result.message = "Onboarding started successfully";
    result.code = 200;
    result.data = {
      currentStep: SimplifiedOnboardingStep.TALENT_SETUP,
      nextStep: SimplifiedOnboardingStep.HACKATHON_DECISION,
      onboarding: user.onboarding,
      progress,
    };

    return result;
  }

  /**
   * @name completeTalentOnboarding
   * @description Complete talent profile setup
   */
  public async completeTalentOnboarding(
    user: IUserDoc,
    data: TalentOnboardingDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (user.userType !== UserType.TALENT) {
      result.error = true;
      result.message = "Only Talent users can complete talent onboarding";
      result.code = 403;
      return result;
    }

    if (user.onboarding?.isOnboarded) {
      result.error = true;
      result.message = "User already completed onboarding";
      result.code = 400;
      return result;
    }

    // Update user profile
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.gender = data.gender;
    user.country = data.country;
    user.city = data.city;
    user.avatar = data.avatar || user.avatar;

    // Update existing talent profile (talent profile should already exist from user creation)
    const talentResult = await talentService.getTalentProfile(user._id.toString());
    if (talentResult.error) {
      result.error = true;
      result.message = "Talent profile not found. Please ensure user was created properly.";
      result.code = 404;
      return result;
    }

    // Update talent profile with provided data
    const talentProfile = talentResult.data;
    if (talentProfile) {
      talentProfile.bio = data.bio;
      talentProfile.skills = data.skills;
      talentProfile.expertise = data.expertise;
      talentProfile.experienceLevel = data.experienceLevel;
      talentProfile.school = data.school;
      talentProfile.employer = data.employer;
      talentProfile.interests = data.interests;
      await talentProfile.save();
    }

    // Update onboarding progress
    if (this.isSimplifiedOnboarding(user.onboarding)) {
      user.onboarding.talentCompleted = true;
      user.onboarding.currentPhase = SimplifiedOnboardingPhase.HACKATHON_SETUP;
      user.onboarding.lastUpdated = this.today.ISO;
    }

    await user.save();

    const { currentStep, nextStep } = this.determineSteps(user);
    const progress = this.calculateProgress(user);

    result.error = false;
    result.message = "Talent onboarding completed successfully";
    result.code = 200;
    result.data = {
      currentStep,
      nextStep,
      onboarding: user.onboarding,
      progress,
    };

    return result;
  }

  /**
   * @name completeHackathonOnboarding
   * @description Handle hackathon participation decision and project creation
   */
  public async completeHackathonOnboarding(
    user: IUserDoc,
    data: HackathonOnboardingDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (user.userType !== UserType.TALENT) {
      result.error = true;
      result.message = "Only Talent users can complete hackathon onboarding";
      result.code = 403;
      return result;
    }

    if (user.onboarding?.isOnboarded) {
      result.error = true;
      result.message = "User already completed onboarding";
      result.code = 400;
      return result;
    }

    // Update hackathon decision
    if (this.isSimplifiedOnboarding(user.onboarding)) {
      user.onboarding.hackathonDecision = data.participate;
      user.onboarding.lastUpdated = this.today.ISO;
    }

    if (data.participate && data.project) {
      // Get current active hackathon
      const hackathonResult = await hackathonService.getCurrentActiveHackathon();
      if (hackathonResult.error) {
        result.error = true;
        result.message = `No active hackathon found: ${hackathonResult.message}`;
        result.code = hackathonResult.code || 404;
        return result;
      }

      // Create project
      const projectData: CreateProjectDTO = {
        title: data.project.projectName,
        teamName: `${user.firstName} ${user.lastName}'s Team`,
        tagline: data.project.description.substring(0, 100),
        description: data.project.description,
        projectDetails: data.project.description,
        category: "Hackathon Project",
        tags: data.project.tags,
        image: data.project.image,
        hackathonId: hackathonResult.data._id,
        teamId: new (require("mongoose").Types.ObjectId)(), // Will be created with team
        submittedBy: user.id, //user._id
        submissionId: `sub_${Date.now()}`,
      };

      const projectResult = await projectService.createProject(projectData, user._id.toString());
      if (projectResult.error) {
        result.error = true;
        result.message = `Failed to create project: ${projectResult.message}`;
        result.code = projectResult.code || 500;
        return result;
      }

      if (this.isSimplifiedOnboarding(user.onboarding)) {
        user.onboarding.projectCreated = true;
        user.onboarding.projectId = projectResult.data._id.toString();
        user.onboarding.projectName = data.project.projectName;
        user.onboarding.projectTags = data.project.tags;
        user.onboarding.projectImage = data.project.image;
        user.onboarding.projectDescription = data.project.description;
      }

      // Create team
      const teamData: createTeamDto = {
        teamName: `${user.firstName} ${user.lastName}'s Team`,
        description: `Team for ${data.project.projectName}`,
        projectName: data.project.projectName,
        teamSize: 1,
        visibility: TeamVisibilty.PUBLIC,
        competitions: "",
        createdAt: new Date(),
      };

      const teamResult = await teamService.createTeam(user._id.toString(), projectResult.data._id.toString(), teamData);
      if (teamResult.error) {
        // Log error but don't fail the onboarding
        console.error("Failed to create team:", teamResult.message);
      }

      // Handle team member invitations
      if (data.teamMembers && data.teamMembers.length > 0 && this.isSimplifiedOnboarding(user.onboarding)) {
        user.onboarding.teamMembers = [] as string[];
        
        for (const member of data.teamMembers) {
          try {
            // Send team invitation for onboarding
            const inviteResult = await invitationService.onboardingTeamInvite({
              email: member.email,
              projectId: projectResult.data._id.toString(),
              hackathonId: hackathonResult.data._id.toString(),
              invitedBy: user._id.toString(),
            });
            
            if (!inviteResult.error) {
              user.onboarding.teamMembers.push(member.email);
              console.log(`Team invitation sent to ${member.email}:`, inviteResult.data);
            } else {
              console.error(`Failed to send invitation to ${member.email}:`, inviteResult.message);
            }
          } catch (error) {
            console.error(`Failed to invite ${member.email}:`, error);
          }
        }
      }
    }

    // Move to next phase
    if (this.isSimplifiedOnboarding(user.onboarding)) {
      user.onboarding.currentPhase = SimplifiedOnboardingPhase.TERMS_ACCEPTANCE;
    }
    await user.save();

    const { currentStep, nextStep } = this.determineSteps(user);
    const progress = this.calculateProgress(user);

    result.error = false;
    result.message = "Hackathon onboarding completed successfully";
    result.code = 200;
    result.data = {
      currentStep,
      nextStep,
      onboarding: user.onboarding,
      progress,
    };

    return result;
  }

  /**
   * @name completeTermsOnboarding
   * @description Accept terms and complete onboarding
   */
  public async completeTermsOnboarding(
    user: IUserDoc,
    data: TermsOnboardingDTO
  ): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (user.userType !== UserType.TALENT) {
      result.error = true;
      result.message = "Only Talent users can complete terms onboarding";
      result.code = 403;
      return result;
    }

    if (user.onboarding?.isOnboarded) {
      result.error = true;
      result.message = "User already completed onboarding";
      result.code = 400;
      return result;
    }

    if (!data.accepted) {
      result.error = true;
      result.message = "Terms must be accepted to complete onboarding";
      result.code = 400;
      return result;
    }

    // Complete onboarding
    if (this.isSimplifiedOnboarding(user.onboarding)) {
      user.onboarding.termsAccepted = true;
      user.onboarding.isOnboarded = true;
      user.onboarding.currentPhase = SimplifiedOnboardingPhase.COMPLETED;
      user.onboarding.completedAt = this.today.ISO;
      user.onboarding.lastUpdated = this.today.ISO;
    }

    await user.save();

    const { currentStep, nextStep } = this.determineSteps(user);
    const progress = this.calculateProgress(user);

    result.error = false;
    result.message = "Onboarding completed successfully";
    result.code = 200;
    result.data = {
      currentStep,
      nextStep,
      onboarding: user.onboarding,
      progress,
    };

    return result;
  }

  /**
   * @name getOnboardingStatus
   * @description Get current onboarding status
   */
  public async getOnboardingStatus(user: IUserDoc): Promise<IResult> {
    let result: IResult = { error: false, message: "", code: 200, data: {} };

    if (!user.onboarding) {
      // Initialize if not exists
      await this.startOnboarding(user);
    }

    const { currentStep, nextStep } = this.determineSteps(user);
    const progress = this.calculateProgress(user);

    result.error = false;
    result.message = "Onboarding status retrieved successfully";
    result.code = 200;
    result.data = {
      isOnboarded: user.onboarding.isOnboarded,
      currentStep,
      nextStep,
      onboarding: user.onboarding,
      progress,
    };

    return result;
  }

  /**
   * @name determineSteps
   * @description Determine current and next steps for onboarding
   */
  private determineSteps(user: IUserDoc): {
    currentStep: SimplifiedOnboardingStep;
    nextStep: SimplifiedOnboardingStep;
  } {
    if (!this.isSimplifiedOnboarding(user.onboarding)) {
      return {
        currentStep: SimplifiedOnboardingStep.TALENT_SETUP,
        nextStep: SimplifiedOnboardingStep.HACKATHON_DECISION,
      };
    }

    if (user.onboarding.isOnboarded) {
      return {
        currentStep: SimplifiedOnboardingStep.ONBOARDING_COMPLETE,
        nextStep: SimplifiedOnboardingStep.ONBOARDING_COMPLETE,
      };
    }

    if (!user.onboarding.talentCompleted) {
      return {
        currentStep: SimplifiedOnboardingStep.TALENT_SETUP,
        nextStep: SimplifiedOnboardingStep.HACKATHON_DECISION,
      };
    }

    if (user.onboarding.hackathonDecision === null) {
      return {
        currentStep: SimplifiedOnboardingStep.HACKATHON_DECISION,
        nextStep: SimplifiedOnboardingStep.HACKATHON_SETUP,
      };
    }

    if (user.onboarding.hackathonDecision && !user.onboarding.projectCreated) {
      return {
        currentStep: SimplifiedOnboardingStep.HACKATHON_SETUP,
        nextStep: SimplifiedOnboardingStep.TERMS_ACCEPTANCE,
      };
    }

    if (!user.onboarding.termsAccepted) {
      return {
        currentStep: SimplifiedOnboardingStep.TERMS_ACCEPTANCE,
        nextStep: SimplifiedOnboardingStep.ONBOARDING_COMPLETE,
      };
    }

    return {
      currentStep: SimplifiedOnboardingStep.ONBOARDING_COMPLETE,
      nextStep: SimplifiedOnboardingStep.ONBOARDING_COMPLETE,
    };
  }

  /**
   * @name calculateProgress
   * @description Calculate onboarding progress percentage
   */
  private calculateProgress(user: IUserDoc): {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  } {
    const totalSteps = 3;
    let completedSteps = 0;

    if (this.isSimplifiedOnboarding(user.onboarding)) {
      if (user.onboarding.talentCompleted) completedSteps++;
      if (user.onboarding.hackathonDecision !== null) completedSteps++;
      if (user.onboarding.termsAccepted) completedSteps++;
    }

    const percentage = Math.round((completedSteps / totalSteps) * 100);

    return {
      completedSteps,
      totalSteps,
      percentage,
    };
  }
}

export default new OnboardingService();
