import { ObjectId, Document, Model} from "mongoose";
import { OtpType, PasswordType, UserType, FileType, UploadStatus } from "../../utils/eums.util";
import { Nullable } from "../../utils/interfaces.util";
import { MainOnboardingPhase, TalentOnboardingStep } from "../../utils/eums.util";

/**
 * Legacy Onboarding Progress Interface
 * @deprecated Use ISimplifiedOnboardingProgress instead
 */
export interface IOnboardingProgress {
  // Overall onboarding status - for quick check if onboarding is required
  isOnboarded: boolean; // true if overall MainOnboardingPhase is COMPLETED

  // The current main phase the user is on (maps to TalentOnboardingItems array)
  mainPhase: MainOnboardingPhase;

  // Tracks progress within the PACEPARD_SETUP phase (for Talent users)
  talentStep: TalentOnboardingStep;

  // Status for each main phase, to quickly determine completion.
  // Using an object for potential future expansion beyond Talent
  phaseStatus: {
    getStarted: boolean; // Corresponds to id: "1"
    pacepardSetup: boolean; // Corresponds to id: "2"
    hackathonSetup: boolean; // Corresponds to id: "3"
    termsReview: boolean; // Corresponds to id: "4"
  };

  // Timestamp of last update
  lastUpdated: string;

  // Steps for storing step-specific data
  steps?: any;
}

/**
 * Simplified Onboarding Progress Interface
 * Focused on hackathon onboarding flow
 */
export interface ISimplifiedOnboardingProgress {
  isOnboarded: boolean;
  currentPhase: 'talent_setup' | 'hackathon_setup' | 'terms_acceptance' | 'completed';
  
  // Step completion flags
  talentCompleted: boolean;
  hackathonDecision: boolean | null; // null = not decided, true/false = decided
  projectCreated: boolean;
  termsAccepted: boolean;
  
  // Project details (if created)
  projectId?: string;
  projectName?: string;
  projectTags?: string[];
  projectImage?: string;
  projectDescription?: string;
  
  // Team members (if invited)
  teamMembers?: string[]; // email addresses
  
  // Timestamps
  lastUpdated: string;
  completedAt?: string;
}

export interface IUserDoc extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordType: PasswordType; // encrypt this data
  userType: UserType;

  inviteStatus: string;

  //user: string;
  phoneNumber: string;
  phoneCode: string;
  country: string;
  countryPhone: string;
  city: string;

  businessName: string;
  businessType: string;

  avatar: {
    fileName: string;
    fileSize: number;
    fileType: FileType;
    mimetype: string;
    uploadedBy: ObjectId | any;
    uploadStatus: UploadStatus;
    uploadId: string;
    s3Key: string;
    rawFile: string;
  };

  dateOfBirth: Date;
  gender: string;
  location: string;

  onboarding: IOnboardingProgress | ISimplifiedOnboardingProgress;


  Otp: string;
  OtpExpiry: number;
  otpType: OtpType;
  accessToken: string;
  accessTokenExpiry: Date;
  tokenVersion: number;

  isSuper: boolean;
  isAdmin: boolean;
  isOrganisation: boolean;
  isTalent: boolean;
  isUser: boolean;

  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActivated: boolean;
  isDeactivated: boolean;

  lastLogin: string;
  isActive: boolean;
  loginLimit: number;
  isLocked: boolean;
  lockedUntil: Nullable<Date>;
  twoFactorEnabled: boolean;

  // Notification Preferences
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  // relationships
  roles: Array<ObjectId | any>;
  // convenience singular role (some parts of the codebase still reference `role`)
  role?: ObjectId | any;

  matchPassword: (password: string) => boolean;
  getAuthToken: () => string;

  // time stamps
  createdAt: Date;
  updatedAt: Date;
  _version: number;
  //_id: ObjectId;
  id: string;
}