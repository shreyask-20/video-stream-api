const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const videoRoutes = require('./routes/videoRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded videos
app.use('/api/videos/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/videos', videoRoutes);

// Export app for Vercel
module.exports = app;
