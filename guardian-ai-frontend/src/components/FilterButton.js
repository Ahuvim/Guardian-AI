import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import './FilterButton.css';

const palestine_list = [
    // your existing locations list
];

const FilterButton = ({ updateNewsFeed, coordinates, pickingMode, setPickingMode }) => {
    const [locations, setLocations] = useState([]);
    const [sources, setSources] = useState([]);
    const [types, setTypes] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState(palestine_list);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSources, setSelectedSources] = useState([]);
    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'day'));
    const [endDate, setEndDate] = useState(dayjs());
    const [selectedType, setSelectedType] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [radius, setRadius] = useState(10); // Default radius

    const areaOptions = ["Gaza", "Lebanon", "West Bank", "Israel", "Worldwide"];

    useEffect(() => {
        const fetchFilters = async () => {
            let areasData = areaOptions;

            try {
                const areasResponse = await axios.get(`${process.env.REACT_APP_API_URL}/get_all_areas`);
                if (areasResponse && areasResponse.data) {
                    areasData = areasResponse.data;
                }
            } catch (error) {
                console.error("Failed to fetch areas from API, using fallback data.", error);
            }

            const headers = {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            };
            const [locationsRes, categoriesRes, sourcesRes, typesRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/get_all_locations`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/get_all_categories`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/get_all_sources`, { headers }),
                axios.get(`${process.env.REACT_APP_API_URL}/get_all_types`, { headers }),
            ]);

            setLocations(locationsRes.data);
            setSources(sourcesRes.data);
            setTypes(typesRes.data);
        };

        fetchFilters().then(() => handleApplyFilters());
    }, []);

    useEffect(() => {
        if (coordinates) {
            setLongitude(coordinates.lng.toFixed(4));
            setLatitude(coordinates.lat.toFixed(4));
        }
    }, [coordinates]);

    const handleApplyFilters = () => {
        const filters = {
            location: selectedLocations.join(','),
            source: selectedSources.join(','),
            type: selectedType.join(','),
            search_terms: searchTerm,
            start_date: startDate ? startDate.format('YYYY-MM-DD') : undefined,
            end_date: endDate ? endDate.format('YYYY-MM-DD') : undefined,
            longitude: longitude || undefined,
            latitude: latitude || undefined,
            radius: radius || undefined // Use the radius value
        };

        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        updateNewsFeed(filters);
    };

    const handleResetFilters = () => {
        setSelectedLocations([]);
        setSelectedSources([]);
        setSelectedType([]);
        setSearchTerm("");
        setStartDate(null);
        setEndDate(null);
        setLongitude("");
        setLatitude("");
        setRadius(10); // Reset radius to default value
    };

    const handlePickingMode = () => {
        setPickingMode(prevMode => !prevMode);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ position: 'fixed', bottom: 20, left: 20, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1000, backgroundColor: 'white', padding: '5px', borderRadius: '4px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' }} className={pickingMode ? 'picking-mode' : ''}>
                {!showFilters ? (
                    <Button variant="contained" onClick={() => setShowFilters(true)}>Filter</Button>
                ) : (
                    <>
                        <TextField
                            label="Search Term"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginBottom: '10px' }}
                            size="small"
                        />
                        <Autocomplete
                            multiple
                            id="location-filter"
                            options={locations}
                            disableCloseOnSelect
                            limitTags={2}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            style={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Locations" placeholder="Locations" size="small" />}
                            value={selectedLocations}
                            onChange={(event, newValue) => {
                                setSelectedLocations(newValue);
                            }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Autocomplete
                                multiple
                                id="source-filter"
                                options={sources}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                )}
                                style={{ width: '60%' }}
                                renderInput={(params) => <TextField {...params} label="Sources" placeholder="Sources" size="small" />}
                                value={selectedSources}
                                onChange={(event, newValue) => {
                                    setSelectedSources(newValue);
                                }}
                            />
                            <Autocomplete
                                multiple
                                id="type-filter"
                                options={types}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                )}
                                style={{ width: '40%' }}
                                renderInput={(params) => <TextField {...params} label="Type" placeholder="Type" size="small" />}
                                value={selectedType}
                                onChange={(event, newValue) => {
                                    setSelectedType(newValue);
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap', width: '100%' }}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" style={{ flex: 1 }} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" style={{ flex: 1 }} />}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField
                                label="Lng"
                                variant="outlined"
                                value={longitude}
                                disabled
                                size="small"
                                style={{ width: '30%' }}
                            />
                            <TextField
                                label="Lat"
                                variant="outlined"
                                value={latitude}
                                disabled
                                size="small"
                                style={{ width: '30%' }}
                            />
                            <TextField
                                label="R"
                                variant="outlined"
                                type="number"
                                value={radius}
                                onChange={(e) => setRadius(e.target.value)}
                                size="small"
                                style={{ width: '20%' }}
                            />
                            <Button
                                variant="contained"
                                color={pickingMode ? "secondary" : "primary"}
                                onClick={handlePickingMode}
                                style={{ padding: '5px', minWidth: 'auto' }}
                            >
                                <EditLocationIcon />
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, marginTop: 1, justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleResetFilters}
                                size="small"
                                sx={{ flex: 1, marginRight: '5px' }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' }, flex: 1, marginRight: '5px' }}
                                onClick={() => setShowFilters(false)}
                                size="small"
                            >
                                Close
                            </Button>
                            <Button
                                sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: '#333' }, flex: 1 }}
                                variant="contained" color="primary" onClick={handleApplyFilters} size="small">
                                Apply
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default FilterButton;
