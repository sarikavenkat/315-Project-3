import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import './loginstyle.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
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
                const response = await fetch(`http://localhost:5000/api/login?name=${username}&id=${password}`, {
                    method: "GET",
                    headers: {
                    'Content-Type': 'application/json',
                    // Include any other headers as needed
                    },
                });
                if (response.ok) {
                  const data = await response.json();
                  console.log(data.rows[0].name);
                  setName(data.rows[0].name);
                } else {
                  throw Error("Failed to authenticate user");
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

    const handleGoogleClick = () =>{
        navigate('/auth/google');
    }

    return (
        <Layout>
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
                <button onClick={handleGoogleClick}>
                    Google Login
                </button>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
