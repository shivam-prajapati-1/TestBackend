const express = require('express');
const { getProjects, createProject, getProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const taskRouter = require('./taskRoutes');

const router = express.Router();

// Re-route into task router
router.use('/:projectId/tasks', taskRouter);

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
