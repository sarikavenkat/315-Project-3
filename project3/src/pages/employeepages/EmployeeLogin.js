import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../loginstyle.css';

const EmployeeLogin = () => {
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
                const response = await fetch(`http://localhost:5000/api/emplogin?id=${username}&password=${password}`, {
                    method: "GET",
                    headers: {
                    'Content-Type': 'application/json',
                    // Include any other headers as needed
                    },
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
            <h1 className='title'>Employee Login</h1>
            <div className="textFields">
                <div className='textField'>
                    <p>Employee ID:</p>
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
            <div className="Buttons">
                <button onClick={handleLoginSubmission}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default EmployeeLogin;
