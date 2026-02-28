import React from 'react';
import './Dashboard.css'; // Optional: Include any styles if you have them

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>OPay Dashboard</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </nav>
      </header>

      <section className="balance-card">
        <h2>Your Balance</h2>
        <p>$10,000</p>
      </section>

      <section className="transactions">
        <h2>Recent Transactions</h2>
        <ul>
          <li>Transaction #1 - $500</li>
          <li>Transaction #2 - $200</li>
          <li>Transaction #3 - $150</li>
          <li>Transaction #4 - $800</li>
        </ul>
      </section>

      <section className="action-buttons">
        <button>Send Money</button>
        <button>Request Money</button>
        <button>Pay Bills</button>
      </section>

      <section className="services-grid">
        <h2>Services</h2>
        <div className="grid">
          <div className="service-item">Service 1</div>
          <div className="service-item">Service 2</div>
          <div className="service-item">Service 3</div>
          <div className="service-item">Service 4</div>
        </div>
      </section>

      <footer className="bottom-navigation">
        <ul>
          <li>Home</li>
          <li>Transactions</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </footer>
    </div>
  );
};

export default Dashboard;