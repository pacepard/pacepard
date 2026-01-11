import { FileType, UploadStatus } from '../../utils/enums.util';
import { IFile } from '../../utils/interfaces.util';
import { MentorStatusEnum, MentorVisibiltyEnum } from './mentor.interface';

export interface IMentorImage {
    fileName: string;
    fileSize: number;
    fileType: FileType;
    mimetype: string;
    uploadedBy: string;
    uploadStatus: UploadStatus;
    uploadId: string;
    s3Key: string;
    rawFile: string;
}

export interface createMentorDTO {
    firstName: string;
    lastName: string;
    status: MentorStatusEnum;
    visibility: MentorVisibiltyEnum;
    mentorImage: IFile;
    jobTitle: string;
    organization: string;
    bio: string;
    areasOfExpertise: string[];
    yearsOfExperience: string;
    email: string;
    linkedInUrl: string;
    githubUrl: string;
    website: string;
    hackathonId: string;
    /// would be during requesting handling
    orgId: string;
}

export interface MentorInviteDTO {
    email: string;
    hackathonId: string;
    invitedBy: string;
}
