import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Order from './pages/Order';
import Menu from './pages/Menu';
import Login from './pages/Login';
import EmployeeLogin from './pages/employeepages/EmployeeLogin';
import Manager from './pages/employeepages/Manager';
import Cashier from './pages/employeepages/Cashier';


import './style.css'; 

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/emplogin" element={<EmployeeLogin />} />
          <Route path="/cashlogin" element={<Cashier />} />
          <Route path="/manglogin" element={<Manager />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <>
    <App />
  </>
);
