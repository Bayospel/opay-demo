import React from 'react';

const ActionButtons: React.FC = () => {
    return (
        <div className="action-buttons">
            <button onClick={() => alert('Navigate to OPay')}>To OPay</button>
            <button onClick={() => alert('Navigate to Bank')}>To Bank</button>
            <button onClick={() => alert('Withdraw funds')}>Withdraw</button>
        </div>
    );
};

export default ActionButtons;
