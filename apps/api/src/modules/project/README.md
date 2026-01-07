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
