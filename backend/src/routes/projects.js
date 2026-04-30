import express from 'express';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description required' });
    }

    let memberIds = [];

    if (members && members.length > 0) {
      const users = await User.find({ name: { $in: members } });
      memberIds = users.map(user => user._id);
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: memberIds
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? {}
      : { members: req.user._id };

    const projects = await Project.find(query)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    let memberIds = [];

    if (members && members.length > 0) {
      const users = await User.find({ name: { $in: members } });
      memberIds = users.map(user => user._id);
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        members: memberIds
      },
      { new: true }
    ).populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;