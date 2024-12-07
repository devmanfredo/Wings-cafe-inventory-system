import React from 'react';
import welcome from './Assets/welcome.jpg';
import './Welcome.css';

const Welcome = () => {
    return (
        <div className="welcome">
            <h1>Welcome to Wings Cafe</h1>
            <img src={welcome} alt="Wings Cafe" style={{ width: '500px', height: 'auto', borderRadius: '10px' }} />
            <p>Manage users, stock, and products.</p>
        </div>
    );
};

export default Welcome;