// import React from 'react';
// import './loginstyle.css';

 const Login = () => {
    let user = ""
    let pass = ""
    const handleUserChange = (newName) => {
        user = newName
    }

    const handlePasswordChange = (newPass) => {
        pass = newPass
    }

    const handleLoginSubmission = async () => {
        const test = {
            "bruh": 1,
            "okay": 2
        };
        if(user.trim() === ""){
            alert("Username not provided, try again.");
        }
        else if (pass.trim() === ""){
            alert("Password not provided, try again.");
        }
        else{
            await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
        });
        }
    }

    return(
        <div class = "loginField">
            <div class = "textFields">
                <input 
                type="text"
                value = {username}
                onChange={(e) =>
                    handleUserChange(username)
                }
                />

                <input
                // type="text" 
                value = {password}
                onChange={(e) =>
                    handlePasswordChange(password)
                }
                />
            </div>
            <div class = "suubmitButton">
                <button onClick={() => handleLoginSubmission(index)}>
                  Submit
                </button>
            </div>
        </div>

    );
};

export default Login;
