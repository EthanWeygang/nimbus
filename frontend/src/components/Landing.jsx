import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
        <p className="text-lg mb-2">welcome to my awesome</p>
        <h1 className="text-4xl font-bold mb-6">File Storage</h1>
        <Link to="/login" className="text-blue-600 hover:underline mb-2">Log in</Link>
        <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
    </div>
  );
}

export default Landing;