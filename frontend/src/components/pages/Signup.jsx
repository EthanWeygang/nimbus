import { Link } from 'react-router-dom';
import { useState } from 'react';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  

  function signIn(e){
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if(password.length <= 5){
      alert("Password must be longer than 5 characters.")
      return;
    }
    
    setIsLoading(true);

    fetch(`${process.env.REACT_APP_API_URL}/api/signup`,{
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email, password})
        }).then(response => response.text())
        .then(data => {
          if (data === "Sign up successful."){
            console.log(data)
            window.location.href = "/verify" // change this
          } else {
            alert('Email already in use.')
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to connect to server.');
        })
        .finally(() => {
          setIsLoading(false);
        });
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Create Account</h1>
            <p className="text-darkSage">Join us to start storing your files securely</p>
          </div>
          
          <form onSubmit={signIn} className="space-y-6">
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
                placeholder="Create a password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                Confirm Password
              </label>
              <input 
                id="confirmPassword"
                type="password" 
                className="w-full px-4 py-3 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent transition-all duration-200 bg-white/70" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} 
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
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-darkSage">
              Already have an account?{' '}
              <Link to="/login" className="text-forest font-semibold hover:text-sage transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;