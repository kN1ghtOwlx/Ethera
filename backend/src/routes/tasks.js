import express from 'express';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;

    if (!title || !description || !dueDate || !project) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let assignedUser = null;

    if (assignedTo) {
      assignedUser = await User.findOne({ name: assignedTo });

      if (!assignedUser) {
        return res.status(404).json({ error: 'Assigned user not found' });
      }
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo: assignedUser?._id,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const query =
      req.user.role === 'admin'
        ? {}
        : { $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] };

    const tasks = await Task.find(query);
    const now = new Date();

    res.json({
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(
        t => new Date(t.dueDate) < now && t.status !== 'completed'
      ).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    let assignedUser = null;

    if (assignedTo) {
      assignedUser = await User.findOne({ name: assignedTo });

      if (!assignedUser) {
        return res.status(404).json({ error: 'Assigned user not found' });
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo: assignedUser?._id
      },
      { new: true }
    )
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;