import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Skeleton,
    Alert
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Business as BusinessIcon,
    AttachMoney as SalaryIcon,
    Work as WorkIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import JobApplication from './JobApplication';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplication, setShowApplication] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
            if (!response.ok) {
                throw new Error('Job not found');
            }
            const data = await response.json();
            setJob(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!user) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }
        setShowApplication(true);
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Skeleton variant="rectangular" height={200} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>
                            {job.title}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Chip
                                icon={<BusinessIcon />}
                                label={job.company}
                                variant="outlined"
                            />
                            <Chip
                                icon={<LocationIcon />}
                                label={job.location}
                                variant="outlined"
                            />
                            <Chip
                                icon={<WorkIcon />}
                                label={job.employmentType}
                                variant="outlined"
                            />
                        </Box>

                        {job.salary && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <SalaryIcon />
                                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>
                            Job Description
                        </Typography>
                        <Typography paragraph>
                            {job.description}
                        </Typography>

                        {job.requirements && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                    Requirements
                                </Typography>
                                <ul>
                                    {job.requirements.map((req, index) => (
                                        <li key={index}>
                                            <Typography paragraph>{req}</Typography>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={handleApply}
                                disabled={user?.role === 'employer'}
                            >
                                Apply Now
                            </Button>

                            {user?.role === 'employer' && (
                                <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: 'center' }}>
                                    Employers cannot apply for jobs
                                </Typography>
                            )}

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Job Posted: {new Date(job.createdAt).toLocaleDateString()}// ... (previous code remains the same until the Job Posted date)

                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="subtitle2" gutterBottom>
                                    Employment Type
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    {job.employmentType}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                    Location
                                </Typography>
                                <Typography variant="body2">
                                    {job.location}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            {/* Job Application Dialog */}
            <JobApplication
                open={showApplication}
                onClose={(success) => {
                    setShowApplication(false);
                    if (success) {
                        navigate('/jobseeker/dashboard');
                    }
                }}
                jobId={id}
                jobTitle={job?.title}
            />
        </Container>
    );
};

export default JobDetails;