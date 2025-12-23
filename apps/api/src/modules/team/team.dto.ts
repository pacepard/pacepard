import { TeamVisibilty } from "../../utils/eums.util"

export interface createTeamDto {
  teamName: string;
  description: string;
  projectName: string;
  teamSize: number;
  visibility: TeamVisibilty;
  competitions: string; // or Hackaton
  createdAt: Date;
}

export interface TeamDTO {
  teamId: string;
  teamName: string;
  slug: string;
  description?: string;
  projectId: string; // already populated
  projectName?: string;
  teamLead: string; // already populated
  teamMembers: {
    userId: string;
    role: string;
    joinedAt: Date;
  }[];
  teamSize: number;
  visibility: string;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMembersDTO {
  teamId: string;
  teamName: string;
  description?: string;
  teamLead: string; // already populated
  teamMembers: {
    userId: string;
    role: string;
    joinedAt: Date;
  }[];
  teamSize: number;
  visibility: string;
  isComplete: boolean;
}

export interface updatedDTO {
  teamId: string;
  teamName: string;
  slug: string;
  description?: string;
  projectName?: string;
  teamSize: number;
  visibility: string;
  updatedAt: Date;
}
