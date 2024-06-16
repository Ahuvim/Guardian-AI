//SidePanel.js
import React from 'react';
import NewsFeed from './NewsFeed';
import Chat from './Chat';

const SidePanel = ({
                       activePanel,
                       newsItems,
                       fetchLocationCoords,
                       fetchNextPage,
                       hasMore,
                       setSelectedNewsItem,
                       selectedNewsItem,
                       totalNewsCount,
                       currentFilters,
                       loading,
                       categoriesCount,
                       sourcesCount,
                       locationsCount,

                   }) => {
    return (
        <div className="side-panel-container">
            {activePanel === 'news' &&
                <NewsFeed
                    newsItems={newsItems}
                    fetchLocationCoords={fetchLocationCoords}
                    fetchNextPage={fetchNextPage}
                    hasMore={hasMore}
                    totalNewsCount={totalNewsCount}
                    setSelectedNewsItem={setSelectedNewsItem}
                    selectedNewsItem={selectedNewsItem}
                    loading={loading}
                />
            }
            {activePanel === 'chat' && <Chat />}

        </div>
    );
};

export default SidePanel;
