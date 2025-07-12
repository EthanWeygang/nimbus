import { Link } from 'react-router-dom';
import File from "./File";
import { useState } from 'react';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  function validateLogin(e){
    // Stops page reloading
    e.preventDefault();

    //Add database check here using email and password vars

  }
  
  return (
    <div align="center">
        <h1>Log in</h1>
        <form onSubmit={(e) => validateLogin(e)}>
        <input placeholder='Email' onChange={(e)  => setEmail(e.target.value)}></input> <br/>
        <input type="password" placeholder='Password' onChange={(e)  => setPassword(e.target.value)}></input> <br/>
        <input type="submit" value="Log in"></input>
        </form>
        <p>or <Link to="/signup">Sign up</Link> instead</p>
    </div>
  );
}

export default Login;