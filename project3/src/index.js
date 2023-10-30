import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <nav>
        <div className="store-name">Sweet Paris Crêperie & Café</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/menu">Menu</a></li>
          <li><a href="/order">Order</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
      <div className="content">
        {/* Your page content goes here */}
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
