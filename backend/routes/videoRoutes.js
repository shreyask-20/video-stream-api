const express = require('express');
const multer = require('multer');
const Video = require('../models/Video');
const path = require('path');

const router = express.Router();
const upload = multer({ 
    dest: 'backend/uploads/', 
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit to 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only MP4, WebM, and OGG video formats are allowed!'));
        }
        cb(null, true);
    }
});

// Upload video
router.post('/upload', upload.single('video'), async (req, res) => {
    try {
        if (!req.file || !req.body.title) {
            return res.status(400).json({ error: 'Title and video file are required.' });
        }
        const newVideo = new Video({ title: req.body.title, videoUrl: req.file.filename });
        await newVideo.save();
        res.status(201).json({ message: "Video uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch all videos
router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Edit video title
router.put('/edit/:id', async (req, res) => {
    try {
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
        res.json(updatedVideo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete video
router.delete('/delete/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve uploaded videos
router.get('/uploads/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, '../uploads', req.params.filename));
});

module.exports = router;
