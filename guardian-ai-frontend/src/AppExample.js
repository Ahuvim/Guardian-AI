import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import MapComponent from './components/MapComponent';
import SidePanel from './components/SidePanel';
import FilterButton from './components/FilterButton';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';

function App() {
    const [activePanel, setActivePanel] = useState('news');
    const [newsItems, setNewsItems] = useState([]);
    const [locationPolygons, setLocationPolygons] = useState([]);
    const [locationMarkers, setLocationMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [currentFilters, setCurrentFilters] = useState({});
    const [selectedNewsItem, setSelectedNewsItem] = useState(null);
    const [totalNewsCount, setTotalNewsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [sourcesCount, setSourcesCount] = useState([]);
    const [locationsCount, setLocationsCount] = useState([]);
    const [coordinates, setCoordinates] = useState(null);
    const [pickingMode, setPickingMode] = useState(false); // Add state for picking mode
    const { getCurrentUserToken } = useAuth();

    useEffect(() => {
        const markerArray = [];
        const polygonArray = [];

        newsItems.forEach(item => {
            if (item.locations && item.locations.latitude && item.locations.longitude) {
                markerArray.push({
                    latitude: item.locations.latitude,
                    longitude: item.locations.longitude,
                    item: item
                });
            }
            if (item.locationPolygons && item.locationPolygons.coordinates) {
                polygonArray.push(item.locationPolygons);
            }
        });

        setLocationMarkers(markerArray);
        setLocationPolygons(polygonArray);
    }, [newsItems]);

    function appendNonEmptyParams(params, filters) {
        Object.keys(filters).forEach(key => {
            if (filters[key] || filters[key] === false) {
                params.append(key, filters[key]);
            }
        });
    }

    async function fetchLocationCoords(locationId) {
        try {
            const headers = {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            };
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_document_by_location_id`, {
                params: { location_id: locationId }, headers
            });
            if (response.data && response.data.length > 0) {
                const locationData = response.data[0];
                if (locationData.type === "Polygon") {
                    const reversedCoordinates = []
                    reversedCoordinates[0] = locationData.polygon[0].map(coord => [coord[1], coord[0]]);
                    setLocationPolygons([{ coordinates: reversedCoordinates }]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch location coordinates:', error);
        }
    }

    async function handleFilterApply(filters) {
        setCurrentFilters(filters);
        const params = new URLSearchParams({limit: 100});
        appendNonEmptyParams(params, filters);

        const newsUrl = `${process.env.REACT_APP_API_URL}/get_news_by_filter?${params.toString()}`;
        const countNewsUrl = `${process.env.REACT_APP_API_URL}/get_count_of_news_by_filter?${params.toString()}`;
        const countCategoriesUrl = `${process.env.REACT_APP_API_URL}/get_categories_counts_by_filter?${params.toString()}`;
        const sourcesCountUrl = `${process.env.REACT_APP_API_URL}/get_sources_counts_by_filter?${params.toString()}`;
        const locationsCountUrl = `${process.env.REACT_APP_API_URL}/get_locations_counts_by_filter?${params.toString()}`;
        const headers = {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        };

        try {
            setLoading(true);

            const [
                newsResponse,
                countResponse,
                categoriesCountResponse,
                sourcesCountResponse,
                locationsCountResponse
            ] = await Promise.all([
                axios.get(newsUrl, { headers }),
                axios.get(countNewsUrl, { headers }),
                axios.get(countCategoriesUrl, { headers }),
                axios.get(sourcesCountUrl, { headers }),
                axios.get(locationsCountUrl, { headers })
            ]);

            setTotalNewsCount(countResponse.data?.news_count || 0);

            const newNewsItems = newsResponse.data || [];
            setNewsItems(newNewsItems);
            setHasMore(newNewsItems.length > 0);
            setPage(0);
            setCategoriesCount(categoriesCountResponse.data);
            setSourcesCount(sourcesCountResponse.data);
            setLocationsCount(locationsCountResponse.data);

            const newMarkers = newNewsItems.map(item => ({
                latitude: item.locations?.latitude,
                longitude: item.locations?.longitude,
                item
            })).filter(marker => marker.latitude && marker.longitude);
            setLocationMarkers(newMarkers);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchNextPage = async () => {
        setLoading(true);
        setPage(prevPage => prevPage + 1);
        const params = new URLSearchParams({ page: page, limit: 100 });
        appendNonEmptyParams(params, currentFilters);
        const headers = {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        };
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/get_news_by_filter`, { params, headers });
            if (response.data.length > 0) {
                setNewsItems(prevItems => [...prevItems, ...response.data]);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to fetch next page of news items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <NavBar onTabChange={setActivePanel} activePanel={activePanel}/>
            <div className="main-container">
                <div className="map-container">
                    <MapComponent
                        locationPolygons={locationPolygons}
                        locationMarkers={locationMarkers}
                        selectedNewsItem={selectedNewsItem}
                        setSelectedNewsItem={setSelectedNewsItem}
                        setCoordinates={setCoordinates} // Pass setCoordinates to MapComponent
                        pickingMode={pickingMode} // Pass pickingMode to MapComponent
                        setPickingMode={setPickingMode} // Pass setPickingMode to MapComponent
                        coordinates={coordinates}
                    />
                </div>
                <div className="side-panel">
                    <SidePanel
                        activePanel={activePanel}
                        newsItems={newsItems}
                        fetchLocationCoords={fetchLocationCoords}
                        fetchNextPage={fetchNextPage}
                        hasMore={hasMore}
                        totalNewsCount={totalNewsCount}
                        setSelectedNewsItem={setSelectedNewsItem}
                        selectedNewsItem={selectedNewsItem}
                        currentFilters={currentFilters}
                        categoriesCount={categoriesCount}
                        sourcesCount={sourcesCount}
                        locationsCount={locationsCount}
                        loading={loading}
                    />
                </div>
                <div>
                    <FilterButton
                        updateNewsFeed={handleFilterApply}
                        coordinates={coordinates}
                        pickingMode={pickingMode} // Pass pickingMode to FilterButton
                        setPickingMode={setPickingMode} // Pass setPickingMode to FilterButton
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
