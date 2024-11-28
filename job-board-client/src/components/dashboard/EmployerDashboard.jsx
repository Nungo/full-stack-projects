import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Grid, Paper, Tabs, Tab,
    Table, TableBody, TableCell, TableHead, TableRow,
    Button, IconButton, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthService } from '../../services/api.service';

const EmployerDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchEmployerData();
    }, []);

    const fetchEmployerData = async () => {
        try {
            const [jobsResponse, applicationsResponse] = await Promise.all([
                fetch('http://localhost:5000/api/jobs/employer', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                fetch('http://localhost:5000/api/applications/employer', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);

            const jobsData = await jobsResponse.json();
            const applicationsData = await applicationsResponse.json();

            setJobs(jobsData);
            setApplications(applicationsData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        try {
            await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleViewApplications = (job) => {
        setSelectedJob(job);
        setOpenDialog(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'success',
            closed: 'error',
            draft: 'warning'
        };
        return colors[status] || 'default';
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Employer Dashboard
                        </Typography>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                                <Tab label="Posted Jobs" />
                                <Tab label="Applications" />
                                <Tab label="Statistics" />
                            </Tabs>
                        </Box>

                        {tabValue === 0 && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Posted Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Applications</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {jobs.map((job) => (
                                        <TableRow key={job._id}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={job.status}
                                                    color={getStatusColor(job.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {job.applications?.length || 0}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton 
                                                    onClick={() => handleViewApplications(job)}
                                                    size="small"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => handleDeleteJob(job._id)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {tabValue === 1 && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Job Title</TableCell>
                                        <TableCell>Applicant</TableCell>
                                        <TableCell>Applied Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applications.map((application) => (
                                        <TableRow key={application._id}>
                                            <TableCell>{application.jobTitle}</TableCell>
                                            <TableCell>{application.applicantName}</TableCell>
                                            <TableCell>
                                                {new Date(application.appliedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={application.status}
                                                    color={getStatusColor(application.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    onClick={() => window.open(application.resumeUrl)}
                                                >
                                                    View Resume
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {tabValue === 2 && (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h6">Total Jobs Posted</Typography>
                                        <Typography variant="h3">{jobs.length}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h6">Total Applications</Typography>
                                        <Typography variant="h3">
                                            {applications.length}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h6">Active Jobs</Typography>
                                        <Typography variant="h3">
                                            {jobs.filter(job => job.status === 'active').length}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Applications Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Applications for {selectedJob?.title}
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Applicant</TableCell>
                                <TableCell>Applied Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedJob?.applications?.map((application) => (
                                <TableRow key={application._id}>
                                    <TableCell>{application.applicantName}</TableCell>
                                    <TableCell>
                                        {new Date(application.appliedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={application.status}
                                            color={getStatusColor(application.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            onClick={() => window.open(application.resumeUrl)}
                                        >
                                            View Resume
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployerDashboard;