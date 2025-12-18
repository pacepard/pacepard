import { IOnboardingProgress, ISimplifiedOnboardingProgress } from "../../utils/interfaces.util";
import { MainOnboardingPhase, PasswordType, TalentOnboardingStep, UserType, SimplifiedOnboardingStep } from "../../utils/eums.util";

export interface inviteUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: UserType;
  role?: string;
  permissions?: Array<string>;
}

export interface createUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordType: PasswordType
  userType: UserType;
  createdBy?: string
  role?: string;
  permissions?: Array<string>;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
};
}

export interface EditUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phoneCode?: string;
  country?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  isActive?: boolean;
}

export interface UserProfileDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  phoneCode?: string;
  avatar?: string;
  country?: string;
  gender?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  userType?: string;
  roles?: string[]
}

export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  phoneNumber?: string;
  phoneCode?: string;
  country?: string;

  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;

  userType: string;
  isSuper: boolean;
  isAdmin: boolean;
  isOrganisation: boolean;
  isTalent: boolean;

  isActive: boolean;
  isLocked: boolean;
  lockedUntil: Date | null;
}

export interface RoleDTO {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}


export interface UpdateOnboardingMainPhaseDTO {
  phase: MainOnboardingPhase;
}

export interface UpdateTalentStepDTO {
  step: TalentOnboardingStep;
}

// Define the structure for the enhanced onboarding progress returned to the FE
export interface IOnboardingProgressWithSteps extends IOnboardingProgress {
    currentStep: string;
    nextStep: string;
}

// Simplified Onboarding DTOs
export interface TalentOnboardingDTO {
  firstName: string;
  lastName: string;
  gender: string;
  country: string;
  city: string;
  avatar?: string;
  bio: string;
  skills: string[];
  expertise: string[];
  experienceLevel: string;
  school?: string;
  employer?: string;
  interests: string[];
}

export interface HackathonOnboardingDTO {
  participate: boolean;
  project?: {
    projectName: string;
    tags: string[];
    image?: string;
    description: string;
  };
  teamMembers?: Array<{
    email: string;
  }>;
}

export interface TermsOnboardingDTO {
  accepted: boolean;
}

export interface SimplifiedOnboardingProgressWithSteps extends ISimplifiedOnboardingProgress {
  currentStep: SimplifiedOnboardingStep;
  nextStep: SimplifiedOnboardingStep;
  progress: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  };
}

export interface HackathonOnboardingDTO {
  participate: boolean;
  project?: {
    projectName: string;
    tags: string[];
    image?: string;
    description: string;
  };
  teamMembers?: Array<{
    email: string;
  }>;
}

// Simplified Onboarding DTOs
export interface TalentOnboardingDTO {
  firstName: string;
  lastName: string;
  gender: string;
  country: string;
  city: string;
  avatar?: string;
  bio: string;
  skills: string[];
  expertise: string[];
  experienceLevel: string;
  school?: string;
  employer?: string;
  interests: string[];
}

export interface TermsOnboardingDTO {
  accepted: boolean;
}