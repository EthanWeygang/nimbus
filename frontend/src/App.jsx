import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Files from "./components/Files";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Signup from './components/Signup';
import Upload from './components/File/Upload';

function App() {
  return (
<>
<Router>
<div className="App">
  <Routes>
    <Route path="/" element={<Landing/>}/>
    <Route path="/signup" element={<Signup/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/files" element={<Files/>}/>
    <Route path="/files/upload" element={<Upload/>}/>
  </Routes>
</div>
</Router>
</>
  );
}

export default App;
