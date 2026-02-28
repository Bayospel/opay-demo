import React from 'react';
import './ServicesGrid.css'; // Assuming you will create a CSS file for styles

const ServicesGrid = () => {
    const services = [
        { name: 'Airtime', icon: '📱' },
        { name: 'Data', icon: '📶' },
        { name: 'Betting', icon: '🎲' },
        { name: 'TV', icon: '📺' },
        { name: 'SafeBox', icon: '🔒' },
        { name: 'Loan', icon: '💵' },
        { name: 'Invitation', icon: '✉️' },
        { name: 'More', icon: '➕' },
    ];

    return (
        <div className="services-grid">
            {services.map(service => (
                <div className="service-tile" key={service.name}>
                    <span className="service-icon">{service.icon}</span>
                    <span className="service-name">{service.name}</span>
                </div>
            ))}
        </div>
    );
};

export default ServicesGrid;
