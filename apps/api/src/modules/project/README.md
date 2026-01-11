# Project Module

## Overview

The Project module is a microservice-ready module that implements a strict hierarchy pattern for managing projects within the Pacepard system. It follows the Workspace module's architecture and maintains the same programming paradigm.

## Architecture

The module follows a strict layered architecture:

```
Controller → Service → Repository → Model
```

### Hierarchy Pattern

Projects follow the **Direct Lineage Pattern**:

```
Workspace (Top Level)
  └── Business (Organization)
      └── Projects (Challenge/Project)
          ├── Members (Inline participation)
          └── Tasks (Work assignments)
              └── Teams (Work groups)
```

### Key Relationships

- **Workspace**: The top-level container for a business/organization
- **Business**: The organization that owns the project
- **Project**: The actual project or challenge
- **Team**: Groups of members within a project
- **Task**: Individual work items assigned to teams/members

## Module Files

### Core Files
- `project.interface.ts` - TypeScript interfaces and enums
- `project.model.ts` - Mongoose schema and model
- `project.repository.ts` - Data access layer extending RepositoryService
- `project.service.ts` - Business logic layer
- `project.controller.ts` - Request handlers (asyncHandler pattern)
- `project.router.ts` - Route definitions
- `project.dto.ts` - Data Transfer Objects
- `project.mapper.ts` - Entity to DTO mapping

### Related Modules

#### Team Module
- `team.interface.ts` - Team interfaces
- `team.model.ts` - Team schema
- `team.repository.ts` - Team repository
- `team.service.ts` - Team business logic
- `team.dto.ts` - Team DTOs

#### Task Module
- `task.interface.ts` - Task interfaces
- `task.model.ts` - Task schema
- `task.repository.ts` - Task repository
- `task.service.ts` - Task business logic
- `task.controller.ts` - Task controllers
- `task.router.ts` - Task routes
- `task.dto.ts` - Task DTOs

## Features

### Project Management

1. **Create Project** (`POST /workspaces/:workspaceId/projects`)
   - Validates user permissions (Admin/Business only)
   - Validates workspace and business existence
   - Generates unique project code
   - Links to workspace and business (Direct Lineage)

2. **Get Project** (`GET /projects/:id`)
   - Supports ID or slug lookup
   - Populates related entities (tasks, members, workspace, business)
   - Implements Redis caching

3. **Update Project** (`PUT /projects/:id`)
   - Partial updates supported
   - Auto-updates slug when title changes
   - Cache invalidation on update

4. **Delete Project** (`DELETE /projects/:id`)
   - Soft deletion validation
   - Cache cleanup

5. **Get Workspace Projects** (`GET /workspaces/:workspaceId/projects`)
   - Fetches all projects for a workspace
   - Uses indexed queries for performance
   - Implements pagination

### Project Lifecycle

6. **Publish Project** (`POST /projects/:id/publish`)
   - Changes status to PUBLISHED
   - Opens project for membership
   - Updates publishedAt timestamp

7. **Close Project** (`POST /projects/:id/close`)
   - Changes status to CLOSED
   - Closes project for new members
   - Sets isOpen to false

### Member Management

8. **Add Member** (`POST /projects/:id/members`)
   - Adds user to project with role
   - Prevents duplicate membership
   - Tracks join date

9. **Remove Member** (`DELETE /projects/:id/members/:userId`)
   - Removes user from project
   - Maintains audit trail

### Task Management

10. **Create Task** (`POST /projects/:projectId/teams/:teamId/tasks`)
    - Links task to project and team
    - Validates hierarchy (workspace → project → team)
    - Supports assignment to multiple users

11. **Get Task** (`GET /tasks/:id`)
    - Returns task with all relations
    - Cached response

12. **Update Task** (`PUT /tasks/:id`)
    - Updates status, priority, assignments
    - Auto-sets completedAt on DONE status

13. **Delete Task** (`DELETE /tasks/:id`)
    - Removes task
    - Cache cleanup

14. **Assign Task** (`POST /tasks/:id/assign`)
    - Assigns task to multiple users
    - Maintains assignment history

15. **Get Tasks by Project** (`GET /projects/:projectId/tasks`)
    - All tasks for a project
    - Cached response

16. **Get Tasks by Team** (`GET /teams/:teamId/tasks`)
    - All tasks assigned to a team
    - Cached response

17. **Get Tasks by Assignee** (`GET /users/:userId/tasks`)
    - Personal task list for user
    - Filters by assignedTo

## Code Patterns

### 1. Repository Pattern

All repositories extend `RepositoryService`:

```typescript
class ProjectRepository extends RepositoryService<IProjectDoc> {
  constructor() {
    super(Project, "Project");
  }
  
  // Custom methods
  public async findByWorkspace(workspaceId: string): Promise<IResult> {
    return this.findAll({ workspaceId: new mongoose.Types.ObjectId(workspaceId) });
  }
}
```

### 2. Service Layer

Services contain business logic and orchestration:

```typescript
class ProjectService {
  public async createProject(data: CreateProjectDTO): Promise<IResult> {
    // 1. Context Validation
    // 2. Permission Check
    // 3. Hierarchy Validation
    // 4. Business Validation
    // 5. Strict Data Initialization
    // 6. Persistence
  }
}
```

### 3. Controller Pattern

Controllers use asyncHandler middleware:

```typescript
export const createProject = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Authorization check
    // 2. Validation
    // 3. Service call
    // 4. Cache handling
    // 5. Response formatting
  }
);
```

### 4. Response Format

Standardized IResult response:

```typescript
{
  error: false,
  message: "Success message",
  code: 200,
  data: { ... },
  pagination?: { ... },
  total?: number,
  count?: number
}
```

## Code Generation Utilities

### Project Codes

`genProjectCode()` - Generates unique project identifiers:
- Format: `prj-{year}-{6-digit-random}`
- Example: `prj-2025-123456`

### Task Codes

`genTaskCode()` - Generates unique task identifiers:
- Format: `tsk-{year}-{6-digit-random}`
- Example: `tsk-2025-654321`

## Enums

### ProjectType
- `PROJECT` - Standard project
- `CHALLENGE` - Challenge-type project

### ProjectStatus
- `DRAFT` - Initial state
- `PUBLISHED` - Publicly available
- `UNDER_REVIEW` - Under review
- `PENDING` - Pending approval
- `CLOSED` - Project closed

### ProjectCreatorType
- `ADMIN` - Created by system admin
- `BUSINESS` - Created by business account

### ProjectMemberRole
- `MEMBER` - Regular member
- `MENTOR` - Project mentor
- `MAINTAINER` - Project maintainer
- `LEAD` - Project lead
- `JUDGE` - Project judge

### TaskStatus
- `TODO` - Not started
- `IN_PROGRESS` - In progress
- `IN_REVIEW` - Under review
- `DONE` - Completed
- `BLOCKED` - Blocked

### TaskPriority
- `LOW` - Low priority
- `MEDIUM` - Medium priority
- `HIGH` - High priority
- `URGENT` - Urgent priority

## Performance Considerations

### Indexes
All models have compound indexes for common query patterns:
- Project: `workspaceId + status`
- Task: `projectId + status`, `teamId + status`, `assignedTo`
- Team: `projectId + workspaceId`

### Caching
- Redis caching implemented for all GET endpoints
- TTL: 300s (5 min) for single items, 180s (3 min) for lists
- Automatic cache invalidation on updates/deletes

### Pagination
- Default page size: 25
- Configurable via query params
- Supports cursor-based pagination via next/prev links

## Security

### Authentication
- All routes protected by `Protect` middleware
- User context attached via auth middleware
- Role-based access control in services

### Authorization
- Project creation: Admin/Business only
- Project updates: Owner/Admin only
- Member management: Project owner/Admin only
- Task management: Project members/Admin only

## Error Handling

### ErrorResponse Format
```typescript
{
  error: true,
  message: "Error description",
  code: 400,
  errors: []
}
```

### Common Error Codes
- `400` - Bad request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (permission denied)
- `404` - Resource not found
- `500` - Internal server error

## Future Enhancements

1. **Notifications**: Email/in-app notifications for task assignments
2. **Webhooks**: Event-driven updates for external integrations
3. **Analytics**: Project/team/task performance metrics
4. **File Attachments**: Support for task attachments
5. **Comments**: Threaded comments on tasks
6. **Time Tracking**: Track time spent on tasks
7. **Subtasks**: Breakdown of tasks into subtasks
8. **Dependencies**: Task dependency management
9. **Workflows**: Custom workflow states per project
10. **Integrations**: Third-party tool integrations (Jira, Trello, etc.)




Project service snippets















// import { Types } from "mongoose";
// import { dateToday, IDateToday } from "@btffamily/pacitude";
// import { IProjectDoc, ProjectStatus, ProjectCreatorType } from "./project.interface";
// import { CreateProjectDTO } from "./project.dto";
// import projectRepository from "./project.repository";
// import businessRepository from "../business/business.repository";
// import workspaceRepository from "../workspace/workspace.repository";
// import { IResult } from "../../utils/interfaces.util";
// import { IUserDoc } from "../user/user.interface";
// import { genSlug } from "../../utils/helpers.util";
// import { genProjectCode } from "../../utils/code.util";

// class ProjectService {
//   public result: IResult;
//   public today: IDateToday;

//   constructor() {
//     this.today = dateToday(new Date());
//     this.result = { error: false, message: "", code: 200, data: {} };
//   }

//   public async createProject(
//     data: CreateProjectDTO
//   ): Promise<IResult<{ project: IProjectDoc; user: IUserDoc }>> {
    
//     let result: IResult<{ project: IProjectDoc; user: IUserDoc }> = {
//       error: false,
//       message: "",
//       code: 200,
//       data: {} as { project: IProjectDoc; user: IUserDoc },
//     };

//     const { user, workspaceId, title, description, type } = data;

//     // 1. Context Validation
//     if (!user || !workspaceId) {
//       result.error = true; result.code = 400;
//       result.message = "User and Workspace context are required";
//       return result;
//     }

//     // 2. Permission Check
//     if (!user.isAdmin && !user.isBusiness) {
//       result.error = true; result.code = 403;
//       result.message = "Only Business or Admin accounts can initialize projects";
//       return result;
//     }

//     // 3. Hierarchy Validation (Workspace exists?)
//     const workspaceCheck = await workspaceRepository.findById(workspaceId);
//     if (workspaceCheck.error || !workspaceCheck.data) {
//       result.error = true; result.code = 404;
//       result.message = "The targeted Workspace does not exist";
//       return result;
//     }

//     // 4. Business Validation (Does user have a business in this workspace?)
//     const businessCheck = await businessRepository.findOne({ 
//       user: user.id || user._id,
//       // Logic: Ensure this business is authorized in the specific workspace
//       workspaces: { $in: [new Types.ObjectId(workspaceId)] } 
//     });

//     if (businessCheck.error || !businessCheck.data) {
//       result.error = true; result.code = 404;
//       result.message = "No active Business profile found for this Workspace";
//       return result;
//     }

//     const business = businessCheck.data;

//     // 5. Strict Data Initialization (No Optional Fields)
//     // We map every field from the DTO and add system defaults
//     const projectData: Partial<IProjectDoc> = {
//       code: genProjectCode(),
//       title: title.trim(),
//       slug: genSlug(title),
//       tagline: data.tagline || "",
//       description: description.trim(),
      
//       // Content & Media
//       items: data.items || [],
//       documentation: data.documentation || "",
//       category: data.category || "General",
//       tags: data.tags || [],
//       image: data.image || "default-thumbnail.png",
//       workspaceId: new Types.ObjectId(workspaceId),
//       businessId: business._id,
//       createdBy: new Types.ObjectId(user.id || user._id),
//       creatorType: user.isAdmin ? ProjectCreatorType.ADMIN : ProjectCreatorType.BUSINESS,
//       status: ProjectStatus.DRAFT,
//       isOpen: false,
//       isClosed: false,
//       publishedAt: new Date(),
//       members: [],
//       tasks: [],
//     };

//     // 6. Persistence
//     // We create the project. The repository layer handles uniqueness checks.
//     const createResult = await projectRepository.createProject(projectData);
    
//     if (createResult.error || !createResult.data) {
//       result.error = true; result.code = 500;
//       result.message = createResult.message || "Failed to persist project";
//       return result;
//     }

//     result.message = "Project created successfully";
//     result.code = 201;
//     result.data = { project: createResult.data as IProjectDoc, user };
    
//     return result;
//   }

//   /**
//    * @method getProjectsByWorkspace
//    * @description Retrieves all projects belonging to a specific workspace.
//    * @param {string} workspaceId - The ID of the parent workspace.
//    */
//   public async getProjectsByWorkspace(
//     workspaceId: string
//   ): Promise<IResult<{ projects: IProjectDoc[] }>> {
//     let result: IResult<{ projects: IProjectDoc[] }> = {
//       error: false,
//       message: "",
//       code: 200,
//       data: { projects: [] },
//     };

//     // 1. Validation
//     if (!workspaceId) {
//       result.error = true; result.code = 400;
//       result.message = "Workspace ID is required to fetch projects";
//       return result;
//     }

//     // 2. Querying the Project collection directly using the index
//     // We use the repository to keep the service layer clean
//     const findResult = await projectRepository.findAll({ 
//       workspaceId: new Types.ObjectId(workspaceId) 
//     });

//     if (findResult.error) {
//       result.error = true;
//       result.code = findResult.code;
//       result.message = findResult.message;
//       return result;
//     }

//     result.data = { projects: findResult.data as IProjectDoc[] };
//     result.message = "Workspace projects retrieved successfully";
//     return result;
//   }

//   /**
//    * @name getProject
//    * @description Retrieves a project by ID or slug with populated relations
//    */
//   public async getProject(identifier: string): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     const projectResult = await projectRepository.findProject(
//       identifier,
//       [
//         { path: 'tasks' },
//         { path: 'workspaceId' },
//         { path: 'businessId' },
//         { path: 'members.user' },
//         { path: 'createdBy' },
//       ]
//     );

//     if (projectResult.error || !projectResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     result.data = projectResult.data;
//     result.message = "Project retrieved successfully";
//     return result;
//   }

//   /**
//    * @name updateProject
//    * @description Updates a project with new details
//    */
//   public async updateProject(
//     projectId: string,
//     updateData: Partial<IProjectDoc>
//   ): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     // Find the project
//     const findResult = await projectRepository.findById(projectId);
//     if (findResult.error || !findResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     // Build update object with allowed fields
//     const dataToUpdate: any = {};
//     if (updateData.title !== undefined) {
//       dataToUpdate.title = updateData.title.trim();
//       dataToUpdate.slug = genSlug(updateData.title);
//     }
//     if (updateData.description !== undefined) {
//       dataToUpdate.description = updateData.description.trim();
//     }
//     if (updateData.tagline !== undefined) {
//       dataToUpdate.tagline = updateData.tagline;
//     }
//     if (updateData.category !== undefined) {
//       dataToUpdate.category = updateData.category;
//     }
//     if (updateData.tags !== undefined) {
//       dataToUpdate.tags = updateData.tags;
//     }
//     if (updateData.image !== undefined) {
//       dataToUpdate.image = updateData.image;
//     }
//     if (updateData.documentation !== undefined) {
//       dataToUpdate.documentation = updateData.documentation;
//     }
//     if (updateData.items !== undefined) {
//       dataToUpdate.items = updateData.items;
//     }
//     if (updateData.status !== undefined) {
//       dataToUpdate.status = updateData.status;
//     }
//     if (updateData.isOpen !== undefined) {
//       dataToUpdate.isOpen = updateData.isOpen;
//     }
//     if (updateData.isClosed !== undefined) {
//       dataToUpdate.isClosed = updateData.isClosed;
//     }

//     // Update the project
//     const updateResult = await projectRepository.updateProject(projectId, dataToUpdate);
//     if (updateResult.error) {
//       result.error = true;
//       result.code = updateResult.code;
//       result.message = updateResult.message;
//       return result;
//     }

//     result.message = "Project updated successfully";
//     result.data = updateResult.data;
//     return result;
//   }

//   /**
//    * @name deleteProject
//    * @description Deletes a project
//    */
//   public async deleteProject(projectId: string): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     // Find the project
//     const findResult = await projectRepository.findById(projectId);
//     if (findResult.error || !findResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     // Delete the project
//     const deleteResult = await projectRepository.delete(projectId);
//     if (deleteResult.error) {
//       result.error = true;
//       result.code = deleteResult.code;
//       result.message = deleteResult.message;
//       return result;
//     }

//     result.message = "Project deleted successfully";
//     result.data = deleteResult.data;
//     return result;
//   }

//   /**
//    * @name addMember
//    * @description Adds a member to a project
//    */
//   public async addMember(
//     projectId: string,
//     userId: string,
//     role: any
//   ): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     const projectResult = await projectRepository.findById(projectId);
//     if (projectResult.error || !projectResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     const project = projectResult.data as IProjectDoc;
//     const members = (project.members || []).map((m: any) => 
//       typeof m.user === 'object' ? String(m.user._id || m.user.id) : String(m.user)
//     );

//     if (members.includes(userId)) {
//       result.error = true;
//       result.code = 400;
//       result.message = "User is already a member of this project";
//       return result;
//     }

//     const newMember = {
//       user: new Types.ObjectId(userId),
//       role: role,
//       joinedAt: new Date()
//     };

//     const updateResult = await projectRepository.updateProject(projectId, {
//       $push: { members: newMember } as any
//     } as any);

//     if (updateResult.error) {
//       result.error = true;
//       result.code = updateResult.code;
//       result.message = updateResult.message;
//       return result;
//     }

//     result.message = "Member added successfully";
//     result.data = updateResult.data;
//     return result;
//   }

//   /**
//    * @name removeMember
//    * @description Removes a member from a project
//    */
//   public async removeMember(
//     projectId: string,
//     userId: string
//   ): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     const projectResult = await projectRepository.findById(projectId);
//     if (projectResult.error || !projectResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     const updateResult = await projectRepository.updateProject(projectId, {
//       $pull: { 
//         members: { user: new Types.ObjectId(userId) } 
//       } as any
//     } as any);

//     if (updateResult.error) {
//       result.error = true;
//       result.code = updateResult.code;
//       result.message = updateResult.message;
//       return result;
//     }

//     result.message = "Member removed successfully";
//     result.data = updateResult.data;
//     return result;
//   }

//   /**
//    * @name publishProject
//    * @description Publishes a project
//    */
//   public async publishProject(projectId: string): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     const projectResult = await projectRepository.findById(projectId);
//     if (projectResult.error || !projectResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     const updateResult = await projectRepository.updateProject(projectId, {
//       status: ProjectStatus.PUBLISHED,
//       isOpen: true,
//       publishedAt: new Date()
//     } as any);

//     if (updateResult.error) {
//       result.error = true;
//       result.code = updateResult.code;
//       result.message = updateResult.message;
//       return result;
//     }

//     result.message = "Project published successfully";
//     result.data = updateResult.data;
//     return result;
//   }

//   /**
//    * @name closeProject
//    * @description Closes a project
//    */
//   public async closeProject(projectId: string): Promise<IResult> {
//     let result: IResult = { error: false, message: "", code: 200, data: {} };

//     const projectResult = await projectRepository.findById(projectId);
//     if (projectResult.error || !projectResult.data) {
//       result.error = true;
//       result.code = 404;
//       result.message = "Project not found";
//       return result;
//     }

//     const updateResult = await projectRepository.updateProject(projectId, {
//       status: ProjectStatus.CLOSED,
//       isClosed: true,
//       isOpen: false
//     } as any);

//     if (updateResult.error) {
//       result.error = true;
//       result.code = updateResult.code;
//       result.message = updateResult.message;
//       return result;
//     }

//     result.message = "Project closed successfully";
//     result.data = updateResult.data;
//     return result;
//   }
// }

// export default new ProjectService();
