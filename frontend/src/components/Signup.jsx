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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Sign up</h1>
      <form onSubmit={signIn} className="flex flex-col gap-4 w-72">
        <input className="border rounded px-3 py-2" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <input className="bg-blue-600 text-white rounded px-3 py-2 cursor-pointer hover:bg-blue-700 transition" type="submit" value="Sign up" />
      </form>
      <p className="mt-4">or <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> instead</p>
    </div>
  );
}

export default Signup;