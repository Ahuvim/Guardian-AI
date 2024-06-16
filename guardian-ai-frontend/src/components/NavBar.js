import React from 'react';
import UserProfile from './UserProfile'; // Import the UserProfile component
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
//import NrtmIcon from '/icons/nrtm.png'; // Ensure you have an icon file at this path

const NavBar = ({ onTabChange, activePanel, userEmail }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Toolbar  sx={{ justifyContent: 'space-between', bgcolor: 'grey.900'}}>
                {/* Left side - UserProfile and NRTM */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <UserProfile userEmail={userEmail} />
                    <IconButton size="large" edge="start" color="inherit" aria-label="NRTM logo">

                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ color: 'greenyellow', mx: 2 }}>
                        נרת״ם NRTM
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ color: 'white' }}>
                        {currentDate}
                    </Typography>
                </Box>

                {/* Right side - Tabs */}
                <Box sx={{ display: 'flex' }}>
                    <Button color="inherit" sx={{ color: activePanel === 'news' ? 'greenyellow' : 'white' }} onClick={() => onTabChange('news')}>
                        News
                    </Button>
                    <Button color="inherit" sx={{ color: activePanel === 'insights' ? 'greenyellow' : 'white' }} onClick={() => onTabChange('insights')}>
                        Insights
                    </Button>
                    <Button color="inherit" sx={{ color: activePanel === 'chat' ? 'greenyellow' : 'white' }} onClick={() => onTabChange('chat')}>
                        Chat
                    </Button>
                </Box>
            </Toolbar>
        </Box>
    );
};

export default NavBar;