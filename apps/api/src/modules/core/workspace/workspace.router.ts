import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import uploadHandler from '../../../middlewares/upload.mdw';
import {
    createWorkspace,
    getWorkspace,
    getWorkspaces,
    updateWorkspace,
    updateDomainAccess,
    deleteWorkspace,
    addMember,
    removeMember,
    inviteMember,
    bulkInviteMembers,
    generateShareableLink,
    joinWorkspaceByLink,
    inviteMentor,
    inviteJudge,
    resendMentorInvite,
    resendJudgeInvite,
    addMentor,
    removeMentor,
    getMentors,
    addJudge,
    removeJudge,
    getJudges,
} from './workspace.controller';

const workspaceRoutes: Router = Router({ mergeParams: true });

// Workspace routes
workspaceRoutes.post('/', Protect, uploadHandler, createWorkspace);
workspaceRoutes.get('/list', Protect, getWorkspaces);
workspaceRoutes.get('/:id', Protect, getWorkspace);
workspaceRoutes.put('/:id', Protect, updateWorkspace);
workspaceRoutes.put('/:id/domain-access', Protect, updateDomainAccess);
workspaceRoutes.delete('/:id', Protect, deleteWorkspace);

// Workspace members routes
workspaceRoutes.post('/:id/members', Protect, addMember);
workspaceRoutes.delete('/:id/members/:userId', Protect, removeMember);

// Workspace member invitation routes
workspaceRoutes.post('/:id/invite', Protect, inviteMember);
workspaceRoutes.post('/:id/invite/bulk', Protect, bulkInviteMembers);
workspaceRoutes.post(
    '/:id/invite/shareable-link',
    Protect,
    generateShareableLink,
);

// Workspace join by shareable link (public route, but requires authentication)
workspaceRoutes.post('/invite/join', Protect, joinWorkspaceByLink);

// Workspace mentor/judge invitation routes
workspaceRoutes.post('/:id/invite/mentor', Protect, inviteMentor);
workspaceRoutes.post('/:id/invite/judge', Protect, inviteJudge);
workspaceRoutes.post('/:id/invite/mentor/resend', Protect, resendMentorInvite);
workspaceRoutes.post('/:id/invite/judge/resend', Protect, resendJudgeInvite);

// Workspace mentors routes
workspaceRoutes.post('/:id/mentors', Protect, addMentor);
workspaceRoutes.get('/:id/mentors', Protect, getMentors);
workspaceRoutes.delete('/:id/mentors/:mentorId', Protect, removeMentor);

// Workspace judges routes
workspaceRoutes.post('/:id/judges', Protect, addJudge);
workspaceRoutes.get('/:id/judges', Protect, getJudges);
workspaceRoutes.delete('/:id/judges/:judgeId', Protect, removeJudge);

export default workspaceRoutes;
