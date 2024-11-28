const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import models
const { Job } = require('./models/job.model');
const User = require('./models/user.model');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    }
});

// Auth Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No authentication token found' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
    }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        env: {
            hasSerpApiKey: !!process.env.SERP_API_KEY,
            hasMongoConnection: !!process.env.MONGODB_URI,
            hasJwtSecret: !!process.env.JWT_SECRET
        }
    });
});

// Main jobs endpoint
app.get('/api/jobs', async (req, res) => {
    const { query } = req.query;

    try {
        console.log('Starting job fetch with query:', query || 'all jobs');

        // First try to get local jobs
        let localJobs = [];
        try {
            localJobs = await Job.find({ status: 'active' })
                .populate('employerId', 'profile.company')
                .sort('-createdAt');
            console.log('Local jobs fetched:', localJobs.length);
        } catch (dbError) {
            console.error('Error fetching local jobs:', dbError);
        }

        // Then try to get SerpAPI jobs
        let externalJobs = [];
        try {
            const searchQuery = query ? encodeURIComponent(query) : 'software developer';
            const serpApiUrl = `https://serpapi.com/search.json?engine=google_jobs&q=${searchQuery}&location=United States&api_key=${process.env.SERP_API_KEY}`;
            
            console.log('Fetching from SerpAPI...');
            const serpApiResponse = await axios.get(serpApiUrl, {
                timeout: 10000
            });

            if (serpApiResponse.data && serpApiResponse.data.jobs_results) {
                externalJobs = serpApiResponse.data.jobs_results;
                console.log('External jobs fetched:', externalJobs.length);
            }
        } catch (serpError) {
            console.error('SerpAPI Error:', serpError.message);
            externalJobs = [];
        }

        // Format external jobs
        const formattedExternalJobs = externalJobs.map(job => ({
            ...job,
            via: job.via || job.link || job.apply_link,
            title: job.title,
            company_name: job.company_name || job.company,
            location: job.location,
            description: job.description || job.snippet,
            employmentType: job.detected_extensions?.schedule_type || 'Full-time'
        }));
        // Return combined results
        return res.json({
            external: formattedExternalJobs,
            local: localJobs.map(job => ({
                ...job.toObject(),
                source: 'local'
            })),
            metadata: {
                query: query,
                totalResults: formattedExternalJobs.length + localJobs.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Main error in /api/jobs:', error);
        return res.status(200).json({
            external: [],
            local: [],
            error: {
                message: 'Error fetching jobs',
                details: error.message
            }
        });
    }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, company } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            role,
            company
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

app.get('/api/auth/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Job Routes
app.post('/api/jobs', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ error: 'Only employers can post jobs' });
        }

        const newJob = new Job({
            ...req.body,
            employerId: req.user.userId,
            status: 'active'
        });
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Error creating job listing' });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employerId', 'profile.company');
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ error: 'Error fetching job details' });
    }
});

app.post('/api/jobs/:id/apply', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'jobseeker') {
            return res.status(403).json({ error: 'Only job seekers can apply for jobs' });
        }

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const application = {
            userId: req.user.userId,
            status: 'pending',
            appliedAt: new Date(),
            ...req.body
        };

        job.applications = job.applications || [];
        job.applications.push(application);
        await job.save();

        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Error submitting application' });
    }
});

// Search endpoint
app.get('/api/jobs/search', async (req, res) => {
    const { query, location, type, salaryRange } = req.query;
    try {
        const searchQuery = {};
        
        if (query) {
            searchQuery.$or = [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ];
        }
        
        if (location) {
            searchQuery.location = new RegExp(location, 'i');
        }
        
        if (type && type !== 'All Types') {
            searchQuery.employmentType = type;
        }

        const jobs = await Job.find(searchQuery)
            .populate('employerId', 'profile.company')
            .sort('-createdAt');
            
        res.json(jobs);
    } catch (error) {
        console.error('Error searching jobs:', error);
        res.status(500).json({ error: 'Error searching jobs' });
    }
});

// File upload endpoint
app.post('/api/upload/resume', authMiddleware, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        await User.findByIdAndUpdate(req.user.userId, {
            'profile.resume': fileUrl
        });

        res.json({ 
            message: 'Resume uploaded successfully',
            resumeUrl: fileUrl 
        });
    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start server with configuration logging
console.log('Starting server with configuration:', {
    port: PORT,
    mongoDbConnected: !!process.env.MONGODB_URI,
    serpApiKeyPresent: !!process.env.SERP_API_KEY,
    jwtSecretPresent: !!process.env.JWT_SECRET
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});