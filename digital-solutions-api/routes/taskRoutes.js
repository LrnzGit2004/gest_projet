const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getTasksByProject,
  createTask,
  updateTaskStatus,
  assignTask
} = require('../controllers/taskController');

// Appliquer le middleware d'authentification à toutes les routes
router.use(authMiddleware);

// Routes pour /api/tasks
router.route('/')
  .post(createTask);

router.route('/project/:projectId')
  .get(getTasksByProject);

router.route('/:id/status')
  .put(updateTaskStatus);

router.route('/:id/assign')
  .put(assignTask);

module.exports = router;
