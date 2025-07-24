import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  function validateLogin(e){
    // Stops page reloading
    e.preventDefault();

    //Add database check here using email and password vars
    fetch("/api/login", 
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: email, password: password})
    }).then(response => response.text())
    .then(data => {
      if(data === "Login Successful."){
        //Redirect to home page, make token bla bla
        navigate("/files")
      } else {
        alert("Incorrect username or password.")
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to connect to server. Please make sure the backend is running.');
    })
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