import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert,
    CircularProgress,
    Typography,
    Grid
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { UploadService } from '../services/upload.service';

const JobApplication = ({ open, onClose, jobId, jobTitle }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        coverLetter: '',
        resume: null,
        phoneNumber: user?.profile?.phone || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Upload resume if provided
            let resumeUrl = user?.profile?.resume;
            if (formData.resume) {
                const uploadResult = await UploadService.uploadResume(formData.resume);
                resumeUrl = uploadResult.resumeUrl;
            }

            // Submit application
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    coverLetter: formData.coverLetter,
                    resumeUrl: resumeUrl,
                    phoneNumber: formData.phoneNumber
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }

            // Close dialog and show success message
            onClose(true);
        } catch (error) {
            setError(error.message || 'Error submitting application');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({ ...formData, resume: file });
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>
                Apply for {jobTitle}
            </DialogTitle>
            
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    phoneNumber: e.target.value
                                })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Cover Letter"
                                multiline
                                rows={4}
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    coverLetter: e.target.value
                                })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Resume
                                </Typography>
                                {user?.profile?.resume ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Current Resume: {user.profile.resume.split('/').pop()}
                                        </Typography>
                                        <Typography variant="body2">
                                            Upload new resume or use current one
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="error">
                                        Please upload your resume
                                    </Typography>
                                )}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                >
                                    Upload Resume
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {formData.resume && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected file: {formData.resume.name}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || (!formData.resume && !user?.profile?.resume)}
                    >
                        {loading ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Submit Application'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default JobApplication;