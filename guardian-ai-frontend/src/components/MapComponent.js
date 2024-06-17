import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Box from '@mui/material/Box';
import MarkerDetailCard from './MarkerDetailCard';

const initialCenter = { lat: 30.2081, lng: 10.5754 };
const initialZoom = 2.5;

const containerStyle = {
    width: '100%',
    height: '100%'
};

const MapComponent = ({ locationPolygons, locationMarkers, selectedNewsItem, setSelectedNewsItem, setCoordinates, pickingMode, coordinates }) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    useEffect(() => {
        if (map) {
            if (selectedNewsItem && selectedNewsItem.locations && selectedNewsItem.locations.latitude && selectedNewsItem.locations.longitude) {
                const { latitude, longitude } = selectedNewsItem.locations;
                const zoomLevel = 15;
                map.panTo({ lat: latitude, lng: longitude });
                map.setZoom(zoomLevel);
            } else {
                map.panTo(initialCenter);
                map.setZoom(initialZoom);
            }
        }
    }, [selectedNewsItem, map]);

    const handleMapClick = (event) => {
        if (pickingMode) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setCoordinates({ lat, lng });
        }
    };

    const renderMarkers = () => {
        if (!locationMarkers || !Array.isArray(locationMarkers)) return null;
        return locationMarkers.map((coords, index) => {
            const { latitude, longitude, item } = coords;

            if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
                console.error(`Invalid coordinates for marker: ${latitude}, ${longitude}`);
                return null;
            }

            const isSelected = selectedNewsItem && item._id === selectedNewsItem._id;
            const iconUrl = isSelected ? '/icons/icon-selected.png' : `/icons/icon-${item.category}.png`;

            return (
                <Marker
                    key={index}
                    position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
                    icon={{
                        url: iconUrl,
                        scaledSize: new window.google.maps.Size(32, 32),
                        anchor: new window.google.maps.Point(16, 16)
                    }}
                    onClick={() => {
                        setSelectedMarker(item);
                        setSelectedNewsItem(item);
                    }}
                />
            );
        });
    };

    return (
        <div className="map-wrapper" style={{ position: 'relative', height: '100%', width: '100%' }}>
            <LoadScript googleMapsApiKey="AIzaSyB58Qcg2jefEBs5hR12S8cRNgr29WR32e4">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={initialCenter}
                    zoom={initialZoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                    mapTypeId="satellite" // Set map type to satellite
                    options={{ gestureHandling: 'auto' }} // Enable default zoom behavior
                >
                    {renderMarkers()}
                </GoogleMap>
            </LoadScript>
            {selectedMarker && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000
                }}>
                    <MarkerDetailCard marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
                </Box>
            )}
        </div>
    );
};

export default MapComponent;
