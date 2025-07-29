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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Log in</h1>
      <form onSubmit={validateLogin} className="flex flex-col gap-4 w-72">
        <input className="border rounded px-3 py-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <input className="bg-blue-600 text-white rounded px-3 py-2 cursor-pointer hover:bg-blue-700 transition" type="submit" value="Log in" />
      </form>
      <p className="mt-4">or <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link> instead</p>
    </div>
  );
}

export default Login;