import React from "react";
import "./empty.scss";
import { Link } from "react-router-dom";

const Empty = () => {
  return (
    <div className="empty">
        <div className="top">
          <div className="wrapper">
          <Link to="/" className="link title">
              MovieBuzz
          </Link>
          </div>
      </div>
      <div className="main">
        <p className="main-heading">404</p>
        <p className="main-title">Lost Your Way ?</p>
        <p className="main-content">Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
        <p className="main-content">To return to Netflix Homepage click on button below.</p>
        <Link to="/" className="link empty-btn">
              MovieBuzz Home
        </Link>
      </div>
    </div>
  );
};

export default Empty;
