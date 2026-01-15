import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    createMentor,
    getMentor,
    getMentors,
    updateMentor,
    deleteMentor,
} from './mentor.controller';

const mentorRoutes: Router = Router({ mergeParams: true });

// Mentor routes
mentorRoutes.post('/', Protect, createMentor);
mentorRoutes.get('/list', Protect, getMentors);
mentorRoutes.get('/:id', Protect, getMentor);
mentorRoutes.put('/:id', Protect, updateMentor);
mentorRoutes.delete('/:id', Protect, deleteMentor);

export default mentorRoutes;
