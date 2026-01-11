export enum ENVType {
    PRODUCTION = 'production',
    STAGING = 'staging',
    DEVELOPMENT = 'development',
}

export enum AppChannel {
    WEB = 'web',
    MOBILE = 'mobile',
    DESKTOP = 'desktop',
    TABLET = 'tablet',
    WATCH = 'watch',
}

export enum PasswordType {
    USERGENERATED = 'user-generated',
    SYSTEMGENERATED = 'system-generated',
    TEMPORARY = 'temporary',
    RESET = 'reset',
}

export enum UserType {
    SUPERADMIN = 'super-admin',
    ADMIN = 'admin',
    ORGANISATION = 'organisation',
    TALENT = 'talent',
    MENTOR = 'mentor',
    EVALUATOR = 'evaluator',
    USER = 'user',
}

export enum OtpType {
    REGISTER = 'register',
    LOGIN = 'login',
    VERIFY = 'verify',
    GENERIC = 'generic',
    PASSWORD_RESET = 'password-reset',
    ACTIVATEACCOUNT = 'activate-account',
    CHANGEPASSWORD = 'change-password',
    FORGOTPASSWORD = 'forgot-password',
    MENTOR_INVITE = 'mentor-type',
    TEAM_INVITE = 'team-invite',
}

export enum FileType {
    AUDIO = 'audio',
    DOCUMENT = 'document',
    IMAGE = 'image',
    VIDEO = 'video',
}
export enum S3Folder {
    IMAGES = 'images',
    AUDIO = 'audio',
    VIDEOS = 'videos',
    DOCUMENTS = 'documents',
    OTHERS = 'others',
}

// Enum for upload format
export enum FileFormat {
    BASE64 = 'base64',
    RAWFILE = 'rawfile',
}

// Enum for supported mime types
export enum FileMimeType {
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    WEBP = 'image/webp',
    SVG = 'image/svg+xml',
    PDF = 'application/pdf',
    MPEG = 'audio/mpeg',
    MP3 = 'audio/mp3',
    WAV = 'audio/wav',
    AAC = 'audio/aac',
    OGG = 'audio/ogg',
    M4A = 'audio/x-m4a',
    MP4 = 'video/mp4',
    WEBM = 'video/webm',
}

export enum EmailService {
    SENDGRID = 'sendgrid',
    AWS_SES = 'ses',
    MAILTRAP = 'mailtrap',
    MAILGUN = 'mailgun',
    MAILSEND = 'mailsend',
    SMTP = 'smtp',
    ZEPTOMAIL = 'zeptomail',
}
export enum EmailTemplate {
    WELCOME = 'welcome',
    WELCOME_LISTENER = 'welcome-listener',
    WELCOME_PREACHER = 'welcome-preacher',
    USER_INVITE = 'user-invite',
    PASSWORD_RESET = 'password-reset',
    PASSWORD_CHANGED = 'password-changed',
    EMAIL_VERIFICATION = 'email-verification',
    INVITE = 'invite',
    OTP = 'otp',
    VERIFY_EMAIL = 'verify-email',
    GENERIC = 'generic',
    SUBSCRIPTION_CONFIRMED = 'subscription-confirmed',
    SUBSCRIPTION_CANCELLED = 'subscription-cancelled',
    SUBSCRIPTION_EXPIRED = 'subscription-expired',
    SUBSCRIPTION_UPGRADED = 'subscription-upgraded',
    SUBSCRIPTION_DOWNGRADED = 'subscription-downgraded',
    SUBSCRIPTION_RENEWED = 'subscription-renewed',
    TRIAL_STARTED = 'trial-started',
    RECOMMENDATION = 'recommendation',
}
export enum EmailStatus {
    SENT = 'sent',
    DELIVERED = 'delivered',
    OPENED = 'opened',
    CLICKED = 'clicked',
    BOUNCED = 'bounced',
    SPAM = 'spam',
    UNSUBSCRIBED = 'unsubscribed',
    FAILED = 'failed',
    PENDING = 'pending',
    ERROR = 'error',
    DELAYED = 'delayed',
    QUEUED = 'queued',
    REJECTED = 'rejected',
    BLOCKED = 'blocked',
    INVALID = 'invalid',
    BLACKLISTED = 'blacklisted',
    COMPLAINED = 'complained',
    DEFERRED = 'deferred',
    UNDELIVERED = 'undelivered',
    TEMPORARY_FAILURE = 'temporary-failure',
    PERMANENT_FAILURE = 'permanent-failure',
    TIMEOUT = 'timeout',
    RETRY = 'retry',
    UNKNOWN = 'unknown',
    SUCCESS = 'success',
    FAILURE = 'failure',
}

export enum APIKeyEnvironment {
    LIVE = 'live',
    TEST = 'test',
}

export enum APIKeyStatus {
    ACTIVE = 'active',
    REVOKED = 'revoked',
    EXPIRED = 'expired',
    SUSPENDED = 'suspended',
}

export enum APIKeyType {
    FULL = 'full',
    READ = 'read',
    WRITE = 'write',
}

export enum EmailType {
    TRANSACTIONAL = 'transactional',
    MARKETING = 'marketing',
    PRODUCT_UPDATE = 'product_update',
    FEATURE_ANNOUNCEMENT = 'feature_announcement',
}

export enum EmailPriority {
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
}

export enum OAuthProvider {
    GOOGLE = 'google',
    GITHUB = 'github',
}

export enum DbModels {
    USER = 'user',
    ADMIN = 'admin',
    ROLE = 'role',
    PERMISSION = 'permission',
    CAMPAIGN = 'hackathon_campaign',
    TALENT = 'talent',
    BUSINESS = 'business',
    COMPETITION = 'competition',
    TEAM = 'team',
    PROJECT = 'project',
    PORTFOLIO = 'portfolio',
    ACHIEVEMENT = 'achievement',
    MENTOR = 'mentor',
    RESOURCE = 'resource',
    EVALUATOR = 'evaluator',
    HACKATHON = 'hackathon',
    TASK = 'task',
    SUBMISSION = 'submission',
    SUBMISSION_COMMENT = 'submissionComment',
    BADGE = 'badge',
    MEDAL = 'medal',
    MEDAL_AWARD = 'medalAward',
    LEADERBOARD = 'leaderboard',
    JUDGE_SCORE = 'judgeScore',
    INVITES = 'invites',
    NOTIFICATIONS = 'notifications',
    PLAN = 'plan',
    BADGE_AWARD = 'badgeAward',
    SUBSCRIPTION = 'subscription',
    SUBSCRIPTION_INTENT = 'subscriptionIntent',
    TRANSACTION = 'transaction',
}

export enum UploadStatus {
    PENDING = 'pending',
    UPLOADING = 'uploading',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    EXPIRED = 'expired',
}

export enum ChunkStatus {
    PENDING = 'pending',
    UPLOADED = 'uploaded',
    FAILED = 'failed',
}

export enum ProcessingState {
    QUEUED = 'queued',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum ContentType {
    SERMON = 'sermon',
    BITE = 'bite',
}

export enum ContentState {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
    BROKEN = 'broken',
}

export enum ContentStatus {
    PUBLISHED = 'published',
    DRAFT = 'draft',
    FLAGGED = 'flagged',
    DELETED = 'deleted',
    ARCHIVED = 'archived',
}

export enum HackathonStatus {
    DRAFT = 'draft',
}

export enum SubmissionStatus {
    DRAFT = 'draft',
    UNDER_REVIEW = 'under-review',
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    LOCKED = 'locked',
}

export enum ProjectStageType {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    EVALUATED = 'evaluated',
    FINALIST = 'finalist',
    WINNER = 'winner',
    CLOSED = 'closed', // completed
    ARCHIVED = 'archived',
}

export enum EvaluationStatusType {
    PENDING = 'pending',
    UNDER_REVIEW = 'under-review',
    APPROVED = 'approved',
}

export enum PhoneCodes {
    NIG = '+234',
}

export enum MedalType {
    GOLD = 'gold',
    SILVER = 'silver',
    BRONZE = 'bronze',
}

export enum ActivityType {
    PROJECT = 'project',
    HACKATHON = 'hackathon',
}

export enum ResourceStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

export enum ResourceVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum ResourceType {
    ARTICLE = 'article',
    VIDEO = 'video',
    TOOLKIT = 'toolkit',
}

/**
 * @name OnboardAction
 * Used by the controller to determine which service method to call.
 */
export enum OnboardAction {
    STEP_1 = 'step-1',
    STEP_2 = 'step-2',
    STEP_3 = 'step-3',
    COMPLETE = 'complete',
}
export enum TeamRoles {
    TEAM_LEADER = 'teamLead',
    MENTOR = 'mentor',
    CO_LEAD = 'coLead',
    MEMBER = 'member',
}

export enum TeamVisibilty {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
}

export enum EventType {
    WORKSHOP = 'workshop',
    MEETING = 'meeting',
    DEADLINE = 'deadline',
    ANNOUNCEMENT = 'announcement',
}

export enum ExplicitStep {
    NOT_STARTED = 'NOT_STARTED',
    GET_STARTED = 'GET_STARTED',
    PACEPARD_SETUP = 'PACEPARD_SETUP',
    HACKATHON_SETUP = 'HACKATHON_SETUP',
    TERMS_REVIEW = 'TERMS_REVIEW',
    ONBOARDING_COMPLETE = 'ONBOARDING_COMPLETE',
    PERSONAL_INFO = 'PERSONAL_INFO',
    PROFILE_SETUP = 'PROFILE_SETUP',
    EXPERIENCE_INFO = 'EXPERIENCE_INFO',
}
