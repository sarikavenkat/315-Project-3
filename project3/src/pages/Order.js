import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
import './orderstyle.css';

const Order = () => {
    const foodItems = [
        { name: 'Item 1', price: 0.00 },
        { name: 'Item 2', price: 0.00 },
        { name: 'Item 3', price: 0.00 },
        { name: 'Item 4', price: 0.00 },
        { name: 'Item 5', price: 0.00 },
        { name: 'Item 6', price: 0.00 },
        ];

        const [itemQuantities, setItemQuantities] = useState(foodItems.map(() => 0));

        const handleQuantityChange = (index, newQuantity) => {
          const updatedQuantities = [...itemQuantities];
          updatedQuantities[index] = newQuantity;
          setItemQuantities(updatedQuantities);
        };

        const handleAddToCart = (index) => {
            // Add your logic to add the item to the cart here
        
            // Clear the quantity field for the added item
            const updatedQuantities = [...itemQuantities];
            updatedQuantities[index] = 0;
            setItemQuantities(updatedQuantities);
        };
      
        return (
          <div className="order">
            <div className="categories">
              <h1>Food</h1>
              <div className="item-boxes">
                {foodItems.map((item, index) => (
                  <div key={index} className="item-box">
                    <h2>{item.name}</h2>
                    <p>Price: ${item.price.toFixed(2)}</p>
                    <div className="quantity-container">
                        <p className="centered-text">Quantity:</p>
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
            <h1>Drinks</h1>
            <h1>Non-Food</h1>
            <h1>Seasonal Items</h1>
        </div>
      </div>
    );
  }

  export default Order;