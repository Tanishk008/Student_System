const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const { protect } = require('../middleware/authMiddleware');

// @route POST /api/grievances
router.post('/', protect, async (req, res) => {
    const { title, description, category } = req.body;
    try {
        const grievance = await Grievance.create({
            student: req.user,
            title,
            description,
            category
        });
        res.status(201).json(grievance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/grievances
router.get('/', protect, async (req, res) => {
    try {
        const grievances = await Grievance.find({ student: req.user }).sort({ date: -1 });
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/grievances/search
router.get('/search', protect, async (req, res) => {
    const { title } = req.query;
    try {
        const grievances = await Grievance.find({
            student: req.user,
            title: { $regex: title, $options: 'i' }
        });
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/grievances/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const grievance = await Grievance.findOne({ _id: req.params.id, student: req.user });
        if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
        res.json(grievance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/grievances/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const grievance = await Grievance.findOne({ _id: req.params.id, student: req.user });
        if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

        grievance.title = req.body.title || grievance.title;
        grievance.description = req.body.description || grievance.description;
        grievance.category = req.body.category || grievance.category;
        grievance.status = req.body.status || grievance.status;

        const updatedGrievance = await grievance.save();
        res.json(updatedGrievance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/grievances/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const grievance = await Grievance.findOneAndDelete({ _id: req.params.id, student: req.user });
        if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
        res.json({ message: 'Grievance removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
