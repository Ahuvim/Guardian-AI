// SidePanel.js
import React from 'react';

const SidePanel = ({
                       newsItems,
                   }) => {
    return (
        <div className="side-panel-logo-container">
            {newsItems.map((item, index) => (
                <div key={index} className="logo-item">
                    <div className="logo-label">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

export default SidePanel;
