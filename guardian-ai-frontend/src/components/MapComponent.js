import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerDetailCard from './MarkerDetailCard';
import Box from '@mui/material/Box';

const initialCenter = [31.514722, 34.454167];
const initialZoom = 10;

const MapComponent = ({ locationPolygons, locationMarkers, selectedNewsItem, setSelectedNewsItem, setCoordinates, pickingMode, coordinates }) => {
    const mapRef = useRef(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        if (mapRef.current) {
            const mapInstance = mapRef.current.leafletElement || mapRef.current;

            if (selectedNewsItem && selectedNewsItem.locations && selectedNewsItem.locations.latitude && selectedNewsItem.locations.longitude) {
                const { latitude, longitude } = selectedNewsItem.locations;
                const zoomLevel = 15;
                mapInstance.flyTo([latitude, longitude], zoomLevel, {
                    animate: true,
                    duration: 0.5
                });
            } else {
                mapInstance.flyTo(initialCenter, initialZoom, {
                    animate: true,
                    duration: 0.5
                });
            }
        }
    }, [selectedNewsItem]);

    const LocationMarker = () => {
        useMapEvents({
            click(event) {
                if (pickingMode) {
                    const { lat, lng } = event.latlng;
                    setCoordinates({ lat, lng });
                }
            },
        });

        return coordinates ? (
            <Marker position={[coordinates.lat, coordinates.lng]}
                    icon={L.divIcon({
                        className: 'custom-icon',
                        html: `<div style="background: url('${process.env.PUBLIC_URL}/icons/picked-map.png') no-repeat center center; background-size: contain; width: 32px; height: 32px;"></div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                    })}>
            </Marker>
        ) : null;
    };

    const renderMarkers = () => {
        if (!locationMarkers || !Array.isArray(locationMarkers)) return null;
        return locationMarkers.map((coords, index) => {
            const { latitude, longitude, item } = coords;
            const iconSize = [30, 30];
            const isSelected = selectedNewsItem && item._id === selectedNewsItem._id;
            let customIcon;
            const categories = ["Access", "Aid", "Diplomatic", "Facilities", "Financial", "Food", "Fuel", "Humanitarian", "International Relations", "Medical Supplies", "Military", "Population", "Security", "Trucks", "Water", "Health"];
            const normalizedSelectedSubCategory = item.category ? item.category.toLowerCase() : '';
            const normalizedCategories = categories.map(category => category.toLowerCase());
            const iconFileName = normalizedCategories.includes(normalizedSelectedSubCategory) ? `icon-${item.category}.png` : 'icon-other.png';

            let zIndexOffset = 0;

            if (isSelected) {
                zIndexOffset = 1000;
                customIcon = L.divIcon({
                    className: 'shining-icon',
                    html: `
                    <svg width="50" height="50" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <image href="${process.env.PUBLIC_URL}/icons/${iconFileName}" width="32" height="32" />
                        <circle cx="16" cy="16" r="14" fill="none" stroke="yellow" stroke-width="2">
                            <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                `
                });
            } else {
                customIcon = L.divIcon({
                    className: 'custom-icon',
                    html: `<div style="background: url('${process.env.PUBLIC_URL}/icons/${iconFileName}') no-repeat center center; background-size: contain; width: 32px; height: 32px;"></div>`,
                    iconSize: iconSize,
                    iconAnchor: [16, 32],
                });
            }

            return (
                <Marker
                    key={index}
                    position={[latitude, longitude]}
                    icon={customIcon}
                    zIndexOffset={zIndexOffset}
                    eventHandlers={{
                        click: () => {
                            setSelectedMarker(item);
                            setSelectedNewsItem(item);
                        },
                    }}
                >
                    <Tooltip>{item.category}</Tooltip>
                </Marker>
            );
        });
    };

    const renderPolygons = () => {
        if (!locationPolygons || !Array.isArray(locationPolygons)) return null;

        return locationPolygons.map((polygon, index) => (
            <Polygon key={index} positions={polygon.coordinates} />
        ));
    };

    return (
        <div className="map-wrapper" style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer
                ref={mapRef}
                center={initialCenter}
                zoom={initialZoom}
                style={{ height: '100%', width: '100%' }}
                doubleClickZoom={false} // Disable default double-click zoom
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {renderMarkers()}
                {renderPolygons()}
                <LocationMarker />
            </MapContainer>
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
