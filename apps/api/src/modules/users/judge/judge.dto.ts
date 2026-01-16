import { FileType, UploadStatus } from '../../../utils/enums.util';
import { IFile } from '../../../utils/interfaces.util';
import { JudgeStatusEnum, JudgeVisibiltyEnum } from './judge.interface';

export interface IJudgeImage {
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

export interface createJudgeDTO {
    firstName: string;
    lastName: string;
    status?: JudgeStatusEnum;
    visibility?: JudgeVisibiltyEnum;
    judgeImage?: IFile;
    jobTitle?: string;
    organization?: string;
    bio?: string;
    areasOfExpertise?: string[];
    yearsOfExperience?: string;
    email: string;
    linkedInUrl?: string;
    githubUrl?: string;
    website?: string;
    hackathonId?: string;
    /// would be during requesting handling
    orgId: string;
}

export interface JudgeInviteDTO {
    email: string;
    hackathonId: string;
    invitedBy: string;
}
