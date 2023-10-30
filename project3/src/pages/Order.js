import React, { useState } from 'react';
import './orderstyle.css';

const Order = () => {
  const foodItems = [
    { name: 'Item 1', price: 10.99 },
    { name: 'Item 2', price: 12.49 },
    { name: 'Item 3', price: 8.99 },
    { name: 'Item 4', price: 9.49 },
    { name: 'Item 5', price: 7.99 },
    { name: 'Item 6', price: 11.99 },
  ];

  const [itemQuantities, setItemQuantities] = useState(foodItems.map(() => 0));
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState([]);

  const handleQuantityChange = (index, newQuantity) => {
    newQuantity = Math.max(0, newQuantity);
    const updatedQuantities = [...itemQuantities];
    updatedQuantities[index] = newQuantity;
    setItemQuantities(updatedQuantities);
  };

  const handleAddToCart = (index) => {
    const quantity = itemQuantities[index];
    if (quantity > 0) {
      const existingCartItemIndex = cart.findIndex((item) => item.name === foodItems[index].name);
      if (existingCartItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingCartItemIndex].quantity += quantity;
        updatedCart[existingCartItemIndex].totalPrice = updatedCart[existingCartItemIndex].quantity * foodItems[index].price;
        setCart(updatedCart);
      } else {
        const cartItem = {
          name: foodItems[index].name,
          price: foodItems[index].price,
          quantity,
          totalPrice: foodItems[index].price * quantity,
        };
        setCart([...cart, cartItem]);
      }

      const updatedQuantities = [...itemQuantities];
      updatedQuantities[index] = 0;
      setItemQuantities(updatedQuantities);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleSubmitOrder = () => {
    if (customerName.trim() === '') {
        alert('Please enter your name before submitting the order.');
    } else {
        // Clear the shopping cart and the customer name
        setCart([]);
        setCustomerName('');
        // Add your logic to send the cart data to the database here
    }

      // Add logic to send cart data to database 
  };

  return (
    <div className="order">
      <div className="cart-section">
        <div className="cart-box">
          <h2>Shopping Cart</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <p></p>
          <div className="cart-items">
            {cart.map((cartItem, index) => (
              <div key={index} className="cart-item">
                <span>{cartItem.name} (Quantity: {cartItem.quantity}, Price: ${cartItem.price.toFixed(2)}, Total: ${cartItem.totalPrice.toFixed(2)})</span>
              </div>
            ))}
          </div>
          <p>Total Price: ${calculateTotalPrice().toFixed(2)}</p>
          <button onClick={handleSubmitOrder}>Submit Order</button>
        </div>
      </div>
        <h1 className='categories'>Food</h1>
        <div className="item-boxes">
          {foodItems.map((item, index) => (
            <div key={index} className="item-box">
              <h2>{item.name}</h2>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="quantity-container">
                <div className="centered-text">Quantity:</div>
                <input
                  type="number"
                  value={itemQuantities[index]}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  min="0"
                />
              </div>
              <div className="add-button-container">
                <button onClick={() => handleAddToCart(index)}>Add Item to Cart</button>
              </div>
            </div>
          ))}
        </div>
        <h1 className='categories'>Drinks</h1>
        <h1 className='categories'>Non-Food</h1>
        <h1 className='categories'>Seasonal Items</h1>
    </div>
  );
};

export default Order;
