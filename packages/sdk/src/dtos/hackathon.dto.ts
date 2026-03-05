export enum HackStatusType {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    CLOSED = 'closed',
    ARCHIVED = 'archived',
}

export enum HackathonType {
    ONLINE = 'online',
    OFFLINE = 'offline',
    IN_PERSON = 'in-person',
    HYBRID = 'hybrid',
    GLOBAL = 'global',
    NATIONAL = 'national',
    INTERNATIONAL = 'international',
    REGIONAL = 'regional',
    LOCAL = 'local',
}

export interface IHackathon {
    id: string;
    _id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    status: HackStatusType;
    type: HackathonType;
    workspace: string | { id: string; name: string };
    settings: {
        startDate: string;
        startTime: string;
        startTimeZone: string;
        closeDate: string;
        closeTime: string;
        closeTimeZone: string;
    };
    createdAt: Date;
    updatedAt: Date;
    _version: number;
}

export interface GetHackathonsDTO {
    workspaceId?: string;
    status?: HackStatusType;
    limit?: number;
    page?: number;
    sort?: string;
}

export interface GetHackathonDTO {
    id: string;
}

export interface CreateHackathonDTO {
    name: string;
    description?: string;
    workspaceId: string;
    type?: HackathonType;
    settings?: Partial<IHackathon['settings']>;
}

export interface UpdateHackathonDTO {
    id: string;
    name?: string;
    description?: string;
    image?: string;
    status?: HackStatusType;
    type?: HackathonType;
    settings?: Partial<IHackathon['settings']>;
}
