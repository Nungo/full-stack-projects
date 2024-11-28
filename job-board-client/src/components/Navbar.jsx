import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    ListItemIcon
} from '@mui/material';
import {
    Person as PersonIcon,
    Dashboard as DashboardIcon,
    Work as WorkIcon,
    ExitToApp as LogoutIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/');
    };

    const handleDashboardClick = () => {
        handleMenuClose();
        navigate(user?.role === 'employer' ? '/employer/dashboard' : '/jobseeker/dashboard');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        flexGrow: 1,
                        fontWeight: 'bold'
                    }}
                >
                    Job Board
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/"
                        startIcon={<WorkIcon />}
                    >
                        Find Jobs
                    </Button>

                    {user ? (
                        <>
                            {user.role === 'employer' && (
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/post-job"
                                    startIcon={<AddIcon />}
                                >
                                    Post Job
                                </Button>
                            )}
                            
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{ ml: 2 }}
                                aria-controls="user-menu"
                                aria-haspopup="true"
                            >
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                                </Avatar>
                            </IconButton>

                            <Menu
                                id="user-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={handleDashboardClick}>
                                    <ListItemIcon>
                                        <DashboardIcon fontSize="small" />
                                    </ListItemIcon>
                                    Dashboard
                                </MenuItem>
                                
                                <MenuItem 
                                    component={RouterLink} 
                                    to="/profile"
                                    onClick={handleMenuClose}
                                >
                                    <ListItemIcon>
                                        <PersonIcon fontSize="small" />
                                    </ListItemIcon>
                                    Profile
                                </MenuItem>

                                <Divider />
                                
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                                sx={{ mr: 1 }}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                component={RouterLink}
                                to="/register"
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;