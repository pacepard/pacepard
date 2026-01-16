import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    createEntry,
    getEntry,
    getEntries,
    updateEntry,
    deleteEntry,
    addMember,
    removeMember,
    inviteMember,
} from './entry.controller';

const entryRoutes: Router = Router({ mergeParams: true });

// Entry routes
entryRoutes.post('/', Protect, createEntry);
entryRoutes.get('/list', Protect, getEntries);
entryRoutes.get('/:id', Protect, getEntry);
entryRoutes.put('/:id', Protect, updateEntry);
entryRoutes.delete('/:id', Protect, deleteEntry);

// Entry members routes
entryRoutes.post('/:id/members', Protect, addMember);
entryRoutes.delete('/:id/members/:userId', Protect, removeMember);
entryRoutes.post('/:id/invite', Protect, inviteMember);

export default entryRoutes;
