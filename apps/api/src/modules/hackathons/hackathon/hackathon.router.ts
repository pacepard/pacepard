import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    createHackathon,
    getHackathon,
    getHackathons,
    updateHackathon,
    deleteHackathon,
    addMember,
    removeMember,
    inviteMember,
    inviteMentor,
    inviteJudge,
    resendMentorInvite,
    resendJudgeInvite,
    generateHackathonShareableLink,
} from './hackathon.controller';

const hackathonRoutes: Router = Router({ mergeParams: true });

// Hackathon routes
hackathonRoutes.post('/', Protect, createHackathon);
hackathonRoutes.get('/list', Protect, getHackathons);
hackathonRoutes.get('/:id', Protect, getHackathon);
hackathonRoutes.put('/:id', Protect, updateHackathon);
hackathonRoutes.delete('/:id', Protect, deleteHackathon);

// Hackathon members routes
hackathonRoutes.post('/:id/members', Protect, addMember);
hackathonRoutes.delete('/:id/members/:userId', Protect, removeMember);
hackathonRoutes.post('/:id/invite', Protect, inviteMember);
hackathonRoutes.post('/:id/invite/shareable-link', Protect, generateHackathonShareableLink);

// Hackathon mentor/judge invitation routes
hackathonRoutes.post('/:id/invite/mentor', Protect, inviteMentor);
hackathonRoutes.post('/:id/invite/judge', Protect, inviteJudge);
hackathonRoutes.post('/:id/invite/mentor/resend', Protect, resendMentorInvite);
hackathonRoutes.post('/:id/invite/judge/resend', Protect, resendJudgeInvite);

export default hackathonRoutes;
