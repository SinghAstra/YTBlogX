import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import user from "../../assets/user.png";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) {
    return <Navigate to="/" />;
  }
  const { userInfo } = location.state;

  const handleVerifyOTP = (e) => {
    e.preventDefault();
  };

  const avatarSrc = userInfo.picturePath
    ? `http://localhost:5000/assets/${userInfo.picturePath
        .replace(/\\/g, "/")
        .split("/")
        .pop()}`
    : user;

  return (
    <div className="verify-otp-container">
      <form onSubmit={handleVerifyOTP} className="verify-otp-form">
        <h1>Verify OTP</h1>
        <div className="verify-otp-avatar-container">
          <img src={avatarSrc} alt="avatar" className="avatar" />
        </div>
        <div className="otp-instruction-container">
          <p className="otp-instruction">Enter the OTP sent to your email</p>
          <span className="user-mail-link">{userInfo.email}</span>
        </div>
        <div className="input-container">
          <input type="text" name="otp" id="otp" />
          <label htmlFor="otp">OTP</label>
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
