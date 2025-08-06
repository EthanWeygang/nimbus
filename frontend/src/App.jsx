import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Files from "./components/pages/Files";
import Landing from "./components/pages/Landing";
import Login from "./components/pages/Login";
import Signup from './components/pages/Signup';
import Upload from './components/pages/Upload';
import Navigation from './components/elements/Navigation';
import Verify from './components/pages/Verify';

function App() {
  useEffect(() => {
    document.title = "CloudItty";
  }, []);

  return (
<>
<Router>
<div className="App min-h-screen bg-gradient-to-br from-primary-50 to-mint">
  <Navigation />
  <Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/files" element={<Files/>}/>
    <Route path="/files/upload" element={<Upload/>}/>
    <Route path="/verify" element={<Verify/>}/>
  </Routes>
</div>
</Router>
</>
  );
}

export default App;
