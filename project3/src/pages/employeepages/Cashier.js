import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./cashierstyle.css";

const Cashier = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [itemQuantities, setItemQuantities] = useState(menuItems.map(() => 0));
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState([]);
  const [openCategories, setOpenCategories] = useState({
    Food: false,
    Drinks: false,
    NonFood: false,
    SeasonalItems: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const cashierName = state && state.cashierName;

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw new Error("Failed to fetch menu items");
      }
    } catch (error) {
      console.error("Error fetching menu items", error);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

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

  const handleSubmitOrder = async () => {
    if (customerName.trim() === "") {
      alert("Please enter Customer's name before submitting the order.");
    } else {
      await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
      });

      alert("Your order was submitted!");
      setCart([]);
      setCustomerName("");
    }
  };

  const toggleCategory = (category) => {
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [category]: !prevOpenCategories[category],
    }));
  };

  const handleLogout = () => {
    navigate('/emplogin'); 
  };

  return (
    <div className="order">
      {/* Cart Section */}
      <div className="cashier">
        <h1>
          Welcome, Cashier: {cashierName} 
        </h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="cart-section">
        <div className="cart-box">
          <h2>Shopping Cart</h2>
          <input
            type="text"
            placeholder="Enter Customer's name"
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

      {/* Menu Categories */}
      {Object.entries(openCategories).map(([category, isOpen]) => (
        <div key={category} className="categories">
          <h1 className="category-title" onClick={() => toggleCategory(category)}>
            {category}
          </h1>
          {isOpen && (
            <div className="item-boxes">
                {menuItems
                    .filter((item) => {
                      if (category === "Food") {
                        return item.food;
                      } else if (category === "Drinks") {
                        return item.drink;
                      } else if (category === "SeasonalItems") {
                        return item.itemid > 26;
                      } else {
                        return item.food == false && item.drink == false;
                      }
                    })
                .map((item, index) => (
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
          )}
        </div>
      ))}
    </div>
  );
};

export default Cashier;
