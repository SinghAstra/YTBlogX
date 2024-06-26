import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import user from "../../assets/user.png";
import { AuthContext } from "../../context/AuthContext";
import "./Password.css";

const Password = ({
  userInfo,
  password,
  handlePasswordSubmit,
  handleChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { handleSendOTP } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (shouldNavigate) {
      navigate("/verify", {
        state: {
          userInfo,
        },
      });
    }
  }, [shouldNavigate, navigate, userInfo]);

  const handleResetPasswordClick = () => {
    handleSendOTP(userInfo.email);
    setShouldNavigate(true);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const avatarSrc = userInfo.picturePath
    ? `http://localhost:5000/assets/${userInfo.picturePath
        .replace(/\\/g, "/")
        .split("/")
        .pop()}`
    : user;

  return (
    <div className="password-login-container">
      <form onSubmit={handlePasswordSubmit} className="password-login-form">
        <h1>Login</h1>
        <div className="password-login-avatar-container">
          <img src={avatarSrc} alt="avatar" className="avatar" />
        </div>
        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleChange}
            autoComplete="off"
            id="password"
          />
          <label htmlFor="password">Password</label>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="input-icon"
            onClick={toggleShowPassword}
          />
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
        <p className="bottom-text">
          Forgot Password ?{" "}
          <span onClick={handleResetPasswordClick} className="bottom-span">
            Reset Password
          </span>
        </p>
      </form>
    </div>
  );
};

export default Password;
