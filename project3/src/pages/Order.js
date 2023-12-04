import React, { useState, useEffect } from "react";
import "./orderstyle.css";

const Order = () => {
  // const foodItems = [
  //   { name: "Item 1", price: 10.99 },
  //   { name: "Item 2", price: 12.49 },
  //   { name: "Item 3", price: 8.99 },
  //   { name: "Item 4", price: 9.49 },
  //   { name: "Item 5", price: 7.99 },
  //   { name: "Item 6", price: 11.99 },
  // ];

  // const drinkItems = [
  //   { name: "Drink Item 1", price: 2.99 },
  //   { name: "Drink Item 2", price: 3.49 },
  //   { name: "Drink Item 3", price: 1.99 },
  //   { name: "Drink Item 4", price: 2.49 },
  //   { name: "Drink Item 5", price: 3.99 },
  //   { name: "Drink Item 6", price: 4.99 },
  // ];

  // const nonFoodItems = [
  //   { name: "Non-Food Item 1", price: 5.99 },
  //   { name: "Non-Food Item 2", price: 7.49 },
  //   { name: "Non-Food Item 3", price: 6.99 },
  //   { name: "Non-Food Item 4", price: 8.49 },
  //   { name: "Non-Food Item 5", price: 4.99 },
  //   { name: "Non-Food Item 6", price: 5.49 },
  // ];

  // const seasonalItems = [
  //   { name: "Seasonal Item 1", price: 15.99 },
  //   { name: "Seasonal Item 2", price: 18.49 },
  // ];

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://172.31.32.166:5000/api/items");
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
        console.log(menuItems);
      } else {
        throw new Error("Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items", error);
    }

    const jsonOrders = menuItems.map((order) => ({
      name: order.name,
      price: order.price,
    }));
    console.log(jsonOrders);
  };
  // -----------------------------------------------------------------------------

  const [itemQuantities, setItemQuantities] = useState(menuItems.map(() => 0));
  const [customerName, setCustomerName] = useState("");
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
      const existingCartItemIndex = cart.findIndex(
        (item) => item.name === menuItems[index].name
      );
      if (existingCartItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingCartItemIndex].quantity += quantity;
        updatedCart[existingCartItemIndex].totalPrice =
          updatedCart[existingCartItemIndex].quantity * menuItems[index].price;
        setCart(updatedCart);
      } else {
        const cartItem = {
          name: menuItems[index].name,
          price: menuItems[index].price,
          quantity: quantity,
          totalPrice: menuItems[index].price * quantity,
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

  const handleSubmitOrder = async () => {
    const test = {
      "bruh": 1,
      "okay": 2
    };
  
    if (customerName.trim() === "") {
      alert("Please enter your name before submitting the order.");
    } else {
  
      await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });
  
      // console.log(cart);
  
      alert("Your order was submitted!");
      setCart([]);
      setCustomerName("");
    }
  };
  

  const handleRemoveFromCart = (index) => {
    const updatedCart = [...cart];
  const itemToRemove = updatedCart[index];
  
  const itemIndexToRemove = updatedCart.findIndex(
    (item) => item.name === itemToRemove.name
  );

  if (itemIndexToRemove !== -1) {
    if (updatedCart[itemIndexToRemove].quantity > 1) {
      updatedCart[itemIndexToRemove].quantity -= 1;
      updatedCart[itemIndexToRemove].totalPrice =
        updatedCart[itemIndexToRemove].price * updatedCart[itemIndexToRemove].quantity;
    } else {
      updatedCart.splice(itemIndexToRemove, 1);
    }
    setCart(updatedCart);
  }
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
                <span>
                  {cartItem.name} (Quantity: {cartItem.quantity}, Price: $
                  {cartItem.price.toFixed(2)}, Total: $
                  {cartItem.totalPrice.toFixed(2)})
                </span>
                <button onClick={() => handleRemoveFromCart(index)}>Remove</button>
              </div>
            ))}
          </div>
          <p>Total Price: ${calculateTotalPrice().toFixed(2)}</p>
          <button onClick={handleSubmitOrder}>Submit Order</button>
        </div>
      </div>
      <div className="categories">
        <h1 className="category-title">Food</h1>
        <div className="item-boxes">
          {menuItems
            .filter((item) => item.food)
            .map((item, index) => (
              <div key={index} className="item-box">
                <h2>{item.name}</h2>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="quantity-container">
                  <div className="centered-text">Quantity:</div>
                  <input
                    type="number"
                    value={itemQuantities[index]}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    min="0"
                  />
                </div>
                <div className="add-button-container">
                  <button onClick={() => handleAddToCart(index)}>
                    Add Item to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="categories">
        <h1 className="category-title">Drinks</h1>
        <div className="item-boxes">
          {menuItems
            .filter((item) => item.drink)
            .map((item, index) => (
              <div key={index} className="item-box">
                <h2>{item.name}</h2>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="quantity-container">
                  <div className="centered-text">Quantity:</div>
                  <input
                    type="number"
                    value={itemQuantities[index]}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    min="0"
                  />
                </div>
                <div className="add-button-container">
                  <button onClick={() => handleAddToCart(index)}>
                    Add Item to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="categories">
        <h1 className="category-title">Non-Food</h1>
        <div className="item-boxes">
          {menuItems
            .filter((item) => item.drink == false && item.food == false)
            .map((item, index) => (
              <div key={index} className="item-box">
                <h2>{item.name}</h2>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="quantity-container">
                  <div className="centered-text">Quantity:</div>
                  <input
                    type="number"
                    value={itemQuantities[index]}
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                    min="0"
                  />
                </div>
                <div className="add-button-container">
                  <button onClick={() => handleAddToCart(index)}>
                    Add Item to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="categories">
        <h1 className="category-title">Seasonal Items</h1>
        <div className="item-boxes">
          {menuItems.filter((item) => item.itemid > 26).map((item, index) => (
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
                <button onClick={() => handleAddToCart(index)}>
                  Add Item to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
