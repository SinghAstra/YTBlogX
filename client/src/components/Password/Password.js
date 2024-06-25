import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import user from "../../assets/user.png";
import "./Password.css";

const Password = ({
  userInfo,
  password,
  handlePasswordSubmit,
  handleChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-login-container">
      <form onSubmit={handlePasswordSubmit} className="password-login-form">
        <h1>Login</h1>
        <div className="password-login-avatar-container">
          <img src={user} alt="avatar" className="avatar" />
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
      </form>
    </div>
  );
};

export default Password;
