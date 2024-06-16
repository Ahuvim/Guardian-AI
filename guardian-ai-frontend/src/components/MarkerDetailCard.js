import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';
import CardMedia from '@mui/material/CardMedia';
import { formatDistance, parseISO } from 'date-fns';

const MarkerDetailCard = ({ marker, onClose }) => {
    if (!marker) return null;

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const formatPublishedDate = (dateString) => {
        const date = parseISO(dateString);
        return formatDistance(date, new Date(), { addSuffix: true });
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                left: '0', // Position on the left edge
                top: '190px', // Align with the top, adjusted by 50px
                height: 'calc(100% - 50px)', // Adjust the height accordingly
                padding: '20px',
            }}
        >
            <Card variant="elevation" elevation={4} sx={{ maxWidth: 400 }}>
                {/* Image display */}
                <CardMedia
                    component="img"
                    height="140" // Adjust the height as needed
                    image="/icons/image-gaza.jpeg" // Ensure your marker object has an image property
                    alt="Marker Image" // Provide a meaningful alt text
                />

                {/* Close button with 'X' icon */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 18, top: 25 }}
                    size="medium"
                >
                    <CloseIcon />
                </IconButton>

                <CardContent sx={{ maxHeight: '500px', overflow: 'auto' }}>
                    {/* Section One - Make it bold */}
                    <Typography variant="subtitle1" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {marker.context}
                    </Typography>
                    <Typography sx={{ fontWeight: 'bold' }} color="text.secondary">
                        Published at: {formatPublishedDate(marker.source.published_at)}
                    </Typography>
                    <Button
                        component="a"
                        href={marker.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        startIcon={<LinkIcon />} // Use your icon here
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'none',
                            justifyContent: 'start',
                            mb: 2, // Added margin-bottom for spacing
                        }}
                    >
                        {capitalize('Source')}
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    {/* Section Two */}
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Category: {marker.category}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary">
                        Location: {marker.locations.name}
                    </Typography>
                    <Typography variant="body2">
                        {marker.analysis}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MarkerDetailCard;
