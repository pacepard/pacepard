# CASL Permission System - Summary

## Overview

The authorization system has been enhanced with a comprehensive CASL (Code Access Security Library) implementation that follows the same microservice architecture as the Workspace module.

## Authorization Principles

### Permission Hierarchy

```
SuperAdmin (Full System Access)
    ↓
Platform Admin (Content Management)
    ↓
Workspace Owner (Full Workspace Control)
    ↓
Project Owner (Full Project Control) → Maintainer (Manage Project Content & Teams)
    ↓
Team Lead (Manage Team & Tasks)
    ↓
Team Member (Update Assigned Tasks)
```

### User Types & Base Permissions

| User Type | Workspace | Project | Team | Tasks |
|------------|-----------|----------|-------|--------|
| **SuperAdmin** | Full Access | Full Access | Full Access | Full Access |
| **Admin** | Create/Edit/Delete | Create/Edit/Publish/Close | Create/Edit/Delete | Create/Edit/Delete/Assign |
| **Business** | Manage Own Workspace | Manage Own Projects | Create/Edit/Delete Teams | Create/Edit/Delete/Assign |
| **Talent** | View Public | View/Join/Leave | View/Update Tasks | Update Assigned Tasks |
| **Mentor** | View | View/Provide Feedback | View | View |
| **Evaluator** | View | View/Evaluate | View | View |

### Project Roles & Permissions

| Role | Project Management | Team Management | Task Management |
|------|-------------------|-----------------|-----------------|
| **LEAD (Owner)** | Edit, Delete, Publish, Close, Invite, Remove Members | Create, Edit, Delete Teams, Rotate Members | Create, Edit, Delete, Assign All Tasks |
| **MAINTAINER** | Edit, Publish, Close, Invite, Remove Members | Create, Edit, Delete Teams, Rotate Members | Create, Edit, Delete, Assign All Tasks |
| **FACILITATOR** | Edit | Create, Edit, Delete Teams, Rotate Members | Create, Edit, Delete, Assign All Tasks |
| **MEMBER** | View | View | Create, Update Own Tasks |
| **MENTOR** | View, Provide Feedback | View | View |
| **JUDGE** | View | View | View, Evaluate Submissions |

### Team Roles & Permissions

| Role | Team Management | Task Management |
|------|-----------------|-----------------|
| **LEAD** | Edit, Manage Members | Create, Edit, Delete, Assign Tasks |
| **MEMBER** | View | View, Update Assigned Tasks |

## Permission Actions

### Workspace Management
- `CREATE_WORKSPACE` - Create a new workspace
- `VIEW_WORKSPACE` - View workspace details
- `EDIT_WORKSPACE` - Update workspace information
- `DELETE_WORKSPACE` - Delete a workspace
- `MANAGE_WORKSPACE_MEMBERS` - Add/remove workspace members

### Project Management
- `CREATE_PROJECT` - Create a project in workspace
- `VIEW_PROJECT` - View project details
- `EDIT_PROJECT` - Update project information
- `DELETE_PROJECT` - Delete a project
- `PUBLISH_PROJECT` - Publish a project
- `CLOSE_PROJECT` - Close a project
- `MANAGE_PROJECT_MEMBERS` - Manage project membership
- `INVITE_PROJECT_MEMBERS` - Invite users to project
- `REMOVE_PROJECT_MEMBERS` - Remove users from project

### Team Management
- `CREATE_TEAM` - Create a team within project
- `VIEW_TEAM` - View team details
- `EDIT_TEAM` - Update team information
- `DELETE_TEAM` - Delete a team
- `MANAGE_TEAM_MEMBERS` - Add/remove team members
- `ROTATE_TEAM_MEMBERS` - Move members between teams within project

### Task Management
- `CREATE_TASK` - Create a task
- `VIEW_TASK` - View task details
- `EDIT_TASK` - Update task information
- `DELETE_TASK` - Delete a task
- `ASSIGN_TASK` - Assign task to users
- `UPDATE_TASK_STATUS` - Change task status

### Member Actions
- `JOIN_PROJECT` - Request to join a project
- `LEAVE_PROJECT` - Leave a project

### Evaluation
- `EVALUATE_SUBMISSION` - Evaluate a submission
- `VIEW_EVALUATIONS` - View evaluations
- `PROVIDE_FEEDBACK` - Provide feedback on submissions
- `PROVIDE_MENTORSHIP` - Provide mentorship to members

## Team Rotation Feature

### Overview

Team rotation allows authorized users (Project Owners, Maintainers, and Facilitators) to reorganize team membership during an ongoing project. This ensures optimal team composition and resource allocation.

### Authorization

**Who Can Rotate:**
- Project Owners (LEAD role)
- Project Maintainers (MAINTAINER role)
- Project Facilitators (FACILITATOR role)

### Rotation Logic

1. **Remove from Current Teams**: User is removed from all teams they belong to within the project
2. **Add to Target Team**: User is added to the specified target team
3. **Preserve Role**: User's previous role is maintained (or can be changed)
4. **Audit Trail**: Rotation is logged for tracking

### API Endpoint

```
POST /projects/:projectId/teams/rotate
```

**Request Body:**
```json
{
  "memberUserId": "user123",
  "targetTeamId": "team456"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Member rotated successfully to target team",
  "data": {
    "team": { ... },
    "teamsAffected": 2
  }
}
```

## Implementation Details

### Files Updated

1. **Permission Infrastructure**
   - `permission.action.ts` - Permission actions and resource types
   - `role.interface.ts` - Role definitions with permission mappings
   - `blocks.interface.ts` - Block structure for rich content

2. **Team Module** (Enhanced)
   - `team.model.ts` - Added workspaceId, businessId, proper members schema
   - `team.repository.ts` - Added team rotation support methods
   - `team.service.ts` - Complete implementation with authorization checks
   - `team.controller.ts` - Controllers including rotation endpoint
   - `team.router.ts` - RESTful routes

3. **Code Utilities**
   - `code.util.ts` - Added `genTeamCode()` for unique team identifiers

4. **Error Handling**
   - Using both `ErrorResponse` (legacy) and `AppError` (new)
   - `BadRequestError`, `ForbiddenError`, `NotFoundError` for type-safe errors

### Authorization Checks

The service layers now implement context-aware authorization:

```typescript
// Example: Team Rotation
if (!this.canRotateMembers(actorRole)) {
  throw new ForbiddenError(
    "Only project owners and maintainers can rotate team members"
  );
}
```

### Caching Strategy

All GET endpoints use Redis caching:
- Single items: 300s (5 minutes) TTL
- Lists: 180s (3 minutes) TTL
- Automatic cache invalidation on updates/deletes

## Usage Examples

### Check Permissions in Services

```typescript
import permissionService from '../../services/permission.service';

// Build user context
const userContext = permissionService.buildUserContext(user);

// Build resource context
const resourceContext = permissionService.buildResourceContext({
  resourceType: ResourceType.PROJECT,
  projectId: projectId,
  projectMemberRole: user.role,
  isPublic: project.isOpen
});

// Check permission
if (permissionService.can(userContext, PermissionAction.EDIT_PROJECT, resourceContext)) {
  // Allow action
} else {
  throw new ForbiddenError("You do not have permission to edit this project");
}
```

### Enforce Permissions in Controllers

```typescript
const userContext = permissionService.buildUserContext((req as any).user);

permissionService.enforce(
  userContext,
  PermissionAction.ROTATE_TEAM_MEMBERS,
  { resourceType: ResourceType.TEAM, projectId }
);
```

## Security Considerations

1. **Ownership Checks**: Users can always manage resources they created
2. **Role Hierarchy**: Higher roles can manage lower roles' actions
3. **Project Isolation**: Changes in one project don't affect others
4. **Team Isolation**: Team members can't access other teams without proper authorization
5. **Audit Trail**: All critical actions should be logged

## Future Enhancements

1. **Fine-grained Permissions**: More granular control over specific fields
2. **Conditional Permissions**: Time-based, location-based, or approval-chain permissions
3. **Permission Groups**: Group permissions for easier assignment
4. **Role Inheritance**: Automatic inheritance of permissions from parent roles
5. **Dynamic Permissions**: Runtime permission evaluation based on business rules
6. **Permission Templates**: Pre-defined permission sets for common use cases

## API Routes

### Workspace Routes
- `POST /workspaces` - Create workspace
- `GET /workspaces/list` - List all workspaces
- `GET /workspaces/:id` - Get workspace
- `PUT /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace
- `POST /workspaces/:id/members` - Add member
- `DELETE /workspaces/:id/members/:userId` - Remove member

### Project Routes
- `POST /workspaces/:workspaceId/projects` - Create project
- `GET /projects/:id` - Get project
- `GET /workspaces/:workspaceId/projects` - Get workspace projects
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/publish` - Publish project
- `POST /projects/:id/close` - Close project
- `POST /projects/:id/members` - Add member
- `DELETE /projects/:id/members/:userId` - Remove member

### Team Routes
- `POST /projects/:projectId/teams` - Create team
- `GET /projects/:projectId/teams` - Get project teams
- `GET /teams/:id` - Get team
- `DELETE /teams/:id` - Delete team
- `POST /teams/:teamId/members` - Add team member
- `DELETE /teams/:teamId/members/:userId` - Remove team member
- `PUT /teams/:teamId/members/:userId/role` - Update member role
- `POST /projects/:projectId/teams/rotate` - Rotate member between teams

### Task Routes
- `POST /projects/:projectId/teams/:teamId/tasks` - Create task
- `GET /tasks/:id` - Get task
- `GET /projects/:projectId/tasks` - Get project tasks
- `GET /teams/:teamId/tasks` - Get team tasks
- `GET /users/:userId/tasks` - Get user's assigned tasks
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/assign` - Assign task to users

## Notes

- All routes are protected by `Protect` middleware
- Authorization checks are performed in service layers
- Error responses follow consistent format with error codes
- Redis caching is implemented for all GET endpoints
- Team rotation removes user from ALL project teams before adding to target team
- Permission checks are context-aware (considering user type, role, and resource ownership)
