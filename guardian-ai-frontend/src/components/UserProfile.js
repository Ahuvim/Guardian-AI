import React, { useState } from 'react';
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path as necessary

const UserProfile = ({ userEmail }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { logout } = useAuth(); // Use the logout method from the context

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('chatMessages');
        logout(); // Call the logout method from the context
        handleClose();
    };

    return (
        <div>
            <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleClick}
                color="inherit" // Changed from "blue" to "inherit" to match MUI color scheme
            >
                {/* Assume you have a user image. Replace "/path/to/user/image.jpg" with the actual path. */}
                {/* If you don't have a user image, you can use the Avatar component with the user's initials or an icon. */}
                <Avatar src="/path/to/user/image.jpg" alt={userEmail} />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Hello, {localStorage.getItem('user_email')}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
};

export default UserProfile;