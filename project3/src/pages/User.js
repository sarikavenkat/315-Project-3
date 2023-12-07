import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from '../Layout';

/** A module representing the HTML for the Users page.
 *  @module User
 * @returns HTML for the Users page */
const User = () => {
    //{ name, googleUser }
    //const welcomeContent; //name ? `Welcome, ${name}!` : googleUser ? `Welcome, Google User!` : '';
    const location = useLocation();
    const { state } = location;
    console.log(state);
    //const normalName = state && state.name;
    const normalName = "jimbob";
    const googleUser = state && state.googleUser;
    console.log("in Users");
    console.log(normalName);
    console.log(googleUser);

    //console.log("welcomeContent" +welcomeContent);
  return (
    <Layout>
      <div className="usersField">
        <h1 className='title'>Welcome Sarika!</h1>
        <h1 className='title'>you have 3000 sweet paris points!</h1>

        {/*<div className="userInfo">
          <p>Name: {name}</p>
            <p>Google User:</p>
          <pre>{JSON.stringify(googleUser, null, 2)}</pre>
        </div>
        */}
      </div>
    </Layout>
  );
};

export default User;
