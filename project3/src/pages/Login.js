import React, { useState } from 'react';
import './loginstyle.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
                    <p>Password:</p>
                    <input
                        type="password" 
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                </div>
            </div>
            <div className="submitButton">
                <button onClick={handleLoginSubmission}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Login;
