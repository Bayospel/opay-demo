import React from 'react';
import './HomePage.css'; // Assuming there is a CSS file for styling

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Welcome to OPay</h1>
      </header>
      <div className="balance-card">
        <h2>Your Balance</h2>
        <p>$1,234.56</p>
      </div>
      <section className="transactions">
        <h2>Recent Transactions</h2>
        <ul>
          <li>Transaction 1</li>
          <li>Transaction 2</li>
          <li>Transaction 3</li>
        </ul>
      </section>
      <div className="action-buttons">
        <button>Send Money</button>
        <button>Request Money</button>
      </div>
      <section className="services-grid">
        <h2>Our Services</h2>
        <div className="grid">
          <div className="service">Service 1</div>
          <div className="service">Service 2</div>
          <div className="service">Service 3</div>
          <div className="service">Service 4</div>
        </div>
      </section>
      <footer className="bottom-navigation">
        <p>Home</p>
        <p>Services</p>
        <p>Profile</p>
      </footer>
    </div>
  );
};

export default HomePage;