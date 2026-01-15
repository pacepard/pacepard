import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    createSquad,
    getSquad,
    getSquads,
    updateSquad,
    deleteSquad,
    addMember,
    removeMember,
    inviteMember,
} from './squad.controller';

const squadRoutes: Router = Router({ mergeParams: true });

// Squad routes
squadRoutes.post('/', Protect, createSquad);
squadRoutes.get('/list', Protect, getSquads);
squadRoutes.get('/:id', Protect, getSquad);
squadRoutes.put('/:id', Protect, updateSquad);
squadRoutes.delete('/:id', Protect, deleteSquad);

// Squad members routes
squadRoutes.post('/:id/members', Protect, addMember);
squadRoutes.delete('/:id/members/:userId', Protect, removeMember);
squadRoutes.post('/:id/invite', Protect, inviteMember);

export default squadRoutes;
