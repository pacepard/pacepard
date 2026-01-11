import { Router } from 'express';
import Protect from '../../middlewares/checkAuth.mdw';
import {
    createTask,
    getTask,
    getProjectTasks,
    getTeamTasks,
    getAssigneeTasks,
    updateTask,
    deleteTask,
    assignTask,
} from './task.controller';

const taskRoutes = Router({ mergeParams: true });

// Task CRUD routes
taskRoutes.get('/:id', Protect, getTask);
taskRoutes.put('/:id', Protect, updateTask);
taskRoutes.delete('/:id', Protect, deleteTask);

// Task assignment
taskRoutes.post('/:id/assign', Protect, assignTask);

// Task queries
taskRoutes.get('/projects/:projectId/tasks', Protect, getProjectTasks);
taskRoutes.get('/teams/:teamId/tasks', Protect, getTeamTasks);
taskRoutes.get('/users/:userId/tasks', Protect, getAssigneeTasks);

// Create task (requires project and team context)
taskRoutes.post(
    '/projects/:projectId/teams/:teamId/tasks',
    Protect,
    createTask,
);

export default taskRoutes;
