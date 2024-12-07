import React, { useState } from 'react';
import Dashboard from './components/Dashboard'; 
import UserManagement from './components/UserManagement';
import StockManagement from './components/StockManagement';
import ProductManagement from './components/ProductManagement';
import Welcome from './components/Welcome';
import Register from './components/Register'; 
import Login from './components/Login'; 
import { db } from './Services/Firebase.config'; 
import './App.css';

const App = () => {
  const [activeComponent, setActiveComponent] = useState('Register'); 

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard db={db} />;
      case 'UserManagement':
        return <UserManagement db={db} />;
      case 'StockManagement':
        return <StockManagement db={db} />;
      case 'ProductManagement':
        return <ProductManagement db={db} />;
      case 'Login':
        return <Login setActiveComponent={setActiveComponent} />;
      case 'Register':
        return <Register setActiveComponent={setActiveComponent} />;
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="app">
      {activeComponent === 'Register' || activeComponent === 'Login' ? (
        <nav>
          <ul>
            <li onClick={() => setActiveComponent('Register')}>Register</li>
            <li onClick={() => setActiveComponent('Login')}>Login</li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
            <li onClick={() => setActiveComponent('Dashboard')}>Dashboard</li>
            <li onClick={() => setActiveComponent('UserManagement')}>Users</li>
            <li onClick={() => setActiveComponent('StockManagement')}>Stock</li>
            <li onClick={() => setActiveComponent('ProductManagement')}>Products</li>
            <li onClick={() => {
              // Handle logout logic here if needed
              setActiveComponent('Login'); // Redirect to Login on logout
            }}>Logout</li>
          </ul>
        </nav>
      )}

      {renderComponent()}
    </div>
  );
};

export default App;