
export enum QueueChannel {
  Emails = "emails",
  UnlockUsers = "users", 
}

export enum JobChannel {
  SendEmail = "emails:send",
  SendOTPEmail = "emails:send-otp-email",
  SendPasswordResetEmail = "emails:send-password-reset-email",
  UnlockUsers = "user:unlock", 
}
