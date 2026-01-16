import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    createSubmission,
    getSubmission,
    getSubmissions,
    updateSubmission,
    deleteSubmission,
} from './submission.controller';

const submissionRoutes: Router = Router({ mergeParams: true });

// Submission routes
submissionRoutes.post('/', Protect, createSubmission);
submissionRoutes.get('/list', Protect, getSubmissions);
submissionRoutes.get('/:id', Protect, getSubmission);
submissionRoutes.put('/:id', Protect, updateSubmission);
submissionRoutes.delete('/:id', Protect, deleteSubmission);

export default submissionRoutes;
