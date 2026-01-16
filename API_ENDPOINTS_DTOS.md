# API Endpoints & DTOs Documentation

## Overview

This document provides a comprehensive mapping of all API endpoints across Pacepard modules, including HTTP methods, routes, request DTOs, and response objects.

---

## 1. AUTHENTICATION Module

### 1.1 Auth (authentication/auth)

| Method | Route                   | Request DTO         | Response Object  |
| ------ | ----------------------- | ------------------- | ---------------- |
| POST   | `/auth/register`        | `RegisterUserDTO`   | User (mapped)    |
| POST   | `/auth/login`           | `LoginDTO`          | Token response   |
| POST   | `/auth/verify-otp`      | `VerifyOtpDTO`      | User (activated) |
| POST   | `/auth/resend-otp`      | `ResendOtpDTO`      | Success message  |
| POST   | `/auth/activate`        | `VerifyOtpDTO`      | User (activated) |
| POST   | `/auth/forgot-password` | `ForgotPasswordDTO` | Success message  |
| POST   | `/auth/reset-password`  | `ResetPasswordDTO`  | Token response   |
| POST   | `/auth/change-password` | `ChangePasswordDTO` | Success message  |
| POST   | `/auth/token`           | `RefreshTokenDTO`   | New token        |
| POST   | `/auth/logout`          | -                   | Success message  |

**Request DTOs:**

```typescript
RegisterUserDTO {
  email: string;
  password: string;
  userType: UserType;
}

LoginDTO {
  email: string;
  password: string;
}

VerifyOtpDTO {
  email: string;
  otp: number;
  otpType: OtpType;
}

ResendOtpDTO {
  email: string;
  otpType: OtpType;
}

ForgotPasswordDTO {
  email: string;
}

ResetPasswordDTO {
  email: string;
  newPassword: string;
}

ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
```

---

### 1.2 Role (authentication/role)

| Method | Route                                        | Request DTO              | Response Object           |
| ------ | -------------------------------------------- | ------------------------ | ------------------------- |
| POST   | `/roles`                                     | `CreateRoleDTO`          | Role (created)            |
| GET    | `/roles/list`                                | -                        | Role[] (paginated)        |
| GET    | `/roles/:id`                                 | -                        | Role                      |
| PUT    | `/roles/:id`                                 | `UpdateRoleDTO`          | Role (updated)            |
| DELETE | `/roles/:id`                                 | -                        | Success message           |
| GET    | `/roles/user/:userId`                        | -                        | Role[]                    |
| POST   | `/roles/user/:userId/attach`                 | `AttachRoleDTO`          | UserRole (attached)       |
| DELETE | `/roles/user/:userId/detach`                 | `AttachRoleDTO`          | Success message           |
| POST   | `/roles/workspace/:workspaceId/assign`       | `AssignWorkspaceRoleDTO` | WorkspaceMember (updated) |
| DELETE | `/roles/workspace/:workspaceId/user/:userId` | -                        | Success message           |
| POST   | `/roles/project/:projectId/assign`           | `AssignProjectRoleDTO`   | ProjectMember (updated)   |
| DELETE | `/roles/project/:projectId/user/:userId`     | -                        | Success message           |

**Request DTOs:**

```typescript
CreateRoleDTO {
  name: string;
  description: string;
  permissions?: string[];
}

UpdateRoleDTO {
  description?: string;
  permissions?: string[];
}

AttachRoleDTO {
  roleName: string;
}

AssignWorkspaceRoleDTO {
  userId: string;
  role: WorkspaceMemberRole;
}

AssignProjectRoleDTO {
  userId: string;
  role: ProjectMemberRole;
}
```

---

## 2. CORE Module

### 2.1 Workspace (core/workspace)

| Method | Route                                  | Request DTO                | Response Object          |
| ------ | -------------------------------------- | -------------------------- | ------------------------ |
| POST   | `/workspace`                           | `CreateWorkspaceDTO`       | Workspace (created)      |
| GET    | `/workspace/list`                      | -                          | Workspace[] (paginated)  |
| GET    | `/workspace/:id`                       | -                          | Workspace                |
| PUT    | `/workspace/:id`                       | `UpdateWorkspaceDTO`       | Workspace (updated)      |
| PUT    | `/workspace/:id/domain-access`         | `UpdateDomainAccessDTO`    | Workspace (updated)      |
| DELETE | `/workspace/:id`                       | -                          | Success message          |
| POST   | `/workspace/:id/members`               | `AddMemberDTO`             | WorkspaceMember (added)  |
| DELETE | `/workspace/:id/members/:userId`       | `RemoveMemberDTO`          | Success message          |
| POST   | `/workspace/:id/invite`                | `InviteMemberDTO`          | Invitation (sent)        |
| POST   | `/workspace/:id/invite/bulk`           | `BulkInviteMemberDTO`      | Invitation[] (sent)      |
| POST   | `/workspace/:id/invite/shareable-link` | `GenerateShareableLinkDTO` | ShareableLink            |
| POST   | `/workspace/invite/join`               | `JoinWorkspaceByLinkDTO`   | WorkspaceMember (joined) |
| POST   | `/workspace/:id/invite/mentor`         | `InviteMemberDTO`          | Invitation (sent)        |
| POST   | `/workspace/:id/invite/judge`          | `InviteMemberDTO`          | Invitation (sent)        |
| POST   | `/workspace/:id/invite/mentor/resend`  | `InviteMemberDTO`          | Invitation (resent)      |
| POST   | `/workspace/:id/invite/judge/resend`   | `InviteMemberDTO`          | Invitation (resent)      |
| POST   | `/workspace/:id/mentors`               | `AddMentorDTO`             | Guest (added)            |
| GET    | `/workspace/:id/mentors`               | -                          | Guest[]                  |
| DELETE | `/workspace/:id/mentors/:mentorId`     | `RemoveMentorDTO`          | Success message          |
| POST   | `/workspace/:id/judges`                | `AddJudgeDTO`              | Guest (added)            |
| GET    | `/workspace/:id/judges`                | -                          | Guest[]                  |
| DELETE | `/workspace/:id/judges/:judgeId`       | `RemoveJudgeDTO`           | Success message          |

**Request DTOs:**

```typescript
CreateWorkspaceDTO {
  name: string;
  createdBy?: string;
  user?: IUserDoc;
  icon?: IFile;
}

UpdateWorkspaceDTO {
  workspaceId: string;
  user: IUserDoc | string;
  name?: string;
}

InviteMemberDTO {
  workspaceId: string;
  email: string;
}

BulkInviteMemberDTO {
  workspaceId: string;
  emails: string[];
}

AddMemberDTO {
  workspaceId: string;
  userId: string;
  role?: WorkspaceMemberRole;
  invitedBy?: string;
  requestingUser: IUserDoc | string;
}

RemoveMemberDTO {
  workspaceId: string;
  userId: string;
  requestingUser: IUserDoc | string;
}

AddMentorDTO {
  workspaceId: string;
  mentorId: string;
  requestingUser: IUserDoc | string;
}

RemoveMentorDTO {
  workspaceId: string;
  mentorId: string;
  requestingUser: IUserDoc | string;
}

AddJudgeDTO {
  workspaceId: string;
  judgeId: string;
  requestingUser: IUserDoc | string;
}

RemoveJudgeDTO {
  workspaceId: string;
  judgeId: string;
  requestingUser: IUserDoc | string;
}

UpdateDomainAccessDTO {
  workspaceId: string;
  allowDomainAccess: boolean;
  domain?: string;
  user?: IUserDoc | string;
}

GenerateShareableLinkDTO {
  expiresInDays?: number;
}

JoinWorkspaceByLinkDTO {
  token: string;
}
```

---

## 3. HACKATHONS Module

### 3.1 Hackathon (hackathons/hackathon)

| Method | Route                                   | Request DTO          | Response Object         |
| ------ | --------------------------------------- | -------------------- | ----------------------- |
| POST   | `/hackathons`                           | `CreateHackathonDTO` | Hackathon (created)     |
| GET    | `/hackathons/list`                      | -                    | Hackathon[] (paginated) |
| GET    | `/hackathons/:id`                       | -                    | Hackathon               |
| PUT    | `/hackathons/:id`                       | `UpdateHackathonDTO` | Hackathon (updated)     |
| DELETE | `/hackathons/:id`                       | -                    | Success message         |
| POST   | `/hackathons/:id/members`               | `AddMemberDTO`       | HackathonMember (added) |
| DELETE | `/hackathons/:id/members/:userId`       | `RemoveMemberDTO`    | Success message         |
| POST   | `/hackathons/:id/invite`                | `InviteMemberDTO`    | Invitation (sent)       |
| POST   | `/hackathons/:id/invite/shareable-link` | -                    | ShareableLink           |
| POST   | `/hackathons/:id/invite/mentor`         | `InviteMemberDTO`    | Invitation (sent)       |
| POST   | `/hackathons/:id/invite/judge`          | `InviteMemberDTO`    | Invitation (sent)       |
| POST   | `/hackathons/:id/invite/mentor/resend`  | `InviteMemberDTO`    | Invitation (resent)     |
| POST   | `/hackathons/:id/invite/judge/resend`   | `InviteMemberDTO`    | Invitation (resent)     |

**Request DTOs:**

```typescript
CreateHackathonDTO {
  name: string;
  description: string;
  type?: HackathonType;
  workspaceId: string;
  businessId?: string;
  image?: string;
  settings?: {
    language?: string;
    startTime?: string;
    startDate?: string;
    startTimeZone?: string;
    isClosed?: string;
    closeTime?: string;
    closeDate?: string;
    closeTimeZone?: string;
    closeMessageTitle?: string;
    closeMessageDescription?: string;
    redirectOnClose?: string;
  };
  formtype?: string;
  createdBy?: string;
  user?: IUserDoc;
}

UpdateHackathonDTO {
  hackathonId: string;
  user: IUserDoc | string;
  name?: string;
  description?: string;
  type?: HackathonType;
  status?: HackStatusType;
  image?: string;
  settings?: {...};
  formtype?: string;
}

InviteMemberDTO {
  hackathonId: string;
  email: string;
}

AddMemberDTO {
  hackathonId: string;
  userId: string;
  role?: HackathonMemberRole;
  invitedBy?: string;
  requestingUser: IUserDoc | string;
}

RemoveMemberDTO {
  hackathonId: string;
  userId: string;
  requestingUser: IUserDoc | string;
}
```

---

### 3.2 Entry (hackathons/entry)

| Method | Route                          | Request DTO       | Response Object     |
| ------ | ------------------------------ | ----------------- | ------------------- |
| POST   | `/entries`                     | `CreateEntryDTO`  | Entry (created)     |
| GET    | `/entries/list`                | -                 | Entry[] (paginated) |
| GET    | `/entries/:id`                 | -                 | Entry               |
| PUT    | `/entries/:id`                 | `UpdateEntryDTO`  | Entry (updated)     |
| DELETE | `/entries/:id`                 | -                 | Success message     |
| POST   | `/entries/:id/members`         | `AddMemberDTO`    | EntryMember (added) |
| DELETE | `/entries/:id/members/:userId` | `RemoveMemberDTO` | Success message     |
| POST   | `/entries/:id/invite`          | `InviteMemberDTO` | Invitation (sent)   |

**Request DTOs:**

```typescript
CreateEntryDTO {
  name: string;
  description: string;
  hackathonId: string;
  entryType?: EntryType;
  image?: string;
  tags?: Array<string>;
  category?: string;
  settings?: {
    transferOwnershipTo?: string;
  };
  createdBy?: string;
  user?: IUserDoc;
}

UpdateEntryDTO {
  entryId: string;
  user: IUserDoc | string;
  name?: string;
  description?: string;
  entryType?: EntryType;
  status?: EntryStatusType;
  image?: string;
  tags?: Array<string>;
  category?: string;
  settings?: {...};
}

InviteMemberDTO {
  entryId: string;
  email: string;
}

AddMemberDTO {
  entryId: string;
  userId: string;
  invitedBy?: string;
  requestingUser: IUserDoc | string;
}

RemoveMemberDTO {
  entryId: string;
  userId: string;
  requestingUser: IUserDoc | string;
}
```

---

### 3.3 Squad (hackathons/squad)

| Method | Route                         | Request DTO       | Response Object     |
| ------ | ----------------------------- | ----------------- | ------------------- |
| POST   | `/squads`                     | `CreateSquadDTO`  | Squad (created)     |
| GET    | `/squads/list`                | -                 | Squad[] (paginated) |
| GET    | `/squads/:id`                 | -                 | Squad               |
| PUT    | `/squads/:id`                 | `UpdateSquadDTO`  | Squad (updated)     |
| DELETE | `/squads/:id`                 | -                 | Success message     |
| POST   | `/squads/:id/members`         | `AddMemberDTO`    | SquadMember (added) |
| DELETE | `/squads/:id/members/:userId` | `RemoveMemberDTO` | Success message     |
| POST   | `/squads/:id/invite`          | `InviteMemberDTO` | Invitation (sent)   |

**Request DTOs:**

```typescript
CreateSquadDTO {
  name: string;
  description?: string;
  hackathonId: string;
  createdBy?: string;
  user?: IUserDoc;
}

UpdateSquadDTO {
  squadId: string;
  user: IUserDoc | string;
  name?: string;
  description?: string;
}

InviteMemberDTO {
  squadId: string;
  email: string;
}

AddMemberDTO {
  squadId: string;
  userId: string;
  role?: SquadMemberRole;
  invitedBy?: string;
  requestingUser: IUserDoc | string;
}

RemoveMemberDTO {
  squadId: string;
  userId: string;
  requestingUser: IUserDoc | string;
}
```

---

### 3.4 Submission (hackathons/submission)

| Method | Route               | Request DTO           | Response Object          |
| ------ | ------------------- | --------------------- | ------------------------ |
| POST   | `/submissions`      | `CreateSubmissionDTO` | Submission (created)     |
| GET    | `/submissions/list` | -                     | Submission[] (paginated) |
| GET    | `/submissions/:id`  | -                     | Submission               |
| PUT    | `/submissions/:id`  | `UpdateSubmissionDTO` | Submission (updated)     |
| DELETE | `/submissions/:id`  | -                     | Success message          |

**Request DTOs:**

```typescript
CreateSubmissionDTO {
  hackathonId: string;
  entryId?: string;
  formId: string;
  responses: Array<IResponse>;
  questions?: Array<IQuestion>;
  isCompleted?: boolean;
  submittedAt?: Date;
  user?: IUserDoc;
}

UpdateSubmissionDTO {
  submissionId: string;
  user: IUserDoc | string;
  responses?: Array<IResponse>;
  isCompleted?: boolean;
  submittedAt?: Date;
}
```

---

## 4. PAYMENTS Module

### 4.1 Plan (payments/plan)

| Method | Route            | Request DTO     | Response Object    |
| ------ | ---------------- | --------------- | ------------------ |
| GET    | `/plans`         | -               | Plan[] (paginated) |
| POST   | `/plans`         | `newPlanDTO`    | Plan (created)     |
| PATCH  | `/plans/:planId` | `updatePlanDTO` | Plan (updated)     |

**Request DTOs:**

```typescript
newPlanDTO {
  name: string;
  label: string;
  planType: PlanType;
  displayName: string;
  description: string;
  trial: IPlanTrial;
  pricing: IPlanPricing;
  members: {
    limit: number;
    frequency: string;
  };
  domains: {
    limit: number;
    frequency: string;
  };
  projects: {
    limit: number;
    frequency: string;
  };
}

updatePlanDTO {
  planId: string;
  updates: Partial<newPlanDTO>;
}
```

---

### 4.2 Subscription (payments/subscription)

| Method | Route                   | Request DTO          | Response Object    |
| ------ | ----------------------- | -------------------- | ------------------ |
| GET    | `/subscriptions/me`     | -                    | Subscription       |
| POST   | `/subscriptions`        | `newSubscriptionDTO` | SubscriptionIntent |
| GET    | `/subscriptions/verify` | -                    | Payment response   |
| POST   | `/subscriptions/cancel` | -                    | Success message    |

**Request DTOs:**

```typescript
newSubscriptionDTO {
  planId: string;
  currency: Currency;
  interval: BillingFrequency;
}
```

---

## 5. PROJECTS Module

### 5.1 Project (projects/project)

| Method | Route                                 | Request DTO        | Response Object       |
| ------ | ------------------------------------- | ------------------ | --------------------- |
| GET    | `/projects/:id`                       | -                  | Project               |
| PUT    | `/projects/:id`                       | `UpdateProjectDTO` | Project (updated)     |
| DELETE | `/projects/:id`                       | -                  | Success message       |
| POST   | `/workspaces/:workspaceId/projects`   | `CreateProjectDTO` | Project (created)     |
| GET    | `/workspaces/:workspaceId/projects`   | -                  | Project[] (paginated) |
| POST   | `/projects/:id/publish`               | -                  | Project (published)   |
| POST   | `/projects/:id/close`                 | -                  | Project (closed)      |
| POST   | `/projects/:id/members`               | `AddMemberDTO`     | ProjectMember (added) |
| DELETE | `/projects/:id/members/:userId`       | -                  | Success message       |
| POST   | `/projects/:id/invite/shareable-link` | -                  | ShareableLink         |

**Request DTOs:**

```typescript
CreateProjectDTO {
  user: IUserDoc;
  workspaceId: string;
  title: string;
  tagline?: string;
  description: string;
  category?: string;
  type?: ProjectType;
  items?: Array<IBlockDoc>;
  tags?: Array<string>;
  image?: IFile | string;
  createdBy: string;
}

UpdateProjectDTO {
  projectId: string;
  user: IUserDoc | string;
  title?: string;
  tagline?: string;
  description?: string;
  category?: string;
  type?: ProjectType;
  items?: Array<IBlockDoc>;
  tags?: Array<string>;
  image?: IFile | string;
}

ProjectDTO {
  id: string;
  code: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  workspaceId?: string;
  businessId?: string;
  category: string;
  type: ProjectType;
  status: ProjectStatus;
  tags: string[];
  image: string;
  items: IBlockDoc[];
  documentation: string;
  members: ProjectMemberDTO[];
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 5.2 Task (projects/task)

| Method | Route                                            | Request DTO     | Response Object    |
| ------ | ------------------------------------------------ | --------------- | ------------------ |
| GET    | `/tasks/:id`                                     | -               | Task               |
| PUT    | `/tasks/:id`                                     | `UpdateTaskDTO` | Task (updated)     |
| DELETE | `/tasks/:id`                                     | -               | Success message    |
| POST   | `/tasks/:id/assign`                              | -               | Assignment         |
| GET    | `/tasks/projects/:projectId/tasks`               | -               | Task[] (paginated) |
| GET    | `/tasks/teams/:teamId/tasks`                     | -               | Task[] (paginated) |
| GET    | `/tasks/users/:userId/tasks`                     | -               | Task[] (paginated) |
| POST   | `/tasks/projects/:projectId/teams/:teamId/tasks` | `CreateTaskDTO` | Task (created)     |

**Request DTOs:**

```typescript
CreateTaskDTO {
  user: IUserDoc;
  workspaceId: string;
  projectId: string;
  teamId: string;
  title: string;
  description: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  assignedTo?: string[];
  tags?: string[];
  dueDate?: Date;
  image?: IFile | string;
  createdBy: string;
}

UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatusType;
  priority?: TaskPriorityType;
  assignedTo?: string[];
  tags?: string[];
  dueDate?: Date;
  completedAt?: Date;
  image?: IFile | string;
}

TaskDTO {
  id: string;
  code: string;
  title: string;
  description: string;
  workspaceId: string;
  businessId: string;
  projectId: string;
  teamId: string;
  status: TaskStatusType;
  priority: TaskPriorityType;
  assignedTo: string[];
  createdBy: string;
  tags: string[];
  dueDate: Date;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 5.3 Team (projects/team)

| Method | Route                                     | Request DTO     | Response Object      |
| ------ | ----------------------------------------- | --------------- | -------------------- |
| GET    | `/teams/:id`                              | -               | Team                 |
| DELETE | `/teams/:id`                              | -               | Success message      |
| POST   | `/teams/projects/:projectId/teams`        | `CreateTeamDTO` | Team (created)       |
| GET    | `/teams/projects/:projectId/teams`        | -               | Team[] (paginated)   |
| POST   | `/teams/:teamId/members`                  | -               | TeamMember (added)   |
| DELETE | `/teams/:teamId/members/:userId`          | -               | Success message      |
| PUT    | `/teams/:teamId/members/:userId/role`     | -               | TeamMember (updated) |
| POST   | `/teams/:id/invite/shareable-link`        | -               | ShareableLink        |
| POST   | `/teams/projects/:projectId/teams/rotate` | -               | Rotation result      |

**Request DTOs:**

```typescript
CreateTeamDTO {
  user: IUserDoc;
  projectId: string;
  name: string;
  description?: string;
  image?: IFile | string;
  createdBy?: string;
}

UpdateTeamDTO {
  name?: string;
  description?: string;
  image?: IFile | string;
}

TeamDTO {
  id: string;
  code: string;
  name: string;
  description: string;
  workspaceId?: string;
  businessId?: string;
  projectId?: string;
  createdBy: string;
  members: TeamMemberDTO[];
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 6. USERS Module

### 6.1 User (users/user)

| Method | Route                         | Request DTO              | Response Object         |
| ------ | ----------------------------- | ------------------------ | ----------------------- |
| GET    | `/user`                       | -                        | UserInfo                |
| GET    | `/user/list`                  | -                        | User[] (paginated)      |
| DELETE | `/user/deactivate`            | -                        | Success message         |
| POST   | `/user/onboard/user-type`     | `OnboardUserTypeDTO`     | Onboarding response     |
| POST   | `/user/onboard/basic-info`    | `OnboardBasicInfoDTO`    | Onboarding response     |
| POST   | `/user/onboard/talent-info`   | `OnboardTalentInfoDTO`   | Onboarding response     |
| POST   | `/user/onboard/business-info` | `OnboardBusinessInfoDTO` | Onboarding response     |
| POST   | `/user/onboard/user-info`     | `OnboardUserInfoDTO`     | Onboarding response     |
| POST   | `/user/onboard/complete`      | -                        | Onboarding complete     |
| GET    | `/user/onboard/status`        | -                        | `OnboardStatusResponse` |

**Request DTOs:**

```typescript
OnboardUserTypeDTO {
  userType: UserType;
}

OnboardBasicInfoDTO {
  firstName: string;
  lastName: string;
  phoneCode?: string;
  phoneNumber?: string;
  location: {
    address?: string;
    city?: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
  timeZone: string;
}

OnboardTalentInfoDTO {
  specialty: string;
  gender: GenderType;
  dateOfBirth: string;
}

OnboardBusinessInfoDTO {
  businessName: string;
  businessType: BusinessType;
  industry: string;
  tags?: Array<string>;
}

OnboardUserInfoDTO {
  specialty: string;
  role: string;
  discovery: string;
}

OnboardStatusResponse {
  step: number;
  status: OnboardStatus;
  progress: {
    completedSteps: number;
    totalSteps: number;
    percentage: number;
  };
  canProceed: boolean;
  currentStepData?: any;
}

UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  phoneCode?: string;
  country?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: string;
  userType: string;
  isSuper: boolean;
  isAdmin: boolean;
  isOrganisation: boolean;
  isTalent: boolean;
  isActive: boolean;
  isLocked: boolean;
  lockedUntil: Date | null;
}
```

---

### 6.2 Talent (users/talent)

| Method | Route                   | Request DTO                 | Response Object             |
| ------ | ----------------------- | --------------------------- | --------------------------- |
| GET    | `/talent`               | -                           | TalentProfile               |
| GET    | `/talent/list`          | -                           | TalentProfile[] (paginated) |
| PUT    | `/talent`               | `UpdateTalentDTO`           | TalentProfile (updated)     |
| PUT    | `/talent/interests`     | -                           | TalentProfile (updated)     |
| POST   | `/talent/skills`        | -                           | Skill (added)               |
| DELETE | `/talent/skills/:skill` | -                           | Success message             |
| POST   | `/talent/invite`        | `InviteTalentDTO`           | Invitation (sent)           |
| POST   | `/talent/invite/accept` | `AcceptTalentInvitationDTO` | TalentProfile (created)     |
| POST   | `/talent/invite/revoke` | -                           | Success message             |
| POST   | `/talent/set-password`  | `SetTalentPasswordDTO`      | Success message             |

**Request DTOs:**

```typescript
CreateTalentDTO {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  user: IUserDoc;
  createdBy: string;
}

UpdateTalentDTO {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  user: IUserDoc;
  bio?: string;
  gender?: GenderType;
  dateOfBirth?: string;
  occupation?: OccupationType;
  specialties?: string[];
  intrests?: string[];
  skils?: string[];
  socials?: ISocials[];
  employment?: {...};
  education?: {...};
  roles?: ITalentType[];
  createdBy?: string;
}

InviteTalentDTO {
  email: string;
  resourceId?: string;
}

AcceptTalentInvitationDTO {
  token: string;
  email: string;
  password: string;
}

SetTalentPasswordDTO {
  password: string;
}
```

---

### 6.3 Business (users/business)

| Method | Route                     | Request DTO                   | Response Object               |
| ------ | ------------------------- | ----------------------------- | ----------------------------- |
| GET    | `/business`               | -                             | BusinessProfile               |
| GET    | `/business/list`          | -                             | BusinessProfile[] (paginated) |
| PUT    | `/business`               | `UpdateBusinessDTO`           | BusinessProfile (updated)     |
| PUT    | `/business/tags`          | -                             | BusinessProfile (updated)     |
| POST   | `/business/tags`          | -                             | Tag (added)                   |
| DELETE | `/business/tags/:tag`     | -                             | Success message               |
| POST   | `/business/invite`        | `InviteBusinessDTO`           | Invitation (sent)             |
| POST   | `/business/invite/accept` | `AcceptBusinessInvitationDTO` | BusinessProfile (created)     |
| POST   | `/business/invite/revoke` | -                             | Success message               |
| POST   | `/business/set-password`  | `SetBusinessPasswordDTO`      | Success message               |

**Request DTOs:**

```typescript
CreateBusinessDTO {
  user: IUserDoc;
  businessName: string;
  businessType: BusinessType;
  industry: string;
  createdBy?: string;
}

UpdateBusinessDTO {
  businessName?: string;
  businessType?: BusinessType;
  description?: string;
  size?: string;
  industry?: string;
  tags?: string[];
  website?: string;
  socials?: ISocials[];
  isPublic?: boolean;
}

InviteBusinessDTO {
  email: string;
  resourceId?: string;
}

AcceptBusinessInvitationDTO {
  token: string;
  email: string;
  password: string;
}

SetBusinessPasswordDTO {
  password: string;
}
```

---

### 6.4 Guest (users/guest)

| Method | Route          | Request DTO      | Response Object     |
| ------ | -------------- | ---------------- | ------------------- |
| POST   | `/guests`      | `CreateGuestDTO` | Guest (created)     |
| GET    | `/guests/list` | -                | Guest[] (paginated) |
| GET    | `/guests/:id`  | -                | Guest               |
| PUT    | `/guests/:id`  | `UpdateGuestDTO` | Guest (updated)     |
| DELETE | `/guests/:id`  | -                | Success message     |

**Request DTOs:**

```typescript
CreateGuestDTO {
  firstName: string;
  lastName: string;
  email: string;
  type: GuestTypeEnum;
  status?: GuestStatusEnum;
  visibility?: GuestVisibiltyEnum;
  guestImage?: IFile;
  jobTitle?: string;
  organization?: string;
  bio?: string;
  areasOfExpertise?: string[];
  yearsOfExperience?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  website?: string;
  mentorType?: MentorContextType;
  hackathonId?: string;
  workspaceId?: string;
  projectId?: string;
  orgId: string;
  invitedBy: string;
}

UpdateGuestDTO {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  organization?: string;
  bio?: string;
  areasOfExpertise?: string[];
  yearsOfExperience?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  website?: string;
  status?: GuestStatusEnum;
  visibility?: GuestVisibiltyEnum;
  mentorType?: MentorContextType;
  guestImage?: IFile;
}

GuestInviteDTO {
  email: string;
  type: GuestTypeEnum;
  mentorType?: MentorContextType;
  hackathonId?: string;
  workspaceId?: string;
  projectId?: string;
  invitedBy: string;
}
```

---

### 6.5 Admin (users/admin)

| Method | Route                  | Request DTO                | Response Object     |
| ------ | ---------------------- | -------------------------- | ------------------- |
| POST   | `/admin/invite`        | `InviteAdminDTO`           | Invitation (sent)   |
| POST   | `/admin/invite/accept` | `AcceptAdminInvitationDTO` | Admin (created)     |
| POST   | `/admin/invite/revoke` | -                          | Success message     |
| POST   | `/admin/set-password`  | `SetAdminPasswordDTO`      | Success message     |
| POST   | `/admin`               | `CreateAdminDTO`           | Admin (created)     |
| GET    | `/admin`               | -                          | AdminProfile        |
| GET    | `/admin/list`          | -                          | Admin[] (paginated) |
| GET    | `/admin/:id`           | -                          | Admin               |
| PUT    | `/admin/:id`           | `UpdateAdminDTO`           | Admin (updated)     |
| DELETE | `/admin/:id`           | -                          | Success message     |

**Request DTOs:**

```typescript
CreateAdminDTO {
  code: string;
  user: IUserDoc;
  firstName: string;
  lastName: string;
  email: string;
  adminType: AdminTypeEnum;
  department: AdminDepartmentEnum;
  position: CompanyRoleEnum;
  accessLevel?: number;
  createdBy?: string;
}

UpdateAdminDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  adminType?: AdminTypeEnum;
  department?: AdminDepartmentEnum;
  position?: CompanyRoleEnum;
  accessLevel?: number;
}

InviteAdminDTO {
  email: string;
  resourceId?: string;
}

AcceptAdminInvitationDTO {
  token: string;
  email: string;
  password: string;
}

SetAdminPasswordDTO {
  password: string;
}
```

---

## 7. PLATFORM Module

### 7.1 Storage (platform/storage)

| Method | Route             | Request DTO      | Response Object |
| ------ | ----------------- | ---------------- | --------------- |
| POST   | `/storage/upload` | File (multipart) | `ImageDTO`      |

**Request DTOs:**

```typescript
// File upload (multipart/form-data)

ImageDTO {
  uploadRef: string;
  uploadedBy: string;
  fileName: string;
  file: string;  // Full S3 URL
  s3Key?: string;  // S3 key for backend operations
}
```

---

### 7.2 Invitation (platform/Invitation)

| Method                           | Route | Request DTO           | Response Object      |
| -------------------------------- | ----- | --------------------- | -------------------- |
| Used internally by other modules | -     | `CreateInvitationDTO` | Invitation (created) |

**Request DTOs:**

```typescript
CreateInvitationDTO {
  invitedBy: string;
  inviteeEmail: string;
  inviteeUserId?: string;
  inviteType: InvitationType;
  resourceId: string;
  expiresAt?: Date;
  inviteStatus?: InvitationStatus;
  inviteToken?: string;
  metadata?: Record<string, unknown>;
}

InviteTokenDTO {
  token: string;
  email: string;
}

CreateBulkInvitationDTO {
  invitedBy: string;
  inviteeEmails: string[];
  inviteeUserIds?: string[];
  inviteType: InvitationType;
  resourceId: string;
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
}
```

---

### 7.3 ShareableLink (platform/ShareableLink)

| Method                           | Route | Request DTO | Response Object         |
| -------------------------------- | ----- | ----------- | ----------------------- |
| Used internally by other modules | -     | -           | ShareableLink (created) |

**Note:** ShareableLink is managed through workspace/project/team/hackathon endpoints and doesn't have dedicated routes.

---

### 7.4 API Key (platform/apikey)

**Note:** API Key module exists but doesn't have dedicated router/controller endpoints in the current implementation.

---

## 8. WEBHOOK Module

### 8.1 Webhook (webhook/)

| Method | Route               | Request DTO            | Response Object |
| ------ | ------------------- | ---------------------- | --------------- |
| POST   | `/webhook/paystack` | Paystack event payload | Success (200)   |

**Request Payload:**

```typescript
// Paystack webhook payload (verified by signature)
{
  event: string;  // e.g., "charge.success", "charge.failed"
  data: {
    reference: string;
    status: string;
    amount: number;
    customer: {...};
    // ... other Paystack fields
  }
}
```

---

## Summary Statistics

- **Total Modules:** 8 (Authentication, Core, Hackathons, Payments, Projects, Users, Platform, Webhook)
- **Total Sub-modules:** 19 (multiple entities within parent modules)
- **Total API Endpoints:** ~130+ (including CRUD and custom actions)
- **Total DTOs:** ~80+ (request and response objects)

---

## Key Response Patterns

All API responses follow a consistent structure:

```typescript
Standard Success Response {
  error: false;
  errors: [];
  data: T;  // Actual response data
  message: string;
  status: number;  // HTTP status code
}

Standard Error Response {
  error: true;
  errors: string[];  // Error details
  message: string;
  status: number;  // HTTP status code
}

Paginated Response {
  error: false;
  errors: [];
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    count: number;
  };
  status: number;
}
```

---

## Authentication

All endpoints except public ones require:

- Bearer token in Authorization header: `Authorization: Bearer <token>`
- Obtained via `/auth/login` or `/auth/register` endpoints

Protected routes use the `Protect` middleware to verify authentication.

---

## Notes

- All timestamps are in ISO 8601 format
- All IDs use MongoDB ObjectId format
- File uploads use multipart/form-data
- Pagination defaults: page=1, limit=25
- Caching is implemented for frequently accessed resources (5-minute TTL for individual items, 3-minute for lists)
- DTOs are used for request validation and response serialization
