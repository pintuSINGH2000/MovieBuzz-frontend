import { useContext, useState } from "react";
import "./login.scss";
import { AuthContext } from "../../context/authContext/AuthContext";
import { login } from "../../context/authContext/apiCalls";
import { Link } from "react-router-dom";

const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const {dispatch} = useContext(AuthContext);

  const handleLogin = async (e) => {
   e.preventDefault();
   login({email,password},dispatch);
  }
  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <div to="/" className="title">
              MovieBuzz
          </div>
        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In</h1>
          <input type="email" placeholder="Email or phone number" onChange={(e) => setEmail(e.target.value)}/>
          <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)}/>
          <button className="logginButton" onClick={handleLogin}>Sign in</button>
          <span>
            New to MovieBuzz? <Link to="/register" className="link"><b>Sign up now</b></Link>
          </span>
          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <b>Learn more</b>.
          </small>
        </form>
      </div>
    </div>
  );
};

export default Login;
