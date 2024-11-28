import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box, Chip, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../profile/ResumeUpload';

const JobSeekerDashboard = ({ profile, jobs, tabValue, handleUnsaveJob, handleResumeUpload, handleRemoveSkill, setOpenSkillDialog }) => {
    const navigate = useNavigate();

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper>
                        {tabValue === 1 && (
                            <Grid container spacing={3}>
                                {jobs.map((job) => (
                                    <Grid item xs={12} key={job._id}>
                                        <Card>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        sx={{ mr: 1 }}
                                                        onClick={() => navigate(`/jobs/${job._id}`)}
                                                    >
                                                        Apply Now
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => handleUnsaveJob(job._id)}
                                                    >
                                                        Unsave
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {tabValue === 2 && (
                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={3}>
                                    {/* Profile Information */}
                                    <Grid item xs={12} md={6}>
                                        <Paper sx={{ p: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Personal Information
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography>
                                                        <strong>Name:</strong> {profile?.firstName} {profile?.lastName}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography>
                                                        <strong>Email:</strong> {profile?.email}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography>
                                                        <strong>Location:</strong> {profile?.profile?.location || 'Not specified'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Button
                                                variant="contained"
                                                sx={{ mt: 2 }}
                                                onClick={() => navigate('/profile/edit')}
                                            >
                                                Edit Profile
                                            </Button>
                                        </Paper>
                                    </Grid>

                                    {/* Resume Section */}
                                    <Grid item xs={12} md={6}>
                                        <ResumeUpload
                                            onUploadSuccess={(url) => {
                                                setProfile({
                                                    ...profile,
                                                    profile: {
                                                        ...profile.profile,
                                                        resume: url
                                                    }
                                                });
                                            }}
                                            currentResume={profile?.profile?.resume}
                                        />
                                    </Grid>

                                    {/* Skills Section */}
                                    <Grid item xs={12}>
                                        <Paper sx={{ p: 3 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {profile?.profile?.skills?.map((skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill}
                                                        onDelete={() => handleRemoveSkill(skill)}
                                                    />
                                                ))}
                                            </Box>
                                            <Button
                                                variant="outlined"
                                                sx={{ mt: 2 }}
                                                onClick={() => setOpenSkillDialog(true)}
                                            >
                                                Add Skill
                                            </Button>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default JobSeekerDashboard;