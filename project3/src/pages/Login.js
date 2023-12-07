import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Layout from '../Layout';
import './loginstyle.css';


/** A module representing the HTML for Sweet Paris' login page.
 *  @module Login
 * @returns HTML for login page*/
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [googleUser, setGoogleUser] = useState({});
    const navigate = useNavigate();

    /**Navigates to separate login page that authenticates through google
     * @alias module:Login.handleGoogleClick
    */
    
 
    function handleCallBackResponse(response){
        console.log("Encoded JWT Token: " + response.credential);
        const userObject = jwtDecode(response.credential);
        console.log("Decoded User Object: ")
        console.log(userObject);
        setGoogleUser(userObject);
        handleGoogleNaviClick();
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: "414457307543-apfomp4g03iur6u95r9dtf8n74ad4gtd.apps.googleusercontent.com",
            callback: handleCallBackResponse
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            {theme: "outline", size: "medium"}
        );
    }, []);



    
    /** Helper function to set username to user input
     * @alias module:Login.handleUserChange
     * @param {string} newName - The user input to set the username to
    */
    const handleUserChange = (newName) => {
        setUsername(newName);
    };
    /** Helper function to set password to user input
     * @alias module:Login.handlePasswordChange
     * @param {string} newPass - The user input to set the password to
    */
    const handlePasswordChange = (newPass) => {
        setPassword(newPass);
    };

    /**Sends username and password to postgres database,
     * then determine if the login is valid
     * @alias module:Login.handleLoginSubmission
     */
    const handleLoginSubmission = async () => {
            if (username.trim() === "") {
                alert("Username not provided, try again.");
            } else if (password.trim() === "") {
                alert("Password not provided, try again.");
            } else {
                try {
                    const response = await fetch(`http://3.17.222.225:5000/api/login?name=${username}&id=${password}`, {
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

    /**Navigates to separate employee login page 
     * @alias module:Login.handleNaviClick
    */
    const handleNaviClick = () => {
        // Use the navigate function to go to the desired page
        navigate('/emplogin');
    };

    const handleGoogleNaviClick = () => {
        // Navigate to the Users page with the user information
        navigate('/user', { state: { name: name, googleUser: googleUser } });
    };
    

    
    

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
                </div> <div id = "signInDiv">
                    
                    
                </div>
            </div>
        </Layout>
    );
};

export default Login;
