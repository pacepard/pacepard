import User from '@/dtos/user.dto';

interface Guest {
    code: string;
    firstName: string;
    lastName: string;
    slug: string;
    email: string;

    bio: string;
    jobTitle: string;
    organization: string;
    areasOfExpertise: Array<string>;
    yearsOfExperience: string;
    socials: Array<ISocials | any>;

    image: {
        fileName: string;
        s3Key: string;
    };

    type: GuestType; // 'mentor' | 'judge' | 'guest'
    visibility: GuestVisibility; // 'public' | 'private'
    status: GuestStatus; // 'active' | 'inactive'
    inviteStatus: GuestInviteStatus; // 'pending' | 'active'

    // Context-specific type (for mentors only)
    mentorType?: MentorContextType; // 'entry' | 'submission' | 'project' | 'hackathon'

    // ownership
    invitedBy: User | any;

    settings: {
        // Additional settings can be added here
    };

    // relationships
    user: User | any; // user this Guest profile belongs to
    hackathons: Array<any>; // hackathons this Guest is assigned to
    entries: Array<any>; // entries this Guest was invited to (for mentors only)
    projects: Array<any>; // projects this Guest is assigned to
    workspace: Array<any>; // workspaces this Guest belongs to

    // time stamps
    createdAt: Date;
    updatedAt: Date;
    _version: number;
    _id: any;
    id: any;
}

export enum GuestType {
    MENTOR = 'mentor',
    JUDGE = 'judge',
    GUEST = 'guest',
}

export enum MentorContextType {
    ENTRY = 'entry',
    SUBMISSION = 'submission',
    PROJECT = 'project',
    HACKATHON = 'hackathon',
}

export interface ISocials {
    name: string;
    url: string;
    username: string;
}

export enum GuestVisibility {
    PUBLIC = 'public',
    PRIVATE = 'private',
}

export enum GuestStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum GuestInviteStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
}

export default Guest;
