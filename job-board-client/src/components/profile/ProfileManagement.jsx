import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Grid,
    TextField,
    Button,
    Typography,
    Box,
    Chip,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import ResumeUpload from './ResumeUpload';
import { useAuth } from '../../context/AuthContext';

const ProfileManagement = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        company: '', // Only for employers
        jobTitle: '',
        experience: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [openSkillDialog, setOpenSkillDialog] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [openExperienceDialog, setOpenExperienceDialog] = useState(false);
    const [newExperience, setNewExperience] = useState({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setProfile(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to load profile');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                setSuccess('Profile updated successfully');
            } else {
                setError('Failed to update profile');
            }
        } catch (error) {
            setError('Error updating profile');
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setProfile({
                ...profile,
                skills: [...(profile.skills || []), newSkill.trim()]
            });
            setNewSkill('');
            setOpenSkillDialog(false);
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfile({
            ...profile,
            skills: profile.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const handleAddExperience = () => {
        setProfile({
            ...profile,
            experience: [...(profile.experience || []), newExperience]
        });
        setNewExperience({
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        });
        setOpenExperienceDialog(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Profile Management
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Personal Information */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={profile.firstName}
                                        onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={profile.lastName}
                                        onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={profile.email}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        value={profile.location}
                                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Bio"
                                        multiline
                                        rows={4}
                                        value={profile.bio}
                                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Resume Section */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 3 }} />
                            <ResumeUpload 
                                onUploadSuccess={(url) => setProfile({...profile, resume: url})}
                                currentResume={profile.resume}
                            />
                        </Grid>

                        {/* Skills Section */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6">
                                    Skills
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setOpenSkillDialog(true)}
                                >
                                    Add Skill
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {profile.skills?.map((skill, index) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        onDelete={() => handleRemoveSkill(skill)}
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Experience Section */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6">
                                    Experience
                                </Typography>
                                <Button 
                                    variant="outlined"
                                    onClick={() => setOpenExperienceDialog(true)}
                                >
                                    Add Experience
                                </Button>
                            </Box>
                            {profile.experience?.map((exp, index) => (
                                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                                    <Typography variant="h6">{exp.title}</Typography>
                                    <Typography color="textSecondary">
                                        {exp.company} - {exp.location}
                                    </Typography>
                                    <Typography variant="body2">
                                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {exp.description}
                                    </Typography>
                                </Paper>
                            ))}
                        </Grid>

                        <Grid item xs={12}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                sx={{ mt: 3 }}
                            >
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Add Skill Dialog */}
            <Dialog open={openSkillDialog} onClose={() => setOpenSkillDialog(false)}>
                <DialogTitle>Add Skill</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Skill"
                        fullWidth
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSkillDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddSkill} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>

            {/* Add Experience Dialog */}
            <Dialog 
                open={openExperienceDialog} 
                onClose={() => setOpenExperienceDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Add Experience</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={newExperience.title}
                                onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={newExperience.location}
                                onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={newExperience.startDate}
                                onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={newExperience.endDate}
                                onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                                disabled={newExperience.current}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                value={newExperience.description}
                                onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExperienceDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddExperience} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfileManagement;