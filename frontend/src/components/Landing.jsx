import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div align="center">
        <p>welcome to my awesome</p>
        <h1>File Storage</h1>
        <p><Link to="/login"> Log in </Link></p> <br/>
        <p><Link to="/signup"> Sign up </Link></p>
    </div>
  );
}

export default Landing;