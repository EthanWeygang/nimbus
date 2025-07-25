import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  async function validateLogin(e){
    // Stops page reloading
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: email, password: password})
      });

      const data = await response.json();

      if (data.token) {
        // Success - store JWT and redirect
        localStorage.setItem("jwt", data.token);
        navigate("/files");
      } else {
        // Error message from server
        alert(data.message || "Incorrect username or password.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server. Please make sure the backend is running.');
    }
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