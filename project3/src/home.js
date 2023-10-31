import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

function home() {
    return (
      <div className="app-container">
        <div className="store-header">
          <div className="store-name">Sweet Paris Crêperie & Café</div>
        </div>
        <nav className="navbar">
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/">Menu</a></li>
            <li><a href="/">Order</a></li>
            <li><a href="/">Login</a></li>
          </ul>
        </nav>
        <div className="homepage-images">
          <img src="/sp1.jpg" alt="sweet paris pic 1" className="image" />
          <img src="/sp2.jpg" alt="sweet paris pic 2" className="image" />
          <img src="/sp3.jpg" alt="sweet paris pic 3" className="image" />
          <img src="/sp4.jpg" alt="sweet paris pic 4" className="image" />
        </div>
        <div className="content">
        <div className="about-section">
            <h2>Who OUI Are:</h2>
            <p>
              Our mission is to revive the art of eating crêpes!
            </p>
            <p>
              Sweet Paris was first opened in Rice Village in 2012. Within 10 years, Sweet Paris has turned into one of the best fast casual hotspots in various parts of Houston, Austin, San Antonio, College Station, Miami, Woodbury, and international resort destinations.
            </p>
            <p>
              Every day - and every bite - is an opportunity to savor all that’s good in the world. Although crêpes are known for being French, we have introduced hints of other cultures into this versatile dish that can be enjoyed any time of the day!
            </p>
            <p>
            While some may see crêpes as overly simple, we wish to elevate the crêpe with our fresh quality ingredients, interesting flavor profiles, and celebratory atmosphere. From breakfast to dinner, brunch to late dessert, we strive to serve delicious food with a helping of outstanding hospitality. Our beloved guests choose Sweet Paris for routine get-togethers and special milestones alike.
            </p>
          </div>
        </div>
        <div className="contact-bar">
          <p>CONTACT US!</p>
          <p>Address: 123 Main Street, College Station, TX</p>
          <p>Phone: (123) 456-7890</p>
          <p>Email: info@sweetpariscollegestation.com</p>
        </div>
      </div>
    );
  }