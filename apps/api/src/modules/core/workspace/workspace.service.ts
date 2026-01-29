import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { IWorkspaceDoc, WorkspaceMemberRole } from './workspace.interface';
import {
    CreateWorkspaceDTO,
    UpdateWorkspaceDTO,
    AddMemberDTO,
    RemoveMemberDTO,
    AddMentorDTO,
    RemoveMentorDTO,
    AddJudgeDTO,
    RemoveJudgeDTO,
    UpdateDomainAccessDTO,
    GenerateShareableLinkDTO,
    JoinWorkspaceByLinkDTO,
} from './workspace.dto';
import workspaceRepository from './workspace.repository';
import { IResult, IFile } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genWorkspaceCode } from '../../../utils/code.util';
import permissionService from '../../authentication/permission/permission.service';
import storageService from '../../platform/storage/storage.service';
import shareableLinkService from '../../platform/ShareableLink/shareable-link.service';
import { ShareableLinkType } from '../../platform/ShareableLink/shareable-link.interface';
import userRepository from '../../users/user/user.repository';
import guestRepository from '../../users/guest/guest.repository';
import { GuestTypeEnum } from '../../users/guest/guest.interface';

type ObjectId = Types.ObjectId;

class WorkspaceService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createWorkspace
     * @description Creates a new workspace in the system.
     * @param {CreateWorkspaceDTO} data - The workspace payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createWorkspace(
        data: CreateWorkspaceDTO,
    ): Promise<IResult<{ workspace: IWorkspaceDoc }>> {
        let result: IResult<{ workspace: IWorkspaceDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { workspace: IWorkspaceDoc },
        };

        const { name, createdBy, user, icon } = data;

        if (!name || name.trim().length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Workspace name is required';
            return result;
        }

        const userId = createdBy || user?._id || user?.id;
        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message =
                'Creator information is required to create a workspace';
            return result;
        }

        // Handle icon upload if provided
        let iconData: { fileName: string; s3Key: string } | undefined;
        if (icon) {
            // If icon is an IFile with stream, upload it
            if (typeof icon === 'object' && (icon as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    icon as IFile,
                );

                if (uploadResult.error) {
                    result.error = true;
                    result.code = uploadResult.code || 500;
                    result.message = uploadResult.message;
                    return result;
                }

                iconData = {
                    fileName: uploadResult.data.fileName,
                    s3Key: uploadResult.data.s3Key,
                };
            } else if (typeof icon === 'object') {
                // If it's already uploaded, check if it has s3Key
                const iconWithS3Key = icon as any;
                if (iconWithS3Key.s3Key) {
                    iconData = {
                        fileName: iconWithS3Key.fileName,
                        s3Key: iconWithS3Key.s3Key,
                    };
                } else {
                    result.error = true;
                    result.code = 400;
                    result.message =
                        'Icon s3Key is required for already uploaded images';
                    return result;
                }
            }
        }

        // Generate unique workspace code
        let workspaceCode = genWorkspaceCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure code uniqueness
        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await workspaceRepository.findOne({
                code: workspaceCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                workspaceCode = genWorkspaceCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique workspace code';
            return result;
        }

        const workspaceData: any = {
            code: workspaceCode,
            name: name.trim(),
            createdBy: new Types.ObjectId(userId),
            hackathons: [],
            projects: [],
            members: [
                {
                    user: new Types.ObjectId(userId),
                    role: WorkspaceMemberRole.OWNER, // Creator is always OWNER
                    joinedAt: new Date(),
                },
            ],
            invites: [],
            mentors: [],
            judges: [],
        };

        // Add icon if uploaded
        if (iconData) {
            workspaceData.icon = iconData;
        }

        const createResult =
            await workspaceRepository.createWorkspace(workspaceData);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message =
                createResult.message;
            return result;
        }

        result.message = 'Workspace created successfully';
        result.code = 201;
        result.data = { workspace: createResult.data as IWorkspaceDoc };
        return result;
    }

    /**
     * @name updateWorkspace
     * @description Updates a workspace with new details
     * @param data - UpdateWorkspaceDTO containing workspaceId, user, and update data
     */
    public async updateWorkspace(data: UpdateWorkspaceDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, user } = data;

        // Find the workspace
        const findResult = await workspaceRepository.findById(workspaceId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = findResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'workspace', action: 'update' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to update this workspace';
            return result;
        }

        const updateData: Partial<IWorkspaceDoc> = {};
        if (data.name !== undefined) {
            updateData.name = data.name.trim();
        }

        // Update the workspace
        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Workspace updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getWorkspace
     * @description Retrieves a workspace by ID, including populated relations
     */
    public async getWorkspace(workspaceId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const workspaceResult = await workspaceRepository.findById(
            workspaceId,
            [
                { path: 'hackathons' },
                { path: 'projects' },
                { path: 'members' },
                { path: 'invites' },
                { path: 'mentors' },
                { path: 'judges' },
                { path: 'createdBy' },
            ],
        );

        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        result.data = workspaceResult.data;
        result.message = 'Workspace retrieved successfully';
        return result;
    }

    /**
     * @name getWorkspaces
     * @description Retrieves all workspaces with optional filtering and pagination
     */
    public async getWorkspaces(
        filter?: any,
        options?: {
            select?: string;
            sort?: string;
            page?: number;
            limit?: number;
            populate?: string | any;
        },
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        const workspacesResult = await workspaceRepository.getWorkspaces(
            filter,
            options,
        );

        if (workspacesResult.error) {
            result.error = true;
            result.code = workspacesResult.code || 500;
            result.message = workspacesResult.message;
            return result;
        }

        result.data = workspacesResult.data;
        result.pagination = workspacesResult.pagination;
        result.pagination!.count = workspacesResult.pagination?.count || 0;
        result.pagination!.total = workspacesResult.pagination?.total || 0;
        result.message = 'Workspaces retrieved successfully';
        return result;
    }

    /**
     * @name deleteWorkspace
     * @description Deletes a workspace
     * @param workspaceId - The workspace ID
     * @param user - Optional user for permission checking
     */
    public async deleteWorkspace(
        workspaceId: string,
        user?: IUserDoc | string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the workspace
        const findResult = await workspaceRepository.findById(workspaceId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = findResult.data as IWorkspaceDoc;

        // Check permissions if user is provided
        if (user) {
            const hasPermission = await permissionService.hasPermission(
                user,
                { entity: 'workspace', action: 'delete' },
                {
                    resource: workspace,
                    resourceType: 'workspace',
                    checkOwnership: true,
                },
            );

            if (!hasPermission) {
                result.error = true;
                result.code = 403;
                result.message = 'You do not have permission to delete this workspace';
                return result;
            }
        }

        // Delete the workspace
        const deleteResult =
            await workspaceRepository.deleteWorkspace(workspaceId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Workspace deleted successfully';
        result.data = deleteResult.data;
        return result;
    }

    /**
     * @name addMember
     * @description Adds a member to a workspace with a specific role
     * @param data - AddMemberDTO containing workspaceId, userId, role, and requestingUser
     */
    public async addMember(data: AddMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const {
            workspaceId,
            userId,
            role = WorkspaceMemberRole.MANAGER,
            invitedBy,
            requestingUser,
        } = data;

        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'workspace', action: 'manage-members' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage members in this workspace';
            return result;
        }

        // Check if user is already a member
        const existingMember = (workspace.members || []).find((m: any) => {
            const memberUserId = typeof m.user === 'object' 
                ? String(m.user._id || m.user.id) 
                : String(m.user);
            return memberUserId === userId;
        });

        if (existingMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is already a member of this workspace';
            return result;
        }

        // Add new member with role
        const members = [...(workspace.members || [])];
        members.push({
            user: new Types.ObjectId(userId),
            role: role,
            joinedAt: new Date(),
            invitedBy: invitedBy ? new Types.ObjectId(invitedBy) : undefined,
        });

        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            {
                members: members as any,
            },
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Member added successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name removeMember
     * @description Removes a member from a workspace
     * @param data - RemoveMemberDTO containing workspaceId, userId, and requestingUser
     */
    public async removeMember(data: RemoveMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, userId, requestingUser } = data;

        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'workspace', action: 'manage-members' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage members in this workspace';
            return result;
        }

        // Find and remove the member
        const members = (workspace.members || []).filter((m: any) => {
            const memberUserId = typeof m.user === 'object' 
                ? String(m.user._id || m.user.id) 
                : String(m.user);
            return memberUserId !== userId;
        });

        // Check if member was found
        if (members.length === (workspace.members || []).length) {
            result.error = true;
            result.code = 404;
            result.message = 'Member not found in this workspace';
            return result;
        }

        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            {
                members: members as any,
            },
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Member removed successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name addMentor
     * @description Adds a mentor (guest with type: MENTOR) to a workspace
     * @param data - AddMentorDTO containing workspaceId, mentorId (guestId), and requestingUser
     */
    public async addMentor(data: AddMentorDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, mentorId, requestingUser } = data;

        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        // Verify the guest exists and is of type MENTOR
        const guestResult = await guestRepository.findGuest(mentorId);
        if (guestResult.error || !guestResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Guest not found';
            return result;
        }

        const guest = guestResult.data as any;
        if (guest.type !== GuestTypeEnum.MENTOR) {
            result.error = true;
            result.code = 400;
            result.message = 'Guest must be of type MENTOR to be added as a mentor';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'workspace', action: 'manage-mentors' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage mentors in this workspace';
            return result;
        }

        // Check if mentor is already in workspace
        const existingMentor = (workspace.mentors || []).find((m: any) => {
            const mentorIdStr = typeof m === 'object' 
                ? String(m._id || m.id) 
                : String(m);
            return mentorIdStr === mentorId;
        });

        if (existingMentor) {
            result.error = true;
            result.code = 400;
            result.message = 'Mentor is already in this workspace';
            return result;
        }

        // Add mentor to workspace
        const mentors = [...(workspace.mentors || [])];
        mentors.push(new Types.ObjectId(mentorId));

        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            {
                mentors: mentors as any,
            },
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Mentor added successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name removeMentor
     * @description Removes a mentor from a workspace
     * @param data - RemoveMentorDTO containing workspaceId, mentorId, and requestingUser
     */
    public async removeMentor(data: RemoveMentorDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, mentorId, requestingUser } = data;

        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'workspace', action: 'manage-mentors' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage mentors in this workspace';
            return result;
        }

        // Find and remove the mentor
        const mentors = (workspace.mentors || []).filter((m: any) => {
            const mentorIdStr = typeof m === 'object' 
                ? String(m._id || m.id) 
                : String(m);
            return mentorIdStr !== mentorId;
        });

        // Check if mentor was found
        if (mentors.length === (workspace.mentors || []).length) {
            result.error = true;
            result.code = 404;
            result.message = 'Mentor not found in this workspace';
            return result;
        }

        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            {
                mentors: mentors as any,
            },
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Mentor removed successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getMentors
     * @description Gets all mentors in a workspace
     * @param workspaceId - The workspace ID
     */
    public async getMentors(workspaceId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        const workspaceResult = await workspaceRepository.findById(
            workspaceId,
            [{ path: 'mentors' }],
        );

        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;
        result.data = workspace.mentors || [];
        result.message = 'Mentors retrieved successfully';
        return result;
    }

    /**
     * @name addJudge
     * @description Adds a judge (guest with type: JUDGE) to a workspace
     * @param data - AddJudgeDTO containing workspaceId, judgeId (guestId), and requestingUser
     */
    public async addJudge(data: AddJudgeDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, judgeId, requestingUser } = data;

        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        // Verify the guest exists and is of type JUDGE
        const guestResult = await guestRepository.findGuest(judgeId);
        if (guestResult.error || !guestResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Guest not found';
            return result;
        }

        const guest = guestResult.data as any;
        if (guest.type !== GuestTypeEnum.JUDGE) {
            result.error = true;
            result.code = 400;
            result.message = 'Guest must be of type JUDGE to be added as a judge';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'workspace', action: 'manage-judges' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage judges in this workspace';
            return result;
        }

        // Check if judge is already in workspace
        const existingJudge = (workspace.judges || []).find((j: any) => {
            const judgeIdStr = typeof j === 'object' 
                ? String(j._id || j.id) 
                : String(j);
            return judgeIdStr === judgeId;
        });

        if (existingJudge) {
            result.error = true;
            result.code = 400;
            result.message = 'Judge is already in this workspace';
            return result;
        }

        // Add judge to workspace
        const judges = [...(workspace.judges || [])];
        judges.push(new Types.ObjectId(judgeId));

        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            {
                judges: judges as any,
            },
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Judge added successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name removeJudge
     * @description Removes a judge from a workspace
     * @param data - RemoveJudgeDTO containing workspaceId, judgeId, and requestingUser
     */
    public async removeJudge(data: RemoveJudgeDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, judgeId, requestingUser } = data;

        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'workspace', action: 'manage-judges' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage judges in this workspace';
            return result;
        }

        // Find and remove the judge
        const judges = (workspace.judges || []).filter((j: any) => {
            const judgeIdStr = typeof j === 'object' 
                ? String(j._id || j.id) 
                : String(j);
            return judgeIdStr !== judgeId;
        });

        // Check if judge was found
        if (judges.length === (workspace.judges || []).length) {
            result.error = true;
            result.code = 404;
            result.message = 'Judge not found in this workspace';
            return result;
        }

        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            {
                judges: judges as any,
            },
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Judge removed successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getJudges
     * @description Gets all judges in a workspace
     * @param workspaceId - The workspace ID
     */
    public async getJudges(workspaceId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: [],
        };

        const workspaceResult = await workspaceRepository.findById(
            workspaceId,
            [{ path: 'judges' }],
        );

        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;
        result.data = workspace.judges || [];
        result.message = 'Judges retrieved successfully';
        return result;
    }

    /**
     * @name updateDomainAccess
     * @description Updates domain-based access configuration for a workspace
     * @param data - UpdateDomainAccessDTO containing workspaceId, allowDomainAccess, and optional domain
     * @returns Promise<IResult>
     */
    public async updateDomainAccess(
        data: UpdateDomainAccessDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, allowDomainAccess, domain } = data;

        // Find the workspace
        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        const { user } = data;
        if (!user) {
            result.error = true;
            result.code = 400;
            result.message = 'User is required';
            return result;
        }

        // Check permissions (only workspace owner can update domain access)
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'workspace', action: 'update' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message =
                'You do not have permission to update domain access for this workspace';
            return result;
        }

        const updateData: Partial<IWorkspaceDoc> = {
            allowDomainAccess: allowDomainAccess,
        };

        // If enabling domain access and domain is provided, add it to allowedDomains
        if (allowDomainAccess && domain) {
            const normalizedDomain = domain.trim().toLowerCase();
            const currentDomains = workspace.allowedDomains || [];
            
            // Add domain if not already present
            if (!currentDomains.includes(normalizedDomain)) {
                updateData.allowedDomains = [...currentDomains, normalizedDomain];
            } else {
                updateData.allowedDomains = currentDomains;
            }
        } else if (!allowDomainAccess) {
            // If disabling domain access, clear allowed domains
            updateData.allowedDomains = [];
        } else {
            // Keep existing domains if just toggling without new domain
            updateData.allowedDomains = workspace.allowedDomains || [];
        }

        // Update the workspace
        const updateResult = await workspaceRepository.updateWorkspace(
            workspaceId,
            updateData,
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Domain access updated successfully';
        result.data = {
            allowDomainAccess: updateData.allowDomainAccess,
            allowedDomains: updateData.allowedDomains,
        };
        return result;
    }

    /**
     * @name generateShareableLink
     * @description Generates a shareable link token for a workspace
     * @param data - GenerateShareableLinkDTO containing workspaceId, expiresInDays, and user
     * @returns Promise<IResult>
     */
    public async generateShareableLink(
        data: GenerateShareableLinkDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { workspaceId, expiresInDays = 7, user } = data;

        if (!user) {
            result.error = true;
            result.code = 400;
            result.message = 'User is required';
            return result;
        }

        // Find the workspace
        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Check permissions (only workspace owner can generate shareable link)
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'workspace', action: 'update' },
            {
                resource: workspace,
                resourceType: 'workspace',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message =
                'You do not have permission to generate shareable link for this workspace';
            return result;
        }

        // Get user ID (handle both string and IUserDoc)
        const userId = typeof user === 'string' ? user : (user as IUserDoc)?._id?.toString() || (user as IUserDoc)?.id?.toString();

        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        // Prepare metadata with workspace domain access settings
        const metadata: Record<string, unknown> = {};
        if (workspace.allowDomainAccess !== undefined) {
            metadata.allowDomainAccess = workspace.allowDomainAccess;
        }
        if (workspace.allowedDomains) {
            metadata.allowedDomains = workspace.allowedDomains;
        }

        // Generate shareable link using the service
        const linkResult = await shareableLinkService.generateShareableLink({
            linkType: ShareableLinkType.WORKSPACE,
            resourceId: workspaceId,
            createdBy: userId,
            expiresInDays,
            metadata,
        });

        if (linkResult.error) {
            result.error = true;
            result.code = linkResult.code || 500;
            result.message = linkResult.message;
            return result;
        }

        result.message = 'Shareable link generated successfully';
        result.data = {
            token: (linkResult.data as any).token,
            expiresAt: (linkResult.data as any).expiresAt,
            shareableUrl: `${process.env.CLIENT_APP_URL || ''}/workspace/invite/join?token=${(linkResult.data as any).token}&workspaceId=${workspaceId}`,
            linkId: (linkResult.data as any).linkId,
        };
        return result;
    }

    /**
     * @name joinWorkspaceByLink
     * @description Allows a user to join a workspace using a shareable link token
     * @param data - JoinWorkspaceByLinkDTO containing token, workspaceId, and optional userEmail
     * @returns Promise<IResult>
     */
    public async joinWorkspaceByLink(
        data: JoinWorkspaceByLinkDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { token, workspaceId, userEmail } = data;

        // Find the workspace
        const workspaceResult = await workspaceRepository.findById(workspaceId);
        if (workspaceResult.error || !workspaceResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        const workspace = workspaceResult.data as IWorkspaceDoc;

        // Validate shareable link using the service
        const validateResult = await shareableLinkService.validateShareableLink({
            token,
            resourceId: workspaceId,
            linkType: ShareableLinkType.WORKSPACE,
        });

        if (validateResult.error) {
            result.error = true;
            result.code = validateResult.code || 400;
            result.message = validateResult.message;
            return result;
        }

        // Get metadata from validated link
        const linkMetadata = (validateResult.data as any).metadata || {};
        const allowDomainAccess = linkMetadata.allowDomainAccess || workspace.allowDomainAccess;
        const allowedDomains = linkMetadata.allowedDomains || workspace.allowedDomains || [];

        // If domain access is enabled, validate user email domain
        if (allowDomainAccess && userEmail) {
            const emailDomain = userEmail.split('@')[1]?.toLowerCase();

            if (!emailDomain || !allowedDomains.includes(emailDomain)) {
                result.error = true;
                result.code = 403;
                result.message = `Your email domain is not allowed. Allowed domains: ${allowedDomains.join(', ')}`;
                return result;
            }
        }

        // Note: The actual user joining logic should be handled by the controller
        // which will have access to the authenticated user
        // This service method just validates the token and domain

        result.message = 'Shareable link is valid';
        result.data = {
            workspaceId: workspaceId,
            workspaceName: workspace.name,
            allowDomainAccess: allowDomainAccess,
            allowedDomains: allowedDomains,
        };
        return result;
    }
}

export default new WorkspaceService();
