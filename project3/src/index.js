import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'; 

function App() {
  return (
    <div className="app-container">
      <div className="store-header">
        <div className="store-name">Sweet Paris Crêperie & Café</div>
      </div>
      <nav className="navbar">
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/order">Order</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
      <div className="image-container">
        <img src="/sp1.jpg" alt="sweet paris pic 1" className="image" />
        <img src="/sp2.jpg" alt="sweet paris pic 2" className="image" />
        <img src="/sp3.jpg" alt="sweet paris pic 3" className="image" />
        <img src="/sp4.jpg" alt="sweet paris pic 4" className="image" />
      </div>
      <div className="content">
        {/* page content */}
      </div>
      <div className="contact-bar">
        <p>Contact us!</p>
        <p>Address: 123 Main Street, College Station, TX</p>
        <p>Phone: (123) 456-7890</p>
        <p>Email: info@sweetpariscollegestation.com</p>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
