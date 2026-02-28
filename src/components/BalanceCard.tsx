import React from 'react';
import './BalanceCard.css'; // Assuming you will create a CSS file for styling

const BalanceCard = () => {
    const availableBalance = 1000; // Example balance, should be dynamically fetched

    return (
        <div className="balance-card">
            <h2>Available Balance</h2>
            <p>${availableBalance.toFixed(2)}</p>
            <div className="actions">
                <a href="/transaction-history" className="history-link">Transaction History</a>
                <button className="add-money-button">Add Money</button>
            </div>
        </div>
    );
};

export default BalanceCard;