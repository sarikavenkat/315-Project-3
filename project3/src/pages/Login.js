import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginstyle.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUserChange = (newName) => {
        setUsername(newName);
    };

    const handlePasswordChange = (newPass) => {
        setPassword(newPass);
    };

    const handleLoginSubmission = async () => {
        if (username.trim() === "") {
            alert("Username not provided, try again.");
        } else if (password.trim() === "") {
            alert("Password not provided, try again.");
        } else {
            try {
                const response = await fetch("http://localhost:5000/api/login", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                // Check response status and handle accordingly
                if (response.ok) {
                    // Handle successful login
                    console.log("Login successful");
                } else {
                    // Handle login failure
                    console.error("Login failed");
                }
            } catch (error) {
                console.error("Error during login:", error);
            }
        }
    };

    const handleNaviClick = () => {
        // Use the navigate function to go to the desired page
        navigate('/emplogin');
    };

    return (
        <div className="loginField">
            <h1 className='title'>Login</h1>
            <div className="textFields">
                <div className='textField'>
                    <p>Name:</p>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => handleUserChange(e.target.value)}
                    />
                </div>
                <div className='textField'>
                    <p>Customer ID:</p>
                    <input
                        type="password" 
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="Buttons">
                <button onClick={handleLoginSubmission}>
                    Submit
                </button>
                <button onClick={handleNaviClick}>
                    Employee Login
                </button>
            </div>
        </div>
    );
};

export default Login;
