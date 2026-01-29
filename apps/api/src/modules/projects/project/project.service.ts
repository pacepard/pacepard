import { Types } from 'mongoose';
import { dateToday, IDateToday } from '@btffamily/pacitude';
import {
    IProjectDoc,
    ProjectStatus,
    ProjectMemberRole,
    ProjectType,
} from './project.interface';
import { CreateProjectDTO, UpdateProjectDTO } from './project.dto';
import projectRepository from './project.repository';
import businessRepository from '../../users/business/business.repository';
import workspaceRepository from '../../core/workspace/workspace.repository';
import { IResult } from '../../../utils/interfaces.util';
import { IUserDoc } from '../../users/user/user.interface';
import { genSlug } from '../../../utils/helpers.util';
import { genProjectCode } from '../../../utils/code.util';
import teamRepository from '../../projects/team/team.repository';
import taskRepository from '../../projects/task/task.repository';
import { DbModels } from '../../../utils/enums.util';
import storageService from '../../platform/storage/storage.service';
import { IFile } from '../../../utils/interfaces.util';
import shareableLinkService from '../../platform/ShareableLink/shareable-link.service';
import { ShareableLinkType } from '../../platform/ShareableLink/shareable-link.interface';
import permissionService from '../../authentication/permission/permission.service';

type ObjectId = Types.ObjectId;

class ProjectService {
    public result: IResult;
    public today: IDateToday;

    constructor() {
        this.today = dateToday(new Date());
        this.result = { error: false, message: '', code: 200, data: {} };
    }

    /**
     * @name createProject
     * @description Creates a new project with strict lineage validation
     * @param data - CreateProjectDTO containing project details
     * @returns Promise<IResult>
     */
    public async createProject(data: CreateProjectDTO): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const { user, workspaceId, title, description } = data;

        // Validate required fields
        if (!title || !description || !workspaceId) {
            result.error = true;
            result.code = 400;
            result.message =
                'Title, description, and workspace ID are required';
            return result;
        }

        // Validate user
        if (!user) {
            result.error = true;
            result.code = 400;
            result.message = 'User information is required to create a project';
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

        // Check if project with same slug already exists
        const slug = genSlug(title);
        const existingProjectResult = await projectRepository.findOne({
            slug: slug,
        });
        if (existingProjectResult.error === false && existingProjectResult.data) {
            result.error = true;
            result.code = 400;
            result.message = 'Project with this title already exists';
            return result;
        }

        // Validate project type enum if provided
        if (data.type && !Object.values(ProjectType).includes(data.type)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid project type';
            return result;
        }

        // Validate description length
        if (description.trim().length < 10) {
            result.error = true;
            result.code = 400;
            result.message = 'Project description must be at least 10 characters long';
            return result;
        }

        // Handle image upload if provided
        let imageData: { fileName: string; s3Key: string } | undefined = undefined;
        if (data.image) {
            // If image is an IFile with stream, upload it
            if (typeof data.image === 'object' && (data.image as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    data.image as IFile,
                );

                if (uploadResult.error) {
                    result.error = true;
                    result.code = uploadResult.code || 500;
                    result.message =
                        uploadResult.message;
                    return result;
                }

                imageData = {
                    fileName: uploadResult.data.fileName || '',
                    s3Key: uploadResult.data.s3Key || '',
                };
            } else if (typeof data.image === 'object') {
                // If it's already uploaded, check if it has s3Key
                const imageWithS3Key = data.image as any;
                if (imageWithS3Key.s3Key) {
                    imageData = {
                        fileName: imageWithS3Key.fileName || '',
                        s3Key: imageWithS3Key.s3Key,
                    };
                } else {
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            } else if (typeof data.image === 'string') {
                // Legacy support: if it's a string, we can't handle it here
                result.error = true;
                result.code = 400;
                result.message =
                    'Image must be provided as a file upload or object with s3Key';
                return result;
            }
        }

        // Prepare project data
        const projectCode = genProjectCode();
        const projectData: any = {
            code: projectCode,
            title: title.trim(),
            slug: slug,
            tagline: data.tagline || '',
            description: description.trim(),
            workspaceId: workspaceId,
            businessId: businessCheck.data.id,
            createdBy: user.id,
            creatorType: DbModels.BUSINESS,
            status: ProjectStatus.DRAFT,
            category: data.category || 'General',
            type: data.type || ProjectType.PROJECT,
            items: data.items || [],
            tags: data.tags || [],
            image: imageData,
            documentation: data.documentation || '',
            members: [],
            tasks: [],
            isOpen: false,
            isClosed: false,
            isPublic: data.isPublic || false,
            isChallenge: data.isChallenge || false,
        };

        const createResult = await projectRepository.createProject(projectData);
        if (createResult.error) {
            result.error = true;
            result.code = createResult.code || 500;
            result.message = createResult.message;
            return result;
        }

        result.message = 'Project created successfully';
        result.code = 201;
        result.data = createResult.data;
        return result;
    }

    /**
     * @name getProject
     * @description Retrieves a project by its ID or slug
     * @param idOrSlug - Project ID or slug
     * @returns Promise<IResult>
     */
    public async getProject(idOrSlug: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const populatePaths = [
            {
                path: 'members.user',
                select: 'firstName lastName email profileImage',
            },
            { path: 'workspace', select: 'name' },
            { path: 'business', select: 'businessName code' },
            { path: 'createdBy', select: 'firstName lastName email' },
        ];

        const findResult = await projectRepository.findProject(
            idOrSlug,
            populatePaths,
        );

        if (findResult.error || !findResult.data) {
            result.error = true;
            result.code = findResult.code || 404;
            result.message = findResult.message || 'Project not found';
            return result;
        }

        result.message = 'Project retrieved successfully';
        result.data = findResult.data;
        return result;
    }

    /**
     * @name getAllProjects
     * @description Retrieves all projects with pagination, filtering, and sorting
     * @param query - Query parameters for filtering, pagination, and sorting
     * @returns Promise<IResult>
     */
    public async getAllProjects(query: any): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        const options = {
            populate: [
                { path: 'createdBy', select: 'firstName lastName' },
                { path: 'workspace', select: 'name' },
                { path: 'business', select: 'businessName code' },
            ],
            ...query,
        };

        const filter = { ...query };

        const queryResult = await projectRepository.getProjects(
            filter,
            options,
        );

        if (queryResult.error) {
            result.error = true;
            result.code = queryResult.code || 500;
            result.message =
                queryResult.message;
            return result;
        }

        result.message =
            queryResult.message || 'Projects retrieved successfully';
        result.data = queryResult.data;
        result.pagination = queryResult.pagination;
        result.pagination!.total = queryResult.pagination!.total;
        result.pagination!.count = queryResult.pagination!.count;
        return result;
    }

    /**
     * @name getProjectsByWorkspace
     * @description Retrieves all projects for a specific workspace
     * @param workspaceId - Workspace ID
     * @returns Promise<IResult>
     */
    public async getProjectsByWorkspace(workspaceId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!workspaceId) {
            result.error = true;
            result.code = 400;
            result.message = 'Workspace ID is required';
            return result;
        }

        const findResult = await projectRepository.findByWorkspace(workspaceId);
        if (findResult.error) {
            result.error = true;
            result.code = findResult.code || 500;
            result.message =
                findResult.message ||
                'Failed to retrieve projects for workspace';
            return result;
        }

        result.message = 'Projects retrieved successfully';
        result.data = findResult.data;
        return result;
    }

    /**
     * @name updateProject
     * @description Updates project information with whitelist validation
     * @param projectId - Project ID
     * @param updateData - UpdateProjectDTO containing fields to update
     * @returns Promise<IResult>
     */
    public async updateProject(
        projectId: string,
        updateData: UpdateProjectDTO,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID is required';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Check if project is closed
        if (project.status === ProjectStatus.CLOSED) {
            result.error = true;
            result.code = 400;
            result.message = 'Cannot modify a closed project';
            return result;
        }

        // Validate status enum if provided
        if (updateData.status !== undefined && !Object.values(ProjectStatus).includes(updateData.status)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid project status';
            return result;
        }

        // Validate description length if provided
        if (updateData.description !== undefined && updateData.description.trim().length < 10) {
            result.error = true;
            result.code = 400;
            result.message = 'Project description must be at least 10 characters long';
            return result;
        }

        // Whitelist of allowed fields to update
        const allowed: (keyof IProjectDoc)[] = [
            'title',
            'description',
            'tagline',
            'category',
            'tags',
            'image',
            'items',
            'documentation',
        ];

        const finalUpdate: Partial<IProjectDoc> = {};

        for (const key of allowed) {
            if (updateData[key as keyof UpdateProjectDTO] !== undefined) {
                const value = updateData[key as keyof UpdateProjectDTO];
                
                // Skip image here, handle it separately
                if (key === 'image') {
                    continue;
                }
                
                (finalUpdate as any)[key] =
                    typeof value === 'string' ? value.trim() : value;

                // Auto-generate slug if title is updated
                if (key === 'title' && typeof value === 'string') {
                    finalUpdate.slug = genSlug(value);
                }
            }
        }

        // Handle image upload if provided
        if (updateData.image !== undefined) {
            const oldImage = project.image;

            // If there's an old image, delete it from S3
            if (oldImage?.s3Key) {
                try {
                    await storageService.deleteFile(oldImage.s3Key);
                } catch (error) {
                    console.error('Failed to delete old image:', error);
                }
            }

            // If image is an IFile with stream, upload it
            if (typeof updateData.image === 'object' && (updateData.image as IFile).stream) {
                const uploadResult = await storageService.uploadFile(
                    updateData.image as IFile,
                );

                if (uploadResult.error) {
                    result.error = true;
                    result.code = uploadResult.code || 500;
                    result.message =
                        uploadResult.message;
                    return result;
                }

                finalUpdate.image = {
                    fileName: uploadResult.data.fileName || '',
                    s3Key: uploadResult.data.s3Key || '',
                };
            } else if (typeof updateData.image === 'object') {
                // If it's already uploaded, check if it has s3Key
                const imageWithS3Key = updateData.image as any;
                if (imageWithS3Key.s3Key) {
                    finalUpdate.image = {
                        fileName: imageWithS3Key.fileName || '',
                        s3Key: imageWithS3Key.s3Key,
                    };
                } else {
                    result.error = true;
                    result.code = 400;
                    result.message = 'Image s3Key is required for already uploaded images';
                    return result;
                }
            } else if (typeof updateData.image === 'string') {
                // Legacy support: if it's a string, we can't handle it here
                result.error = true;
                result.code = 400;
                result.message =
                    'Image must be provided as a file upload or object with s3Key';
                return result;
            }
        }

        // Handle status updates separately with validation
        if (updateData.status !== undefined) {
            finalUpdate.status = updateData.status;
        }

        // Handle boolean flags
        if (updateData.isOpen !== undefined) {
            finalUpdate.isOpen = updateData.isOpen;
        }
        if (updateData.isClosed !== undefined) {
            finalUpdate.isClosed = updateData.isClosed;
        }
        if (updateData.isPublic !== undefined) {
            finalUpdate.isPublic = updateData.isPublic;
        }
        if (updateData.isChallenge !== undefined) {
            finalUpdate.isChallenge = updateData.isChallenge;
        }

        const updateResult = await projectRepository.updateProject(
            projectId,
            finalUpdate,
        );

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Project updated successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name publishProject
     * @description Publishes a project, transitioning it from DRAFT to PUBLISHED
     * @param projectId - Project ID
     * @returns Promise<IResult>
     */
    public async publishProject(projectId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID is required';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Validate project state
        if (project.status === ProjectStatus.CLOSED) {
            result.error = true;
            result.code = 400;
            result.message = 'Cannot publish a closed project';
            return result;
        }

        // Validate project content
        if (!project.description || project.description.length < 10) {
            result.error = true;
            result.code = 400;
            result.message = 'Project description is too short to publish';
            return result;
        }

        // Update project status
        const updateResult = await projectRepository.updateProject(projectId, {
            status: ProjectStatus.PUBLISHED,
            publishedAt: new Date(),
            isOpen: true,
        } as any);

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message =
                updateResult.message;
            return result;
        }

        result.message = 'Project published successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name closeProject
     * @description Closes a project, transitioning it to CLOSED status
     * @param projectId - Project ID
     * @returns Promise<IResult>
     */
    public async closeProject(projectId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID is required';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Check if already closed
        if (project.status === ProjectStatus.CLOSED) {
            result.error = true;
            result.code = 400;
            result.message = 'Project is already closed';
            return result;
        }

        // Update project status
        const updateResult = await projectRepository.updateProject(projectId, {
            status: ProjectStatus.CLOSED,
            isClosed: true,
            isOpen: false,
        } as any);

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message = updateResult.message;
            return result;
        }

        result.message = 'Project closed successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name deleteProject
     * @description Deletes a project and performs cascading delete of related entities
     * @param projectId - Project ID
     * @returns Promise<IResult>
     */
    public async deleteProject(projectId: string): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID is required';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        try {
            // Cascading delete: Remove related teams and tasks
            await Promise.all([
                teamRepository.deleteMany({
                    projectId: new Types.ObjectId(projectId),
                }),
                taskRepository.deleteMany({
                    projectId: new Types.ObjectId(projectId),
                }),
            ]);

            // Delete the project itself
            const deleteResult = await projectRepository.delete(projectId);
            if (deleteResult.error) {
                result.error = true;
                result.code = deleteResult.code || 500;
                result.message =
                    deleteResult.message;
                return result;
            }

            result.message = 'Project deleted successfully';
            result.data = deleteResult.data;
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = `Cascading delete failed: ${error.message}`;
            return result;
        }
    }

    /**
     * @name addMember
     * @description Adds a member to a project
     * @param projectId - Project ID
     * @param userId - User ID to add
     * @param role - Role for the member
     * @returns Promise<IResult>
     */
    public async addMember(
        projectId: string,
        userId: string,
        role: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId || !userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID and User ID are required';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Check if project is closed
        if (project.status === ProjectStatus.CLOSED) {
            result.error = true;
            result.code = 400;
            result.message = 'Cannot modify members of a closed project';
            return result;
        }

        // Check if user is already a member
        const existingMember = project.members.find(
            (m) => String(m.user) === userId,
        );
        if (existingMember) {
            result.error = true;
            result.code = 400;
            result.message = 'User is already a member of this project';
            return result;
        }

        // Validate member role enum
        const memberRole = role || ProjectMemberRole.CONTRIBUTOR;
        if (!Object.values(ProjectMemberRole).includes(memberRole as ProjectMemberRole)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid member role';
            return result;
        }

        // Validate userId is a valid ObjectId
        if (!Types.ObjectId.isValid(userId)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        // Add member using idempotent operation
        const updateResult = await projectRepository.updateProject(projectId, {
            $addToSet: {
                members: {
                    user: new Types.ObjectId(userId),
                    role: memberRole,
                    joinedAt: new Date(),
                },
            },
        } as any);

        if (updateResult.error) {
            result.error = true;
            result.code = updateResult.code || 500;
            result.message =
                updateResult.message;
            return result;
        }

        result.message = 'Member added to project successfully';
        result.data = updateResult.data;
        return result;
    }

    /**
     * @name removeMember
     * @description Removes a member from a project and performs cleanup
     * @param projectId - Project ID
     * @param userId - User ID to remove
     * @returns Promise<IResult>
     */
    public async removeMember(
        projectId: string,
        userId: string,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId || !userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID and User ID are required';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Check if project is closed
        if (project.status === ProjectStatus.CLOSED) {
            result.error = true;
            result.code = 400;
            result.message = 'Cannot modify members of a closed project';
            return result;
        }

        try {
            // Perform cleanup in parallel
            await Promise.all([
                // Remove from project members
                projectRepository.pullFromArray(projectId, 'members', {
                    user: new Types.ObjectId(userId),
                }),
                // Remove from all teams in this project
                teamRepository.removeUserFromProjectTeams(projectId, userId),
                // Unassign from all tasks in this project
                taskRepository.updateMany(
                    {
                        projectId: new Types.ObjectId(projectId),
                        assignedTo: new Types.ObjectId(userId),
                    },
                    { $set: { assignedTo: null } },
                ),
            ]);

            result.message =
                'Member removed from project and all associated teams/tasks successfully';
            result.data = { projectId, userId };
            return result;
        } catch (error: any) {
            result.error = true;
            result.code = 500;
            result.message = `Failed to remove member: ${error.message}`;
            return result;
        }
    }

    /**
     * @name inviteMember
     * @description Initiates invitation process for a project member
     * @param projectId - Project ID
     * @param email - Email address to invite
     * @param role - Role for the invited member
     * @param inviter - User initiating the invitation
     * @returns Promise<IResult>
     */
    public async inviteMember(
        projectId: string,
        email: string,
        role: string,
        inviter: IUserDoc,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        if (!projectId || !email) {
            result.error = true;
            result.code = 400;
            result.message = 'Project ID and email are required';
            return result;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid email format';
            return result;
        }

        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Validate inviter
        if (!inviter) {
            result.error = true;
            result.code = 400;
            result.message = 'Inviter information is required';
            return result;
        }

        // Check if project is closed
        if (project.status === ProjectStatus.CLOSED) {
            result.error = true;
            result.code = 400;
            result.message = 'Cannot invite members to a closed project';
            return result;
        }

        // Validate member role if provided
        if (role && !Object.values(ProjectMemberRole).includes(role as ProjectMemberRole)) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid member role';
            return result;
        }

        // TODO: Integrate with invitation service when available
        // const invitationResult = await invitationService.sendInvitation({
        //     email,
        //     role,
        //     resourceId: projectId,
        //     resourceType: 'PROJECT',
        //     invitedBy: inviter.id,
        // });

        result.message = 'Invitation process initiated';
        return result;
    }

    /**
     * @name generateShareableLink
     * @description Generates a shareable link for a project
     * @param projectId - Project ID
     * @param user - User creating the link
     * @param expiresInDays - Expiration in days (default: 7)
     * @returns Promise<IResult>
     */
    public async generateShareableLink(
        projectId: string,
        user: IUserDoc | string,
        expiresInDays: number = 7,
    ): Promise<IResult> {
        let result: IResult = {
            error: false,
            message: '',
            code: 200,
            data: {},
        };

        // Find the project
        const projectResult = await projectRepository.findById(projectId);
        if (projectResult.error || !projectResult.data) {
            result.error = true;
            result.code = 404;
            result.message = 'Project not found';
            return result;
        }

        const project = projectResult.data as IProjectDoc;

        // Check permissions
        const hasPermission = await permissionService.hasPermission(
            user,
            { entity: 'project', action: 'update' },
            {
                resource: project,
                resourceType: 'project',
                checkOwnership: true,
            },
        );

        if (!hasPermission) {
            result.error = true;
            result.code = 403;
            result.message =
                'You do not have permission to generate shareable link for this project';
            return result;
        }

        // Get user ID
        const userId = typeof user === 'string' ? user : (user as IUserDoc)?._id?.toString() || (user as IUserDoc)?.id?.toString();

        if (!userId) {
            result.error = true;
            result.code = 400;
            result.message = 'Invalid user ID';
            return result;
        }

        // Generate shareable link
        const linkResult = await shareableLinkService.generateShareableLink({
            linkType: ShareableLinkType.PROJECT,
            resourceId: projectId,
            createdBy: userId,
            expiresInDays,
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
            shareableUrl: `${process.env.CLIENT_APP_URL || ''}/project/${projectId}/share?token=${(linkResult.data as any).token}`,
            linkId: (linkResult.data as any).linkId,
        };
        return result;
    }
}

export default new ProjectService();
