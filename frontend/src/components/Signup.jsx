import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div align="center">
        <h1>Sign up</h1>
        <form>
        <input placeholder='Email'></input> <br/>
        <input type="password" placeholder='Password'></input> <br/>
        <input type="submit" value="Sign up"></input>
        </form>
        <p>or <Link to="/login">Log in</Link> instead</p>
    </div>
  );
}

export default Signup;