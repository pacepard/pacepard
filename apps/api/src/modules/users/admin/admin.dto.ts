import { IUserDoc } from '../user/user.interface';
import { AdminDepartmentEnum, CompanyRoleEnum } from './admin.interface';

export interface CreateAdminDTO {
    code: string
    user: IUserDoc;
    firstName: string;
    lastName: string;
    email: string;
    department: AdminDepartmentEnum;
    position: CompanyRoleEnum;
    accessLevel?: number;
    accessLevelName?: string;
    accessLevelDescription?: string;
    createdBy?: string;
}

export interface UpdateAdminDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    department?: AdminDepartmentEnum;
    position?: CompanyRoleEnum;
    accessLevel?: number;
    accessLevelName?: string;
    accessLevelDescription?: string;
}

export interface InviteAdminDTO {
    email: string;
    resourceId?: string;
}

export interface AcceptAdminInvitationDTO {
    token: string;
    email: string;
    password: string;
}

export interface SetAdminPasswordDTO {
    password: string;
}
