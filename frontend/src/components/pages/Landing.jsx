import { Link } from 'react-router-dom';
import FilterIcon from "../svg/FilterIcon"
import PadlockIcon from '../svg/PadlockIcon';

function Landing() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-mint">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
              Secure File
              <span className="text-forest block">Storage</span>
            </h1>
            <p className="text-xl md:text-2xl text-darkSage mb-8 max-w-2xl mx-auto leading-relaxed">
              Store, manage, and access your files from anywhere with our secure cloud storage solution.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-sage text-white text-lg font-semibold rounded-xl hover:bg-forest transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-forest text-forest text-lg font-semibold rounded-xl hover:bg-forest hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
          
          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-sage rounded-lg mb-4 mx-auto flex items-center justify-center">
                <PadlockIcon/>
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Secure Storage</h3>
              <p className="text-darkSage">End-to-end encryption ensures your files are always protected.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-forest rounded-lg mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Easy Upload</h3>
              <p className="text-darkSage">Drag and drop files or browse to upload instantly.</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-darkSage rounded-lg mb-4 mx-auto flex items-center justify-center">
                <FilterIcon/>
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">Smart Organization</h3>
              <p className="text-darkSage">Organize and find your files with intelligent search.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;