const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const tasks = await Task.find({ project: projectId, user: req.user.id });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    req.body.project = projectId;
    req.body.user = req.user.id;

    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { status, title } = req.body;
    const updateData = {};
    if (status) {
      if (!['Todo', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }
      updateData.status = status;
    }
    if (title) updateData.title = title;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, project: req.params.projectId, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId, user: req.user.id });
    if (!task) return res.status(404).json({ success: false, error: 'Task not found' });
    
    await task.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
