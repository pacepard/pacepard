import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import { IEntryDoc, EntryStatusType, EntryType } from './entry.interface';
import {
    CreateEntryDTO,
    UpdateEntryDTO,
    AddMemberDTO,
    RemoveMemberDTO,
} from './entry.dto';
import entryRepository from './entry.repository';
import hackathonRepository from '../hackathon/hackathon.repository';
import { IResult } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genEntryCode } from '../../../utils/code.util';
import { genSlug } from '../../../utils/helpers.util';
import permissionService from '../../authentication/permission/permission.service';

type ObjectId = Types.ObjectId;

class EntryService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @method createEntry
     * @description Creates a new entry in the system.
     * @param {CreateEntryDTO} data - The entry payload.
     * @returns {Promise<IResult>} A structured result object.
     */
    public async createEntry(
        data: CreateEntryDTO,
    ): Promise<IResult<{ entry: IEntryDoc }>> {
        let result: IResult<{ entry: IEntryDoc }> = {
            error: false,
            message: '',
            code: 200,
            data: {} as { entry: IEntryDoc },
        };

        const { name, description, hackathonId, user, createdBy, entryType } =
            data;

        if (!name || name.trim().length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Entry name is required';
            return result;
        }

        if (!description || description.trim().length === 0) {
            result.error = true;
            result.code = 400;
            result.message = 'Entry description is required';
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
            result.message =
                'Creator information is required to create an entry';
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

        // Generate unique entry code
        let entryCode = genEntryCode();
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure code uniqueness
        while (!isUnique && attempts < maxAttempts) {
            const existingResult = await entryRepository.findOne({
                code: entryCode,
            });
            if (existingResult.error || !existingResult.data) {
                isUnique = true;
            } else {
                entryCode = genEntryCode();
                attempts++;
            }
        }

        if (!isUnique) {
            result.error = true;
            result.code = 500;
            result.message = 'Failed to generate unique entry code';
            return result;
        }

        // Generate slug
        const slug = genSlug(name);
        const existingSlugResult = await entryRepository.findOne({
            slug: slug,
        });
        if (existingSlugResult.error === false && existingSlugResult.data) {
            result.error = true;
            result.code = 400;
            result.message = 'Entry with this name already exists';
            return result;
        }

        const entryData = {
            code: entryCode,
            name: name.trim(),
            slug: slug,
            description: description.trim(),
            image: data.image || '',
            tags: data.tags || [],
            category: data.category || '',
            entryType: entryType || EntryType.INDIVIDUAL,
            status: EntryStatusType.DRAFT,
            createdBy: new Types.ObjectId(userId),
            hackathon: [new Types.ObjectId(hackathonId)],
            forms: [],
            submissions: [],
            members: [new Types.ObjectId(userId)], // Creator is automatically a member
            mentors: [], // Will reference Guest (type: MENTOR)
            settings: data.settings || {
                transferOwnershipTo: undefined,
            },
        };

        const createResult = await entryRepository.createEntry(entryData);
        if (createResult.error || !createResult.data) {
            result.error = true;
            result.code = 500;
            result.message = createResult.message;
            return result;
        }

        result.message = 'Entry created successfully';
        result.code = 201;
        result.data = { entry: createResult.data as IEntryDoc };
        return result;
    }

    /**
     * @name updateEntry
     * @description Updates an entry with new details
     * @param data - UpdateEntryDTO containing entryId, user, and update data
     */
    public async updateEntry(data: UpdateEntryDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { entryId, user } = data;

        // Find the entry
        const findResult = await entryRepository.findById(entryId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Entry not found';
            return result;
        }

        const entry = findResult.data as IEntryDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'entry', action: 'update' },
            {
                resource: entry,
                resourceType: 'entry',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message = 'You do not have permission to update this entry';
            return result;
        }

        const updateData: Partial<IEntryDoc> = {};
        if (data.name !== undefined) {
            updateData.name = data.name.trim();
            updateData.slug = genSlug(data.name);
        }
        if (data.description !== undefined) {
            updateData.description = data.description.trim();
        }
        if (data.entryType !== undefined) {
            updateData.entryType = data.entryType;
        }
        if (data.status !== undefined) {
            updateData.status = data.status;
        }
        if (data.image !== undefined) {
            updateData.image = data.image;
        }
        if (data.tags !== undefined) {
            updateData.tags = data.tags;
        }
        if (data.category !== undefined) {
            updateData.category = data.category;
        }
        if (data.settings !== undefined) {
            updateData.settings = data.settings as any;
        }

        // Update the entry
        const updateResult = await entryRepository.updateEntry(
            entryId,
            updateData,
        );
        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Entry updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name getEntry
     * @description Retrieves an entry by ID, including populated relations
     */
    public async getEntry(entryId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const entryResult = await entryRepository.findEntry(entryId, [
            { path: 'hackathon' },
            { path: 'forms' },
            { path: 'submissions' },
            { path: 'members' },
            { path: 'mentors' },
            { path: 'createdBy' },
        ]);

        if (entryResult.error || !entryResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Entry not found';
            return result;
        }

        result.data = entryResult.data;
        result.message = 'Entry retrieved successfully';
        return result;
    }

    /**
     * @name getEntries
     * @description Retrieves all entries with optional filtering and pagination
     */
    public async getEntries(
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

        const entriesResult = await entryRepository.getEntries(filter, options);

        if (entriesResult.error) {
            result.error = true;
            result.code = entriesResult.code || 500;
            result.message = entriesResult.message;
            return result;
        }

        result.data = entriesResult.data;
        result.pagination = entriesResult.pagination;
        result.pagination!.count = entriesResult.pagination?.count || 0;
        result.pagination!.total = entriesResult.pagination?.total || 0;
        result.message = 'Entries retrieved successfully';
        return result;
    }

    /**
     * @name deleteEntry
     * @description Deletes an entry
     * @param entryId - The entry ID
     * @param user - Optional user for permission checking
     */
    public async deleteEntry(
        entryId: string,
        user?: IUserDoc | string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the entry
        const findResult = await entryRepository.findById(entryId);
        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Entry not found';
            return result;
        }

        const entry = findResult.data as IEntryDoc;

        // Check permissions if user is provided
        if (user) {
            const hasPermission = await permissionService.hasPermission(
                user,
                { entity: 'entry', action: 'delete' },
                {
                    resource: entry,
                    resourceType: 'entry',
                    checkOwnership: true,
                },
            );

            if (!hasPermission) {
                result.error = true;
                result.code = 403;
                result.message =
                    'You do not have permission to delete this entry';
                return result;
            }
        }

        // Delete the entry
        const deleteResult = await entryRepository.deleteEntry(entryId);
        if (deleteResult.error) {
            result.error = true;
            result.code = deleteResult.code;
            result.message = deleteResult.message;
            return result;
        }

        result.message = 'Entry deleted successfully';
        result.data = deleteResult.data;
        return result;
    }

    /**
     * @name addMember
     * @description Adds a member to an entry
     * @param data - AddMemberDTO containing entryId, userId, and requestingUser
     */
    public async addMember(data: AddMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { entryId, userId, requestingUser } = data;

        const entryResult = await entryRepository.findById(entryId);
        if (entryResult.error || !entryResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Entry not found';
            return result;
        }

        const entry = entryResult.data as IEntryDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'entry', action: 'manage-members' },
            {
                resource: entry,
                resourceType: 'entry',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message =
                'You do not have permission to manage members in this entry';
            return result;
        }

        // Check if user is already a member
        const existingMember = (entry.members || []).find((m: any) => {
            const memberUserId =
                typeof m === 'object' ? String(m._id || m.id) : String(m);
            return memberUserId === userId;
        });

        if (existingMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is already a member of this entry';
            return result;
        }

        // Add new member
        const members = [...(entry.members || [])];
        members.push(new Types.ObjectId(userId));

        const updateResult = await entryRepository.updateEntry(entryId, {
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
     * @description Removes a member from an entry
     * @param data - RemoveMemberDTO containing entryId, userId, and requestingUser
     */
    public async removeMember(data: RemoveMemberDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { entryId, userId, requestingUser } = data;

        const entryResult = await entryRepository.findById(entryId);
        if (entryResult.error || !entryResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Entry not found';
            return result;
        }

        const entry = entryResult.data as IEntryDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            requestingUser,
            { entity: 'entry', action: 'manage-members' },
            {
                resource: entry,
                resourceType: 'entry',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message =
                'You do not have permission to manage members in this entry';
            return result;
        }

        // Find and remove the member
        const members = (entry.members || []).filter((m: any) => {
            const memberUserId =
                typeof m === 'object' ? String(m._id || m.id) : String(m);
            return memberUserId !== userId;
        });

        // Check if member was found
        if (members.length === (entry.members || []).length) {
            result.error = true;
            result.code = 404;
            result.message = 'Member not found in this entry';
            return result;
        }

        const updateResult = await entryRepository.updateEntry(entryId, {
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

export default new EntryService();
