import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


  async function validateLogin(e){
    // Stops page reloading
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email: email, password: password})
      });

      const data = await response.json();
      console.log(data)

      if (response.ok && data.token) {
        // Success - store JWT and redirect
        localStorage.setItem("jwt", data.token);
        navigate("/files");
      } else {
        // Error message from server
        alert(data.message || data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Network error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Welcome Back</h1>
            <p className="text-darkSage">Sign in to access your files</p>
          </div>
          
          <form onSubmit={validateLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email Address
              </label>
              <input 
                id="email"
                type="email"
                className="w-full px-4 py-3 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all duration-200 bg-white/70" 
                placeholder="Enter your email" 
                value={email}
                onChange={e => setEmail(e.target.value)} 
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-2">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                className="w-full px-4 py-3 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all duration-200 bg-white/70" 
                placeholder="Enter your password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-sage text-white font-semibold py-3 px-4 rounded-xl hover:bg-forest transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>) : ('Sign In')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-darkSage">
              Don't have an account?{' '}
              <Link to="/signup" className="text-forest font-semibold hover:text-sage transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;