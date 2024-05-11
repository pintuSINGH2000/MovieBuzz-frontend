import { useRef, useState } from "react";
import "./register.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setUserPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(2);
  const [clientToken, setClientToken] = useState("");
  const [instance, setinstance] = useState("");
  const [amount, setAmount] = useState(499);
  const [paymentMode, setPaymentMode] = useState(false);

  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const paymentRef = useRef(2);

  const handlePlanClick = (plan, price) => {
    setSelectedPlan(plan);
    setAmount(price);
  };

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/auth/verify-email`, {
        email: emailRef.current.value,
      });
      setEmail(emailRef.current.value);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  //payment
  const getToken = async () => {
    try {
      const { data } = await axios.get(`/api/auth/braintree/token`);
      setClientToken(data?.clientToken);
      setPaymentMode(true);
    } catch (error) {
      console.log(error);
    }
  };
  const paymentStart = async (e) => {
    e.preventDefault();
    setUserName(usernameRef.current.value);
    setUserPassword(passwordRef.current?.value);
    getToken();
  };
  //handlePayment
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const { nonce } = await instance.requestPaymentMethod();

      const { data } = await axios.post(`/api/auth/register`, {
        nonce,
        email,
        username,
        password,
        selectedPlan,
        amount,
      });
      toast.success("Payment Completed Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register">
      <div className="wrapper">
        <div to="/" className="title">
          MovieBuzz
        </div>
        <Link to="/login" className="link">
          <span className="loginbutton">Sign In</span>
        </Link>
      </div>
      <div className="register-container">
        <h1>Unlimited movies, Tv shows, and more</h1>
        <h2>Watch anywhere. cancel anytime.</h2>
        {paymentMode ? (
          <div className="payment">
            <div className="payment-customize">
              <DropIn
                options={{
                  authorization: clientToken,
                }}
                onInstance={(instance) => setinstance(instance)}
              />
              <div className="amount">
                <input value={" ₹ " + amount} disabled />
              </div>
            </div>
            <button className="payment-btn" onClick={handlePayment}>
              Register
            </button>
          </div>
        ) : !email ? (
          <div className="input extra-input">
            <p>
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>
            <input
              type="email"
              placeholder="Email address"
              ref={emailRef}
              required
            />
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          <form className="input">
            <input
              type="text"
              placeholder="Username"
              ref={usernameRef}
              required
            />
            <input
              type="password"
              placeholder="Password"
              ref={passwordRef}
              required
            />
            <div className="payment-info">
              <h2>Choose the plan that’s right for you.</h2>
            </div>
            <div className="payment-plan">
              <div
                className={`plan ${selectedPlan === 1 ? "selected" : ""}`}
                onClick={() => handlePlanClick(1, 199)}
              >
                <h3>Basic</h3>
                <p>Good</p>
                <p>₹199</p>
                <p>video: 720p</p>
              </div>
              <div
                className={`plan ${selectedPlan === 2 ? "selected" : ""}`}
                onClick={() => handlePlanClick(2, 499)}
              >
                <h3>Standard</h3>
                <p>Better</p>
                <p>₹499</p>
                <p>video: 1080p</p>
              </div>
              <div
                className={`plan ${selectedPlan === 3 ? "selected" : ""}`}
                onClick={() => handlePlanClick(3, 659)}
              >
                <h3>Premium</h3>
                <p>Best</p>
                <p>₹659</p>
                <p>video: 4k + HDR</p>
              </div>
            </div>
            <button className="registerButton" onClick={paymentStart}>
              Start
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
