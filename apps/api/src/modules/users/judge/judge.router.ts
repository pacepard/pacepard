import { Router } from 'express';
import Protect from '../../../middlewares/checkAuth.mdw';
import {
    createJudge,
    getJudge,
    getJudges,
    updateJudge,
    deleteJudge,
} from './judge.controller';

const judgeRoutes: Router = Router({ mergeParams: true });

// Judge routes
judgeRoutes.post('/', Protect, createJudge);
judgeRoutes.get('/list', Protect, getJudges);
judgeRoutes.get('/:id', Protect, getJudge);
judgeRoutes.put('/:id', Protect, updateJudge);
judgeRoutes.delete('/:id', Protect, deleteJudge);

export default judgeRoutes;
