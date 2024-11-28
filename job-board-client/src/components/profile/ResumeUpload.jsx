import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    LinearProgress,
    Alert,
    Paper,
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadService } from '../../services/upload.service';

const ResumeUpload = ({ onUploadSuccess, currentResume }) => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (event) => {
        const selectedFile = event.target.files[0];
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(selectedFile?.type)) {
            setError('Please upload a PDF or Word document');
            return;
        }

        // Validate file size (max 5MB)
        if (selectedFile?.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setProgress(0);
        setError('');

        try {
            const response = await UploadService.uploadResume(file);
            onUploadSuccess(response.resumeUrl);
            setProgress(100);
        } catch (error) {
            setError(error.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                Resume Upload
            </Typography>

            {currentResume && (
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                        Current Resume: {currentResume.split('/').pop()}
                    </Typography>
                    <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => onUploadSuccess(null)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            <Box sx={{ mb: 2 }}>
                <input
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    id="resume-upload"
                    type="file"
                    onChange={handleFileSelect}
                    disabled={uploading}
                />
                <label htmlFor="resume-upload">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        disabled={uploading}
                    >
                        Select Resume
                    </Button>
                </label>
                {file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Selected file: {file.name}
                    </Typography>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {uploading && (
                <Box sx={{ mb: 2 }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}

            <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || uploading}
            >
                Upload Resume
            </Button>
        </Paper>
    );
};

export default ResumeUpload;