import { Link } from 'react-router-dom';
import { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signIn(e){
    e.preventDefault()

    fetch("/api/signup",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email, password})
        }).then(response => response.text())
        .then(data => {
          if (data === "Sign up successful." && password !== ""){
            console.log(data)
            window.location.href = "/login"
          } else {
            alert('Email already in use / Password cannot be null.')
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to connect to server.');
        })
  }

  
  return (
    <div align="center">
        <h1>Sign up</h1>
        <form onSubmit={(e) => signIn(e)}>
        <input placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input> <br/>
        <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input> <br/>
        <input type="submit" value="Sign up"></input>
        </form>
        <p>or <Link to="/login">Log in</Link> instead</p>
    </div>
  );
}

export default Signup;