import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    MenuItem,
    Grid,
    Snackbar,
    Alert
} from '@mui/material';
import axios from 'axios';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        employmentType: 'Full-time',
        salary: {
            min: '',
            max: '',
            currency: 'USD'
        }
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

    const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('salary.')) {
            const salaryField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                salary: {
                    ...prev.salary,
                    [salaryField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/jobs', formData);
            setAlert({
                open: true,
                message: 'Job posted successfully!',
                severity: 'success'
            });
            // Reset form
            setFormData({
                title: '',
                company: '',
                location: '',
                description: '',
                employmentType: 'Full-time',
                salary: { min: '', max: '', currency: 'USD' }
            });
        } catch (error) {
            setAlert({
                open: true,
                message: 'Failed to post job. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Post a New Job
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Job Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                select
                                label="Employment Type"
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                            >
                                {employmentTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimum Salary"
                                name="salary.min"
                                value={formData.salary.min}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Maximum Salary"
                                name="salary.max"
                                value={formData.salary.max}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Job Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post Job'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert({ ...alert, open: false })}
            >
                <Alert severity={alert.severity}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PostJob;