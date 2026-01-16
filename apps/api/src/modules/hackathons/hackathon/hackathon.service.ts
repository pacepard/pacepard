import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import {
    IHackathonDoc,
    HackStatusType,
    HackathonMemberRole,
} from './hackathon.interface';
import {
    CreateHackathonDTO,
    UpdateHackathonDTO,
    AddMemberDTO,
    RemoveMemberDTO,
} from './hackathon.dto';
import hackathonRepository from './hackathon.repository';
import workspaceRepository from '../../core/workspace/workspace.repository';
import businessRepository from '../../users/business/business.repository';
import { IResult } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genHackathonCode } from '../../../utils/code.util';
import { genSlug } from '../../../utils/helpers.util';
import permissionService from '../../authentication/permission/permission.service';

type ObjectId = Types.ObjectId;

class HackathonService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createHackathon
     * @description Creates a new hackathon in the system.
     * @param {CreateHackathonDTO} data - The hackathon payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createHackathon(
        data: CreateHackathonDTO,
    ): Promise<IResult<{ hackathon: IHackathonDoc }>> {
        let result: IResult<{ hackathon: IHackathonDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { hackathon: IHackathonDoc },
        };

        const { name, description, workspaceId, user, createdBy, type } = data;

        if (!name || name.trim().length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Hackathon name is required';
            return result;
        }

        if (!description || description.trim().length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Hackathon description is required';
            return result;
        }

        if (!workspaceId) {
            result.error = true;
            result.code = 400;
            result.message = 'Workspace ID is required';
            return result;
        }

        const userId = createdBy || user?._id || user?.id;
        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message =
                'Creator information is required to create a hackathon';
            return result;
        }

        // Validate workspace exists
        const workspaceCheck = await workspaceRepository.findById(workspaceId);
        if (workspaceCheck.error || !workspaceCheck.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Workspace not found';
            return result;
        }

        // Check if business profile exists and has access to the workspace
        if (user) {
            const businessCheck = await businessRepository.findOne({
                user: user.id,
                workspaces: workspaceId,
            });

            if (businessCheck.error || !businessCheck.data) {
                result.error = true;
                result.code = 403;
                result.message =
                    'Authorized business profile not found or does not have access to this workspace';
                return result;
            }

            data.businessId = businessCheck.data.id;
        }

        // Generate unique hackathon code
        let hackathonCode = genHackathonCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure code uniqueness
        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await hackathonRepository.findOne({
                code: hackathonCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                hackathonCode = genHackathonCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique hackathon code';
            return result;
        }

        // Generate slug
        const slug = genSlug(name);
        const existingSlugResult = await hackathonRepository.findOne({
            slug: slug,
        });
        if (existingSlugResult.error === false && existingSlugResult.data) {
            result.error = true;
            result.code = 400;
            result.message = 'Hackathon with this name already exists';
            return result;
        }

        const hackathonData = {
            code: hackathonCode,
            name: name.trim(),
            slug: slug,
            description: description.trim(),
            image: data.image || '',
            status: HackStatusType.DRAFT,
            type: type || 'online',
            createdBy: new Types.ObjectId(userId),
            workspace: new Types.ObjectId(workspaceId),
            business: data.businessId
                ? new Types.ObjectId(data.businessId)
                : undefined,
            settings: data.settings || {
                language: 'en',
                startTime: '',
                startDate: '',
                startTimeZone: '',
                isClosed: 'false',
                closeTime: '',
                closeDate: '',
                closeTimeZone: '',
                closeMessageTitle: '',
                closeMessageDescription: '',
                redirectOnClose: '',
            },
            formtype: data.formtype || '',
            forms: [],
            entries: [],
            submissions: [],
            members: [
                {
                    user: new Types.ObjectId(userId),
                    role: HackathonMemberRole.OWNER,
                    joinedAt: new Date(),
                },
            ],
            mentors: [],
            judges: [],
            organizers: [],
        };

        const createResult = await hackathonRepository.createHackathon(hackathonData as Partial<IHackathonDoc>);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message = 
                createResult.message || 'Failed to create hackathon';
            return result;
        }

        result.message = 'Hackathon created successfully';
        result.code = 201;
        result.data = { hackathon: createResult.data as IHackathonDoc };
        return result;
    }

    /**
     * @name updateHackathon
     * @description Updates a hackathon with new details
     * @param data - UpdateHackathonDTO containing hackathonId, user, and update data
     */
    public async updateHackathon(data: UpdateHackathonDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { hackathonId, user } = data;

        // Find the hackathon
        const findResult = await hackathonRepository.findById(hackathonId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        const hackathon = findResult.data as IHackathonDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'hackathon', action: 'update' },
            {
                resource: hackathon,
                resourceType: 'hackathon',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to update this hackathon';
            return result;
        }

        const updateData: Partial<IHackathonDoc> = {};
        if (data.name !== undefined) {
            updateData.name = data.name.trim();
            updateData.slug = genSlug(data.name);
        }
        if (data.description !== undefined) {
            updateData.description = data.description.trim();
        }
        if (data.type !== undefined) {
            updateData.type = data.type as any;
        }
        if (data.status !== undefined) {
            updateData.status = data.status;
        }
        if (data.image !== undefined) {
            updateData.image = data.image;
        }
        if (data.settings !== undefined) {
            updateData.settings = data.settings as any;
        }
        if (data.formtype !== undefined) {
            updateData.formtype = data.formtype as any;
        }

        // Update the hackathon
        const updateResult = await hackathonRepository.updateHackathon(
            hackathonId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Hackathon updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getHackathon
     * @description Retrieves a hackathon by ID, including populated relations
     */
    public async getHackathon(hackathonId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const hackathonResult = await hackathonRepository.findHackathon(
            hackathonId,
            [
                { path: 'workspace' },
                { path: 'business' },
                { path: 'forms' },
                { path: 'entries' },
                { path: 'submissions' },
                { path: 'members.user' },
                { path: 'mentors.user' },
                { path: 'judges.user' },
                { path: 'organizers.user' },
                { path: 'createdBy' },
            ],
        );

        if (hackathonResult.error || !hackathonResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        result.data = hackathonResult.data;
        result.message = 'Hackathon retrieved successfully';
        return result;
    }

    /**
     * @name getHackathons
     * @description Retrieves all hackathons with optional filtering and pagination
     */
    public async getHackathons(
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

        const hackathonsResult = await hackathonRepository.getHackathons(
            filter,
            options,
        );

        if (hackathonsResult.error) {
            result.error = true;
            result.code = hackathonsResult.code || 500;
            result.message = hackathonsResult.message;
            return result;
        }

        result.data = hackathonsResult.data;
        result.pagination = hackathonsResult.pagination;
        result.pagination!.count = hackathonsResult.pagination?.count || 0;
        result.pagination!.total = hackathonsResult.pagination?.total || 0;
        result.message = 'Hackathons retrieved successfully';
        return result;
    }

    /**
     * @name deleteHackathon
     * @description Deletes a hackathon
     * @param hackathonId - The hackathon ID
     * @param user - Optional user for permission checking
     */
    public async deleteHackathon(
        hackathonId: string,
        user?: IUserDoc | string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the hackathon
        const findResult = await hackathonRepository.findById(hackathonId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        const hackathon = findResult.data as IHackathonDoc;

        // Check permissions if user is provided
        if (user) {
            const hasPermission = await permissionService.hasPermission(
                user,
                { entity: 'hackathon', action: 'delete' },
                {
                    resource: hackathon,
                    resourceType: 'hackathon',
                    checkOwnership: true,
                },
            );

            if (!hasPermission) {
                result.error = true;
                result.code = 403;
                result.message = 'You do not have permission to delete this hackathon';
                return result;
            }
        }

        // Delete the hackathon
        const deleteResult =
            await hackathonRepository.deleteHackathon(hackathonId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Hackathon deleted successfully';
        result.data = deleteResult.data;
        return result;
    }

    /**
     * @name addMember
     * @description Adds a member to a hackathon with a specific role
     * @param data - AddMemberDTO containing hackathonId, userId, role, and requestingUser
     */
    public async addMember(data: AddMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const {
            hackathonId,
            userId,
            role = HackathonMemberRole.ORGANIZER,
            invitedBy,
            requestingUser,
        } = data;

        const hackathonResult = await hackathonRepository.findById(hackathonId);
        if (hackathonResult.error || !hackathonResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        const hackathon = hackathonResult.data as IHackathonDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'hackathon', action: 'manage-members' },
            {
                resource: hackathon,
                resourceType: 'hackathon',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage members in this hackathon';
            return result;
        }

        // Check if user is already a member
        const existingMember = (hackathon.members || []).find((m: any) => {
            const memberUserId = typeof m.user === 'object'
                ? String(m.user._id || m.user.id)
                : String(m.user);
            return memberUserId === userId;
        });

        if (existingMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is already a member of this hackathon';
            return result;
        }

        // Add new member with role
        const members = [...(hackathon.members || [])];
        members.push({
            user: new Types.ObjectId(userId),
            role: role,
            joinedAt: new Date(),
            assignedBy: invitedBy ? new Types.ObjectId(invitedBy) : undefined,
        });

        const updateResult = await hackathonRepository.updateHackathon(
            hackathonId,
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
     * @description Removes a member from a hackathon
     * @param data - RemoveMemberDTO containing hackathonId, userId, and requestingUser
     */
    public async removeMember(data: RemoveMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { hackathonId, userId, requestingUser } = data;

        const hackathonResult = await hackathonRepository.findById(hackathonId);
        if (hackathonResult.error || !hackathonResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        const hackathon = hackathonResult.data as IHackathonDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'hackathon', action: 'manage-members' },
            {
                resource: hackathon,
                resourceType: 'hackathon',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage members in this hackathon';
            return result;
        }

        // Find and remove the member
        const members = (hackathon.members || []).filter((m: any) => {
            const memberUserId = typeof m.user === 'object'
                ? String(m.user._id || m.user.id)
                : String(m.user);
            return memberUserId !== userId;
        });

        // Check if member was found
        if (members.length === (hackathon.members || []).length) {
            result.error = true;
            result.code = 404;
            result.message = 'Member not found in this hackathon';
            return result;
        }

        const updateResult = await hackathonRepository.updateHackathon(
            hackathonId,
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
}

export default new HackathonService();
