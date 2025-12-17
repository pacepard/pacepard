export enum ENVType {
    PRODUCTION = "production",
    STAGING = "staging",
    DEVELOPMENT = "development",
  }

  export enum DbModels {
  USER = "user",
  ADMIN = "admin",
  ROLE = "role",
  PERMISSION = "permission",
  CAMPAIGN = "hackathon_campaign",
  TALENT = "talent",
  ORGANIZATION = "organization",
  COMPETITION = "competition",
  TEAM = "team",
  PROJECT = "project",
  PORTFOLIO = "portfolio",
  ACHIEVEMENT = "achievement",
  MENTOR = "mentor",
  RESOURCE = "resource",
  EVALUATOR = "evaluator",
  HACKATHON = "hackathon",
  TASK = "task",
  SUBMISSION = "submission"
}

export enum OtpType {
  REGISTER = "register",
  LOGIN = "login",
  VERIFY = "verify",
  GENERIC = "generic",
  PASSWORD_RESET = "password-reset",
  ACTIVATEACCOUNT = "activate-account",
  CHANGEPASSWORD = "change-password",
  FORGOTPASSWORD = "forgot-password",
}

export enum PasswordType {
  USERGENERATED = "user-generated",
  SYSTEMGENERATED = "system-generated",
  TEMPORARY = "temporary",
  RESET = "reset",
}

export enum UserType {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  ORGANISATION = "organisation",
  TALENT = "talent",
  MENTOR = "mentor",
  EVALUATOR = "evaluator",
  USER = "user",
}

export enum FileType {
  AUDIO = "audio",
  DOCUMENT = "document",
  IMAGE = "image",
  VIDEO = "video",
}

export enum UploadStatus {
  PENDING = "pending",
  UPLOADING = "uploading",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  EXPIRED = "expired",
}