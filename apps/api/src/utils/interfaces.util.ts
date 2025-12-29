import { Model, Document, Types } from 'mongoose';
import {
    APIKeyEnvironment,
    APIKeyStatus,
    APIKeyType,
    EmailType,
    OtpType,
    PasswordType,
    UserType,
    EmailService,
    OAuthProvider,
    FileType,
    FileFormat,
    FileMimeType,
    UploadStatus,
    TaskStatusType,
    EvaluationStatusType,
    ProjectStageType,
    SubmissionStatus,
    MedalType,
    ActivityType,
    ResourceStatus,
    ResourceVisibility,
    ResourceType,
    MainOnboardingPhase,
    TalentOnboardingStep,
    TeamRoles,
    TeamVisibilty,
    MentorStatus,
    MentorVisibilty,
    MentorInviteStatus,
} from './eums.util.ts';
import { FileInfo } from 'busboy';
import { PassThrough } from 'stream';
import { IMentorImage } from '../modules/mentor/mentor.dto.ts';

export type Nullable<T> = T | null;

// Use Mongoose's Types.ObjectId for interface compatibility
export type ObjectId = Types.ObjectId;

export interface IRoleDoc extends Document {
    name: string;
    description: string;
    slug: string;

    // relationships
    permissions: Array<string>;
    users: Array<ObjectId | any>;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IPermissionDoc extends Document {
    action: string;
    description?: string;

    // timestamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IUserDoc extends Document {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    password: string;
    passwordType: PasswordType;
    userType: UserType;

    inviteStatus: string;

    phoneNumber: string;
    phoneCode: string;
    country: string;
    countryPhone: string;
    city: string;

    businessName: string;
    businessType: string;

    avatar: string;
    dateOfBirth: Date;
    gender: string;
    location: {
        address: string;
        city: string;
        state: string;
    };
    profileImage: string;
    preferences: any;

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
    isOnboarded: boolean;
    isActivated: boolean;
    isDeactivated: boolean;

    lastLogin: string;
    isActive: boolean;
    loginLimit: number;
    isLocked: boolean;
    lockedUntil: Nullable<Date>;
    twoFactorEnabled: boolean;

    // relationships
    roles: Array<ObjectId | any>;
    // convenience singular role (some parts of the codebase still reference `role`)
    role?: ObjectId | any;
    // per-user notification preferences
    notificationPreferences?: {
        email?: boolean;
        push?: boolean;
        sms?: boolean;
    };
    // explicit user-level permissions (canonical strings or permission ids)
    permissions: Array<string | ObjectId | any>;
    notifications: Array<ObjectId | any>;
    verification: Array<any>;
    devices: Array<any>;

    matchPassword: (password: string) => boolean;
    getAuthToken: () => string;

    // utility =
    uploadImage: {
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

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}

/**
 * Simplified Onboarding Progress Interface
 * Focused on hackathon onboarding flow
 */
export interface ISimplifiedOnboardingProgress {
    isOnboarded: boolean;
    currentPhase:
        | 'talent_setup'
        | 'hackathon_setup'
        | 'terms_acceptance'
        | 'completed';

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

export interface ITalentDoc extends Document {
    username?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordType: PasswordType;
    userType: UserType;
    bio?: string;
    backgroundImage: string;
    skills?: Array<string>;
    expertise?: string;
    tools?: Array<string>;
    employer?: string;
    school?: string;
    interests?: Array<string>;
    resume?: string;
    experienceLevel?: string;
    socialLinks?: {
        github?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
        [key: string]: string | any;
    };
    upload?: {
        fileName: string;
        fileSize: number;
        fileType: FileType;
        mimetype: string;
        uploadedBy: ObjectId;
        uploadStatus: UploadStatus;
        uploadId: string;
        s3Key: string;
        rawFile: string;
    };
    user?: ObjectId | any;
    createdBy?: ObjectId | any;
    organizations?: ObjectId | any;
    competitions?: Array<ObjectId | any>;
    teams?: Array<ObjectId | any>;
    projects?: Array<ObjectId | any>;
    portfolio?: ObjectId | any;
    achievements?: Array<ObjectId | any>;
    createdAt?: Date;
    updatedAt?: Date;
    _version?: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IOrganisationDoc extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordType: PasswordType;
    userType: UserType;
    banner?: string;
    logo?: string;
    description?: string;
    partners?: Array<string>;
    socialLinks?: {
        github?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
        website?: string;
        [key: string]: string | any;
    };
    backgroundImage?: {
        fileName: string;
        fileSize: number;
        fileType: FileType;
        mimetype: string;
        uploadedBy: ObjectId;
        uploadStatus: UploadStatus;
        uploadId: string;
        s3Key: string;
        rawFile: string;
    };
    users?: Array<ObjectId | any>;
    evaluators?: Array<ObjectId | any>;
    mentors?: Array<ObjectId | any>;
    createdBy?: ObjectId | any;
    settings?: ObjectId | any;
    hackathons?: Array<ObjectId | any>;
    projects?: Array<ObjectId | any>;
    competitions?: Array<ObjectId | any>;
    createdAt?: Date;
    updatedAt?: Date;
    _version?: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface ITransactionDoc extends Document {
    type: string;
    medium: string;
    resource: string;
    entity: string;
    reference: string;
    currency: string;
    providerRef: string;
    providerName: string;
    description: string;
    narration: string;
    amount: number;
    unitAmount: number; // kobo unit * 100
    fee: number;
    unitFee: number; // kobo unit * 100
    status: string;
    reason: string;
    message: string;
    providerData: Array<Record<string, any>>;
    metadata: Array<Record<string, any>>;
    channel: string;
    slug: string;
    card: IDebitCard;

    // relationships
    user: ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _versions: number;
    _id: ObjectId;
    id: ObjectId | string;

    // functions
    getAll(): Array<ITransactionDoc>;
}

export interface ISubscriptionDoc extends Document {
    code: string;
    isPaid: boolean;
    status: string;
    slug: string;
    billing: IBillingInfo;
    metadata: {
        lastBillingDate: Date;
        nextBillingDate: Date;
        billingCycle: string;
        autoRenew: boolean;
        cancelledAt?: Date;
        cancelReason?: string;
        upgradedFrom?: string;
        downgradedFrom?: string;
        promotionCode?: string;
        promotionExpiry?: Date;
    };

    // relationships
    user: ObjectId | any;
    transactions: Array<ObjectId | any>;
    plan: ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _versions: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IPlanDoc extends Document {
    name: string;
    isEnabled: boolean;
    description: string;
    label: string;
    currency: string;
    code: string;
    slug: string;

    pricing: IPlanPricing;
    trial: IPlanTrial;

    // relationships
    user: ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _versions: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IAPIKeyDoc extends Document {
    keyHash: string;
    environment: APIKeyEnvironment;
    type: APIKeyType;
    status: APIKeyStatus;
    permissions: Array<string>;
    expiresAt: string;
    revokedAt?: string;
    revokedBy?: string;
    description?: string;

    // relationships
    staff: ObjectId | any;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IBillingInfo {
    amount: number;
    startDate: Date;
    paidDate: Date;
    dueDate: Date;
    graceDate: Date;
    frequency: string;
}

export interface IPlanPricing {
    monthly: number;
    yearly: number;
    perMonth: number;
}

export interface IPlanTrial {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
    days: number;
}

export interface IPaymentMethod {
    email: string;
    type: string;
    card?: IDebitCard;
}

export interface IDebitCard {
    authCode: string; // encrypt this data
    cardBin: string;
    cardLast: string;
    expiryMonth: string;
    expiryYear: string;
    cardPan: string; // encrypt this data
    token: string;
    provider: string;
}

export interface IOptions {
    host: string;
    port: number | string;
    password: string;
    user: string;
    family?: number;
}

export interface IData {
    key: string;
    value: any;
}

export interface IResult<T = any> {
    error: boolean;
    message: string;
    code: number;
    data: any;
    total?: number;
}

export interface IBulkUser {
    _id: ObjectId | null | string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCode: string;
    userType: string;
}

export interface ILogin {
    email: string;
    password: string;
    code: string;
}

export interface ISearchQuery {
    model: Model<any>;
    ref: Nullable<string> | undefined;
    value: Nullable<any> | undefined;
    data: any;
    query: any;
    queryParam: any;
    populate: Array<any>;
    operator: Nullable<string>;
    fields?: Array<string>;

    // timestamps
    createdAt: string;
    updatedAt: string;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IPagination {
    total: number;
    count: number;
    pagination: {
        next: { page: number; limit: number };
        prev: { page: number; limit: number };
    };
    data: Array<any>;
}

export interface IAPIKeyUsage {
    keyHash: string;
    timestamp: Date;
    endpoint: string;
    ipAddress: string;
    userAgent: string;
    responseCode: number;
}

export interface IEmailRequest {
    recipient: string;
    subject: string;
    content: any;
    type: EmailType;
    template?: string;
    attachments?: any[];
}

export interface IEmailPreferences {
    marketing: boolean;
    productUpdates: boolean;
    featureAnnouncements: boolean;
    subscriptionStatus: string;
}

export interface ISensitiveData {
    card?: IDebitCard;
    providerRef: string;
    providerData: Array<Record<string, any>>;
}

export interface ICustomResponse<T> extends Response {
    customResults?: {
        success: boolean;
        count: number;
        total: number;
        pagination: {
            next?: { page: number; limit: number };
            prev?: { page: number; limit: number };
        };
        data: T[];
    };
    status: any;
}

export interface ICursorResponse<T> extends Response {
    customResults: {
        success: boolean;
        count: number;
        nextCursor: string | null;
        data: T[];
    };
}

export interface IQueryOptions {
    limit?: number;
    skip?: number;
    sort?: string;
    populate?: string;
    recentOnly?: boolean;
}

export interface AWSConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
}

export interface EmailConfig {
    fromEmail: string;
    fromName: string;
    replyTo?: string;
    service: EmailService;
    apiKey?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPass?: string;
    templateId?: string;
    isTestMode?: boolean;
    sendingDomain?: string;
    clientUrl?: string;
}

export interface PaymentConfig {
    provider: string;
    secretKey: string;
    publicKey: string;
    webhookSecret?: string;
    isTestMode: boolean;
}

export interface FrontendURLConfig {
    baseUrl: string;
    apiUrl?: string;
    paymentRedirectUrl?: string;
    dashboardUrl?: string;
}

export interface OAuthConfig {
    provider: OAuthProvider;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export interface OAuthProvidersConfig {
    google: OAuthConfig;
    github: OAuthConfig;
}

export interface IRedisOptions {
    family?: number;
    host: string;
    port: number;
    user: string;
    password: string;
    db: number;
    managed: boolean;
    tls: {
        rejectUnauthorized?: boolean;
        [key: string]: string | boolean | undefined;
    };
}

export interface IEmailJob {
    user: IUserDoc;
    subject: string;
    payload: Record<string, any>;
    driver: EmailService;
    template?: string;
    code?: string;
    metadata?: any;
    options?: {
        subject?: string;
        salute?: string;
        buttonUrl?: string;
        buttonText?: string;
        emailBody?: string;
        emailBodies?: Array<string>;
        bodyOne?: string;
        bodyTwo?: string;
        bodyThree?: string;
        otpType?: OtpType;
        status?: string;
    };
}

export interface IHackathonDoc extends Document {
    title: string;
    description?: string;
    slug: string;

    startDate: Date;
    endDate: Date;
    status: string;

    hackOpen?: boolean;
    hackClosed?: boolean;

    invitedBy?: ObjectId;

    tags: string[];
    domain?: string;

    resources: ObjectId[];
    toolkits?: string[];

    category?: string;

    location?: {
        venue?: string;
        city?: string;
        country?: string;
    };

    rules?: string;
    registrationDeadline?: Date;
    teamSizeLimit?: number;
    prizeDetails?: string;

    organizers?: ObjectId[];
    judges?: ObjectId[];
    mentors?: ObjectId[];

    isActive: boolean;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
    _versions: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IFile {
    stream?: PassThrough;
    metadataStream?: PassThrough;
    info?: FileInfo;
    mimeType?: string;
    fileName?: string;
    fieldname?: string;
    size?: number;
    fileType?: FileType;
    uploadId?: string;
    uploadedBy?: string;
}

export interface IFIleUpload {
    file: IFile;
    format: FileFormat;
    type: FileMimeType;
    name?: string;
    base64?: string;
}

export interface ITaskDoc extends Document {
    campaign: ObjectId;
    title: string;
    description?: string;
    projectId?: string;
    assignedTo?: ObjectId; // User
    status: TaskStatusType;
    review?: string;
    feedback?: string;
    addedToPortfolio?: boolean;
    dueDate?: Date;
    submissions?: ObjectId[]; // refs to Submission
    likes?: number;
    domain?: string;

    createdAt: Date;
    updatedAt: Date;
    _versions: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface ITeamDoc extends Document {
    teamName: string;
    slug: string;
    description?: string;
    projectId: ObjectId; // reference to project
    projectName: string;
    teamLead: string; // user id lead
    teamMembers: {
        userId: ObjectId;
        role: TeamRoles;
        joinedAt: Date;
    }[];
    teamSize: number;
    visibility: TeamVisibilty;
    isComplete: boolean;
    isDeactivated: boolean;
    competitions: ObjectId[]; // campaigns joined
    submissions: ObjectId[];
    pendingRequest: ObjectId[];
    createdAt: Date;
    updatedAt?: Date;
    updatedBy: ObjectId;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface ISubmissionDoc extends Document {
    campaign: ObjectId;
    team: ObjectId;
    teamName?: string;
    title: string;
    tagline?: string;
    description?: string;
    submissionURL?: string;
    demoURL?: string;
    techStack: string[];
    submittedBy?: ObjectId;
    submissionDate: Date;
    status:
        | SubmissionStatus.SUBMITTED
        | SubmissionStatus.UNDER_REVIEW
        | SubmissionStatus.APPROVED // ✅ changed from ACCEPTED
        | SubmissionStatus.REJECTED;
    badgesEarned: ObjectId[];
    rank?: number;
    likes: number;
    totalScore: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt?: Date;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface ISubmissionCommentDoc extends Document {
    submission: ObjectId;
    user: ObjectId;
    rating?: number;
    reaction?: string;
    comment: string;
    createdAt: Date;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IMedalAwardDoc extends Document {
    medal: ObjectId;
    user?: ObjectId;
    team?: ObjectId;
    awardedOn: Date;
    referenceId?: string;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IMedalDoc extends Document {
    name: string;
    description?: string;
    iconUrl?: string;
    type: MedalType.GOLD | MedalType.SILVER | MedalType.BRONZE;
    context: ActivityType.HACKATHON | ActivityType.PROJECT;
    createdAt: Date;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface ILeaderboardDoc extends Document {
    user: ObjectId; // Reference to User
    team?: ObjectId; // Optional, in case ranking by team
    hackathon?: ObjectId; // Reference to Hackathon/Campaign
    submission?: ObjectId; // Last submission tied to score
    totalPoints: number; // Overall accumulated points
    rank: number; // Global rank (or campaign rank if hackathon is set)
    badges: ObjectId[]; // Earned badges
    medals: {
        type: MedalType.GOLD | MedalType.SILVER | MedalType.BRONZE;
        context: ActivityType.HACKATHON | ActivityType.PROJECT;
        referenceId: ObjectId; // Campaign or Project reference
        awardedOn: Date;
    }[];
    criteriaScores: {
        criterion: string;
        score: number;
    }[];
    reactions: {
        teamId: ObjectId;
        hackId: ObjectId;
        rating?: number;
        reaction?: string;
        comment?: string;
    }[];
    updatedAt: Date;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IJudgeScoreDoc extends Document {
    submission: ObjectId;
    judge: ObjectId; // User
    score: number;
    feedback?: string;
    criteriaScores: Record<string, number>; // e.g. { innovation: 8, impact: 9 }
    createdAt: Date;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IBadgeAwardDoc extends Document {
    badge: ObjectId;
    user?: ObjectId;
    team?: ObjectId;
    awardedOn: Date;
    referenceId?: string; // campaign/submission id
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IBadgeDoc extends Document {
    name: string;
    description?: string;
    iconUrl?: string;
    awardedOn?: Date;
    domain?: string;
    createdAt: Date;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IProjectDoc extends Document {
    // core info
    title: string;
    teamName: string;
    tagline: string;
    description: string;
    projectDetails: string;
    category: string;
    tags: string[];
    techStack: string[];
    createdBy: string;
    image?: string;

    // submission info
    isSubmitted: boolean;
    isDraft?: boolean;
    isApproved?: boolean;
    isFinalist?: boolean;
    isWinner?: boolean;
    isPublished?: boolean;
    isArchived?: boolean;
    isActive?: boolean;
    isLocked?: boolean;
    isFeatured?: boolean;
    isDeleted?: boolean;

    submissionDate?: Date;
    status: SubmissionStatus;
    submissionURL?: string;
    demoURL?: string;
    repositoryURL?: string;
    videoURL?: string;
    attachments?: string[];

    // achievements
    badgesEarned?: string[];
    rank?: number;
    score?: number;

    // stage tracking
    projectStage: ProjectStageType;

    // relationships
    hackathonId: ObjectId;
    teamId: ObjectId;
    submittedBy: ObjectId; // creator/lead
    evaluationId?: ObjectId;
    evaluationStatus?: EvaluationStatusType;
    likes: ObjectId[];

    // system
    createdAt: Date;
    updatedAt?: Date;
    _id: ObjectId;
    submissionId: string;
}

export interface IResourceDoc extends Document {
    id: string;
    title: string;
    slug: string;
    description?: string;
    link?: string;
    content?: string;
    type?: ResourceType;

    image?: string;
    tags?: string[];
    category?: string;

    status?: ResourceStatus; // archived
    visibility?: ResourceVisibility;
    publishedAt?: Date;

    createdBy: string;
    author?: string;

    hackathonId?: string; // ObjectId or Any

    // engagement metrics if feel that we can make this like a function instead of storing it in array for the long run
    bookmarks: string[];
    likes: string[];

    createdAt?: Date;
    updatedAt?: Date;
}

export interface IMentorDoc extends Document {
    user: ObjectId;
    firstName: string;
    lastName: string;
    slug: string;
    status: MentorStatus;
    visibility: MentorVisibilty;
    mentorImage: IMentorImage | null;
    jobTitle: string;
    organization: string;
    bio: string;
    areasOfExpertise: string[];
    yearsOfExperience: string;
    email: string;
    linkedInUrl: string;
    githubUrl: string;
    websiteUrl: string;
    hackathon: ObjectId[];
    teamsMentoring: ObjectId[];
}

export interface INotificationDoc extends Document {
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    actionUrl?: string;
    userId: ObjectId;
    createdBy?: ObjectId;
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}

export interface IEventDoc extends Document {
    title: string;
    description?: string;
    date: Date;
    time?: string;
    location?: string;
    type: string;
    isRSVP: boolean;
    attendees: Array<ObjectId>;
    maxAttendees?: number;
    hackathonId?: ObjectId;
    createdBy: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: ObjectId;
    id: ObjectId | string;
}
