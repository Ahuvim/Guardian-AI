//components/NewsFeed.js
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import {
    Card,
    Link,
    Tooltip,
    CardContent,
    Typography,
    Button,
    Box,
    CircularProgress,
    Divider,
    TextField
} from '@mui/material';

const categories = [
    "Access", "Aid", "Diplomatic", "Facilities", "Financial", "Food", "Fuel",
    "Humanitarian", "International Relations", "Medical Supplies", "Military",
    "Population", "Security", "Trucks", "Water", "Health"
];

const sources = ["twitter", "t", "youtube", "Web", "tiktok"];

const NewsFeed = ({ newsItems, fetchLocationCoords, renderPolygons, fetchNextPage, hasMore, loading, selectedNewsItem, setSelectedNewsItem, totalNewsCount }) => {
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [selected, setSelected] = useState(null);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!loading && newsItems.length === 0) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }, [newsItems, loading]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loadingMore) {
                    setLoadingMore(true); // Start loading more items
                    fetchNextPage().then(() => setLoadingMore(false)); // Stop loading more items after fetching
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMore, loadingMore, fetchNextPage]);

    const handleCardClick = (item, index) => {
        if (selectedNewsItem && item._id === selectedNewsItem._id) { // Deselect if the same item is clicked
            setSelectedNewsItem(null);
            setSelected(null);
        } else {
            setSelectedNewsItem(item);
            setSelected(index);
            fetchLocationCoords(item.locations?.location_id);
        }
    };

    const capitalize = (str) => {
        if (str.length === 0) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const renderIconSource = (source) => {
        const normalizedSource = source ? source.toLowerCase() : '';
        const iconName = normalizedSource && sources.includes(normalizedSource) ? `icon-${source}.png` : 'icon-Web.png';

        return (
            <img
                src={`${process.env.PUBLIC_URL}/icons/${iconName}`}
                alt={source || 'Other'}
                className="source-icon"
                style={{ marginRight: -6 }}
            />
        );
    };

    const renderIconCategory = (category) => {
        const normalizedSubCategory = category ? category.toLowerCase() : '';
        const categoriesNormalized = categories.map(cat => cat.toLowerCase());
        const iconName = normalizedSubCategory && categoriesNormalized.includes(normalizedSubCategory) ? `icon-${category}.png` : 'icon-other.png';

        return (
            <img
                src={`${process.env.PUBLIC_URL}/icons/${iconName}`}
                alt={category || 'Other'}
                className="category-icon"
                style={{ marginRight: 0 }}
            />
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 3);
        return format(date, "dd/MM/yyyy HH:mm:ss");
    };

    return (
        <Box sx={{ p: 0 }}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <CircularProgress />
                </Box>
            ) : isEmpty ? (
                <Typography variant="body1" align="center">
                    No data for this filters.
                </Typography>
            ) : (
                <>
                    {newsItems.map((item, index) => (
                        <Tooltip
                            title={<Typography sx={{ fontSize: '1rem', maxHeight: '400px', overflowY: 'auto' }}>{item.analysis || 'No Data'}</Typography>}
                            key={index}
                            placement="left"
                            arrow
                        >
                            <Card
                                sx={{
                                    mb: 0,
                                    cursor: 'pointer',
                                    backgroundColor: selected === index ? 'action.selected' : 'background.paper',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                                onClick={() => handleCardClick(item, index)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ flex: 'none', display: 'flex', alignItems: 'center' }}>
                                            {renderIconCategory(item.category)}
                                        </Box>
                                        <Box sx={{ flex: '1 1 auto', textAlign: 'center' }}>
                                            <Typography variant="subtitle2" color="text.secondary" component="span">
                                                {item.source && item.source.published_at
                                                    ? formatDate(item.source.published_at)
                                                    : 'Unknown Time'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 'none', textAlign: 'right' }}>
                                            {item.source?.url && (
                                                <Button
                                                    target="_blank"
                                                    component="a"
                                                    href={item.source.url}
                                                    sx={{
                                                        color: 'black',
                                                        fontSize: '0.8rem',
                                                        textTransform: 'none',
                                                        borderBottom: '1px solid transparent',
                                                        '&:hover': {
                                                            borderBottom: '1px solid',
                                                            backgroundColor: 'transparent',
                                                        },
                                                        padding: 0,
                                                        minWidth: 'auto'
                                                    }}
                                                    startIcon={renderIconSource(item.source.name)}
                                                >
                                                    {capitalize(item.source.name)}
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.primary" component="p" sx={{ mt: 1 }}>
                                        {item.context}
                                    </Typography>
                                    {item.locations?.name && (
                                        <Typography variant="body2" color="text.secondary" component="p" sx={{ mt: 1 }}>
                                            <strong>Location:</strong> {item.locations?.name}
                                        </Typography>
                                    )}
                                </CardContent>
                                <Divider />
                            </Card>
                        </Tooltip>
                    ))}
                    <div ref={observerRef} style={{ height: '1px' }} />
                    {loadingMore && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!loadingMore && !hasMore && (
                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            No more items
                        </Typography>
                    )}
                </>
            )}
            {renderPolygons && renderPolygons()}
        </Box>
    );
};

export default NewsFeed;
