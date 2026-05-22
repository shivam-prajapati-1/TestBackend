const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:taskId')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
