import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Grid, CircularProgress,
    Card, CardContent, Button, Chip, TextField, MenuItem,
    Select, FormControl, InputLabel
} from '@mui/material';
import { LocationOn, Work, AttachMoney } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState({ external: [], local: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        jobType: 'All Types',
        location: '',
        salaryRange: 'All Ranges'
    });

    const fetchJobs = async (searchQuery = '') => {
        try {
            setLoading(true);
            // Encode the search query properly
            const encodedQuery = encodeURIComponent(searchQuery);
            const response = await axios.get(`http://localhost:5000/api/jobs?query=${encodedQuery}`);
            
            // Transform the external jobs data to ensure we have the correct link properties
            const transformedData = {
                external: response.data.external.map(job => ({
                    ...job,
                    via: job.via || job.link || job.apply_link || `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company_name} job application`)}`
                })),
                local: response.data.local
            };
            
            console.log('Transformed jobs data:', transformedData); // Debug log
            setJobs(transformedData);
            setError(null);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (searchTerm) => {
        fetchJobs(searchTerm);
    };

    const applyFilters = () => {
        // Implement filter logic here
        fetchJobs(document.querySelector('input[type="search"]')?.value || '');
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Hero Section */}
            <Box sx={{
                textAlign: 'center',
                py: 8,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 2,
                color: 'white',
                mb: 4
            }}>
                <Typography variant="h2" gutterBottom>
                    Find Your Dream Job
                </Typography>
                <Typography variant="h6" sx={{ mb: 4 }}>
                    Browse through thousands of job opportunities
                </Typography>
                <Box sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    px: 2
                }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search jobs..."
                        sx={{
                            bgcolor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e.target.value);
                            }
                        }}
                    />
                </Box>
            </Box>

            {/* Filters */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                        value={filters.jobType}
                        onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                        label="Job Type"
                    >
                        <MenuItem value="All Types">All Types</MenuItem>
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Salary Range</InputLabel>
                    <Select
                        value={filters.salaryRange}
                        onChange={(e) => setFilters({ ...filters, salaryRange: e.target.value })}
                        label="Salary Range"
                    >
                        <MenuItem value="All Ranges">All Ranges</MenuItem>
                        <MenuItem value="0-50k">$0 - $50k</MenuItem>
                        <MenuItem value="50k-100k">$50k - $100k</MenuItem>
                        <MenuItem value="100k+">$100k+</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={applyFilters}
                    sx={{ minWidth: 120 }}
                >
                    Apply Filters
                </Button>
            </Box>

            {/* Job Listings */}
            <Grid container spacing={3}>
                {jobs.local.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Local Job Listings</Typography>
                    </Grid>
                )}
                {jobs.local.map((job) => (
                    <Grid item xs={12} md={6} lg={4} key={job._id}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {job.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {job.company}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        icon={<LocationOn />}
                                        label={job.location}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        icon={<Work />}
                                        label={job.employmentType}
                                        size="small"
                                    />
                                </Box>
                                {job.salary && (
                                    <Typography variant="body2" sx={{ mb: 2 }}>
                                        <AttachMoney sx={{ fontSize: 'small', verticalAlign: 'middle' }} />
                                        {`${job.salary.min} - ${job.salary.max} ${job.salary.currency}`}
                                    </Typography>
                                )}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate(`/jobs/${job._id}`)}
                                >
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {jobs.external.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>External Job Listings</Typography>
                    </Grid>
                )}

                {jobs.external.map((job, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {job.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {job.company_name}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Chip
                                        icon={<LocationOn />}
                                        label={job.location}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label="External"
                                        color="secondary"
                                        size="small"
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    component="a"
                                    href={job.via}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1976D2 30%, #1CA8F3 90%)'
                                        },
                                        textDecoration: 'none'
                                    }}
                                    onClick={(e) => {
                                        if (job.via) {
                                            window.open(job.via, '_blank');
                                        }
                                        e.preventDefault();
                                    }}
                                >
                                    Apply External
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                {jobs.local.length === 0 && jobs.external.length === 0 && !loading && (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="textSecondary">
                            No jobs found. Try adjusting your search criteria.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default JobList;