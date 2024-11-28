const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employer', 'jobseeker'],
        required: true
    },
    company: {
        type: String,
        required: function() {
            return this.role === 'employer';
        }
    },
    profile: {
        phone: String,
        location: String,
        bio: String,
        resume: String, // URL to stored resume
        skills: [String],
        experience: [{
            title: String,
            company: String,
            location: String,
            from: Date,
            to: Date,
            current: Boolean,
            description: String
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;