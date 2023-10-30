import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import Order from './pages/Order';

import './style.css'; 
// import App from "./app";

// Components for different routes
// const Home = () => <div>Home</div>;

// Make these individual js/jsx files in the pages folder. Then put them into the index file like I did with home.
const Menu = () => <div>Menu</div>;
//const Order = () => <div>Order</div>;
const Login = () => <div>Login</div>;

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
            <li><Link to="/Order">Order</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/login" element={<Login />} />
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
