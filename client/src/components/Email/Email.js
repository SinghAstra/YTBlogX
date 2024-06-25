import React from "react";
import { Link } from "react-router-dom";
import user from "../../assets/user.png";
import "./Email.css";

const Email = ({ email, handleChange, handleEmailSubmit }) => {
  return (
    <div className="email-login-container">
      <form onSubmit={handleEmailSubmit} className="email-login-form">
        <h1>Login</h1>
        <div className="email-login-avatar-container">
          <img src={user} alt="avatar" className="avatar" />
        </div>
        <div className="input-container">
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
            autoComplete="off"
            id="email"
          />
          <label htmlFor="email">Email</label>
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
        <p className="bottom-text">
          New User ?{" "}
          <Link to="/register" className="bottom-link">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Email;
