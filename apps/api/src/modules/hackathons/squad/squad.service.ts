import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { ISquadDoc, SquadMemberRole } from './squad.interface';
import {
    CreateSquadDTO,
    UpdateSquadDTO,
    AddMemberDTO,
    RemoveMemberDTO,
} from './squad.dto';
import squadRepository from './squad.repository';
import hackathonRepository from '../hackathon/hackathon.repository';
import { IResult } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genSquadCode } from '../../../utils/code.util';
import permissionService from '../../authentication/permission/permission.service';

type ObjectId = Types.ObjectId;

class SquadService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createSquad
     * @description Creates a new squad in the system.
     * @param {CreateSquadDTO} data - The squad payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createSquad(
        data: CreateSquadDTO,
    ): Promise<IResult<{ squad: ISquadDoc }>> {
        let result: IResult<{ squad: ISquadDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { squad: ISquadDoc },
        };

        const { name, description, hackathonId, user, createdBy } = data;

        if (!name || name.trim().length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Squad name is required';
            return result;
        }

        if (!hackathonId) {
            result.error = true;
            result.code = 400;
            result.message = 'Hackathon ID is required';
            return result;
        }

        const userId = createdBy || user?._id || user?.id;
        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Creator information is required to create a squad';
            return result;
        }

        // Validate hackathon exists
        const hackathonCheck = await hackathonRepository.findById(hackathonId);
        if (hackathonCheck.error || !hackathonCheck.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Hackathon not found';
            return result;
        }

        // Generate unique squad code
        let squadCode = genSquadCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure code uniqueness
        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await squadRepository.findOne({
                code: squadCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                squadCode = genSquadCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique squad code';
            return result;
        }

        const squadData = {
            code: squadCode,
            name: name.trim(),
            description: description || '',
            createdBy: new Types.ObjectId(userId),
            hackathon: new Types.ObjectId(hackathonId),
            members: [
                {
                    user: new Types.ObjectId(userId),
                    role: SquadMemberRole.LEAD,
                    joinedAt: new Date(),
                },
            ],
        };

        const createResult = await squadRepository.createSquad(squadData);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message = createResult.message;
            return result;
        }

        result.message = 'Squad created successfully';
        result.code = 201;
        result.data = { squad: createResult.data as ISquadDoc };
        return result;
    }

    /**
     * @name updateSquad
     * @description Updates a squad with new details
     * @param data - UpdateSquadDTO containing squadId, user, and update data
     */
    public async updateSquad(data: UpdateSquadDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { squadId, user } = data;

        // Find the squad
        const findResult = await squadRepository.findById(squadId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Squad not found';
            return result;
        }

        const squad = findResult.data as ISquadDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'squad', action: 'update' },
            {
                resource: squad,
                resourceType: 'squad',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to update this squad';
            return result;
        }

        const updateData: Partial<ISquadDoc> = {};
        if (data.name !== undefined) {
            updateData.name = data.name.trim();
        }
        if (data.description !== undefined) {
            updateData.description = data.description.trim();
        }

        // Update the squad
        const updateResult = await squadRepository.updateSquad(
            squadId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Squad updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getSquad
     * @description Retrieves a squad by ID, including populated relations
     */
    public async getSquad(squadId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const squadResult = await squadRepository.findSquad(squadId, [
            { path: 'hackathon' },
            { path: 'members.user' },
            { path: 'createdBy' },
        ]);

        if (squadResult.error || !squadResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Squad not found';
            return result;
        }

        result.data = squadResult.data;
        result.message = 'Squad retrieved successfully';
        return result;
    }

    /**
     * @name getSquads
     * @description Retrieves all squads with optional filtering and pagination
     */
    public async getSquads(
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

        const squadsResult = await squadRepository.getSquads(filter, options);

        if (squadsResult.error) {
            result.error = true;
            result.code = squadsResult.code || 500;
            result.message = squadsResult.message;
            return result;
        }

        result.data = squadsResult.data;
        result.pagination = squadsResult.pagination;
        result.pagination!.count = squadsResult.pagination?.count || 0;
        result.pagination!.total = squadsResult.pagination?.total || 0;
        result.message = 'Squads retrieved successfully';
        return result;
    }

    /**
     * @name deleteSquad
     * @description Deletes a squad
     * @param squadId - The squad ID
     * @param user - Optional user for permission checking
     */
    public async deleteSquad(
        squadId: string,
        user?: IUserDoc | string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the squad
        const findResult = await squadRepository.findById(squadId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Squad not found';
            return result;
        }

        const squad = findResult.data as ISquadDoc;

        // Check permissions if user is provided
        if (user) {
            const hasPermission = await permissionService.hasPermission(
                user,
                { entity: 'squad', action: 'delete' },
                {
                    resource: squad,
                    resourceType: 'squad',
                    checkOwnership: true,
                },
            );

            if (!hasPermission) {
                result.error = true;
                result.code = 403;
                result.message = 'You do not have permission to delete this squad';
                return result;
            }
        }

        // Delete the squad
        const deleteResult = await squadRepository.deleteSquad(squadId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Squad deleted successfully';
        result.data = deleteResult.data;
        return result;
    }

    /**
     * @name addMember
     * @description Adds a member to a squad with a specific role
     * @param data - AddMemberDTO containing squadId, userId, role, and requestingUser
     */
    public async addMember(data: AddMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const {
            squadId,
            userId,
            role = SquadMemberRole.MEMBER,
            requestingUser,
        } = data;

        const squadResult = await squadRepository.findById(squadId);
        if (squadResult.error || !squadResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Squad not found';
            return result;
        }

        const squad = squadResult.data as ISquadDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'squad', action: 'manage-members' },
            {
                resource: squad,
                resourceType: 'squad',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage members in this squad';
            return result;
        }

        // Check if user is already a member
        const existingMember = (squad.members || []).find((m: any) => {
            const memberUserId = typeof m.user === 'object'
                ? String(m.user._id || m.user.id)
                : String(m.user);
            return memberUserId === userId;
        });

        if (existingMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is already a member of this squad';
            return result;
        }

        // Add new member with role
        const members = [...(squad.members || [])];
        members.push({
            user: new Types.ObjectId(userId),
            role: role,
            joinedAt: new Date(),
        });

        const updateResult = await squadRepository.updateSquad(squadId, {
            members: members as any,
        });

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
     * @description Removes a member from a squad
     * @param data - RemoveMemberDTO containing squadId, userId, and requestingUser
     */
    public async removeMember(data: RemoveMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { squadId, userId, requestingUser } = data;

        const squadResult = await squadRepository.findById(squadId);
        if (squadResult.error || !squadResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Squad not found';
            return result;
        }

        const squad = squadResult.data as ISquadDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'squad', action: 'manage-members' },
            {
                resource: squad,
                resourceType: 'squad',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to manage members in this squad';
            return result;
        }

        // Find and remove the member
        const members = (squad.members || []).filter((m: any) => {
            const memberUserId = typeof m.user === 'object'
                ? String(m.user._id || m.user.id)
                : String(m.user);
            return memberUserId !== userId;
        });

        // Check if member was found
        if (members.length === (squad.members || []).length) {
            result.error = true;
            result.code = 404;
            result.message = 'Member not found in this squad';
            return result;
        }

        const updateResult = await squadRepository.updateSquad(squadId, {
            members: members as any,
        });

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

export default new SquadService();
