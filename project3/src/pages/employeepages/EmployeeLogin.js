import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../loginstyle.css';
import Layout from '../../Layout';

/** A module representing the HTML for Sweet Paris' employee login page.
 *  @module EmployeeLogin
 * @returns HTML for Employee page*/
const EmployeeLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    /** Helper function to set username to user input
     * @alias module:EmployeeLogin.handleUserChange
     * @param {string} newName - The user input to set the username to
    */
    const handleUserChange = (newName) => {
        setUsername(newName);
    };
    /** Helper function to set password to user input
     * @alias module:EmployeeLogin.handlePasswordChange
     * @param {string} newPass - The user input to set the password to
    */
    const handlePasswordChange = (newPass) => {
        setPassword(newPass);
    };

    /**Sends username and password to postgres database,
     * then determine if the login is valid
     * @alias module:EmployeeLogin.handleLoginSubmission
     */
    const handleLoginSubmission = async () => {
        if (username.trim() === "") {
            alert("Username not provided, try again.");
        } else if (password.trim() === "") {
            alert("Password not provided, try again.");
        } else {
            try {
                const response = await fetch(`http://3.17.222.225:5000/api/emplogin?id=${username}&password=${password}`, {
                    method: "GET",
                    headers: {
                    'Content-Type': 'application/json',
                    // Include any other headers as needed
                    },
                });

                // Check response status and handle accordingly
                if (response.ok) {
                    // Handle successful login
                    const data = await response.json();
                    let name = "";
                    let job = "";
                    
                    name = data.rows[0].name;
                    job = data.rows[0].position;

                    console.log(name, job);

                    if (job === 'manager') {
                        navigate('/manglogin', { state: { managerName: name } });
                      } else if (job === 'cashier') {
                        navigate('/cashlogin', { state: { cashierName: name } });
                      }

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
        <Layout>
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
        </Layout>
    );
};

export default EmployeeLogin;