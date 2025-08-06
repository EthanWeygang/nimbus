import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simple check for authentication without auto-redirect
  const token = localStorage.getItem("jwt");
  const isAuthenticated = token && token !== "null";

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate('/');
  };

  return (
    <nav className="bg-charcoal shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-mint text-xl font-bold hover:text-sage transition-colors">
              CloudItty
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/files" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/files' 
                      ? 'bg-forest text-white' 
                      : 'text-mint hover:text-white hover:bg-darkSage'
                  }`}
                >
                  My Files
                </Link>
                <Link 
                  to="/files/upload" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/files/upload' 
                      ? 'bg-forest text-white' 
                      : 'text-mint hover:text-white hover:bg-darkSage'
                  }`}
                >
                  Upload
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-forest text-white rounded-md text-sm font-medium hover:bg-darkSage transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/login' 
                      ? 'bg-forest text-white' 
                      : 'text-mint hover:text-white hover:bg-darkSage'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 bg-sage text-white rounded-md text-sm font-medium hover:bg-forest transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
