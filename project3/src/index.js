import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Order from './pages/Order';
import Menu from './pages/Menu';
import Login from './pages/Login';
import EmployeeLogin from './pages/employeepages/EmployeeLogin';
import Manager from './pages/employeepages/Manager';
import Cashier from './pages/employeepages/Cashier';
import { ThemeProvider, useTheme } from './ThemeContext';

import './dark.css';
import './style.css';
import User from './pages/User';

/** Returns header and footer that is present on all pages */
function App() {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className={`app-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        <div className="store-header">
          <div className="store-name">Sweet Paris Crêperie & Café</div>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/order">Order</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <div className='modebutton'>
          <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/emplogin" element={<EmployeeLogin />} />
          <Route path="/cashlogin" element={<Cashier />} />
          <Route path="/manglogin" element={<Manager />} />
          <Route path="/user" element={<User />} />
        </Routes>

        <div className="contactbar">
          <p>CONTACT US!</p>
          <p>Address: 123 Main Street, College Station, TX</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@sweetpariscollegestation.com</p>
        </div>
      </div>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <ThemeProvider> 
    <App />
  </ThemeProvider>,
);
