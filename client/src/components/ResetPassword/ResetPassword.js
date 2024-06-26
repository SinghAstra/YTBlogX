import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation } from "react-router-dom";
import user from "../../assets/user.png";
import "./ResetPassword.css";

const ResetPassword = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // if (!location.state) {
  //   return <Navigate to="/login" />;
  // }

  // const { userInfo } = location.state;

  const userInfo = {
    _id: "667b8a3d7b39302779667216",
    firstName: "Abhay",
    lastName: "Pratap Singh",
    email: "abhaypratapsinghwd@gmail.com",
    picturePath: "public\\assets\\mr-robot-hoodie.jpg",
    friends: [],
    viewedProfile: 1005,
    impressions: 2395,
    createdAt: "2024-06-26T03:25:49.722Z",
    updatedAt: "2024-06-26T06:01:12.264Z",
    __v: 0,
    isOtpVerified: true,
  };

  const avatarSrc = userInfo.picturePath
    ? `http://localhost:5000/assets/${userInfo.picturePath
        .replace(/\\/g, "/")
        .split("/")
        .pop()}`
    : user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    const inputContainer = e.target.closest(".input-container");
    if (value.trim() !== "") {
      inputContainer.classList.add("has-text");
    } else {
      inputContainer.classList.remove("has-text");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const lengthRegex = /.{8,}/;
  const numberRegex = /\d/;
  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  const isPasswordValid = () => {
    const { password } = formData;
    return (
      lengthRegex.test(password) &&
      numberRegex.test(password) &&
      upperCaseRegex.test(password) &&
      lowerCaseRegex.test(password) &&
      specialCharRegex.test(password)
    );
  };

  const validatePassword = () => {
    const { password, confirmPassword } = formData;
    if (!isPasswordValid()) {
      toast.error("Password does not meet all conditions");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/user/resetPassword",
          {
            email: userInfo.email,
            newPassword: formData.password,
          }
        );
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleResetPassword} className="reset-password-form">
        <h1>Reset Password</h1>
        {(isPasswordValid() || !formData.password) && (
          <div className="reset-password-avatar-container">
            <img src={avatarSrc} alt="avatar" className="avatar" />
          </div>
        )}
        {formData.password && !isPasswordValid() && (
          <div className="password-conditions">
            Password must
            <br />
            be at least 8 characters long:{" "}
            {lengthRegex.test(formData.password) ? (
              <span className="condition valid">&#10004;</span>
            ) : (
              <span className="condition invalid">&#10006;</span>
            )}
            <br />
            contain at least one number:{" "}
            {numberRegex.test(formData.password) ? (
              <span className="condition valid">&#10004;</span>
            ) : (
              <span className="condition invalid">&#10006;</span>
            )}
            <br />
            contain at least one uppercase letter:{" "}
            {upperCaseRegex.test(formData.password) ? (
              <span className="condition valid">&#10004;</span>
            ) : (
              <span className="condition invalid">&#10006;</span>
            )}
            <br />
            contain at least one lowercase letter:{" "}
            {lowerCaseRegex.test(formData.password) ? (
              <span className="condition valid">&#10004;</span>
            ) : (
              <span className="condition invalid">&#10006;</span>
            )}
            <br />
            contain at least one special character:{" "}
            {specialCharRegex.test(formData.password) ? (
              <span className="condition valid">&#10004;</span>
            ) : (
              <span className="condition invalid">&#10006;</span>
            )}
          </div>
        )}
        <div className="input-container">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            id="password"
          />
          <label htmlFor="password">Password</label>
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="input-icon"
            onClick={togglePasswordVisibility}
          />
        </div>
        {formData.password && isPasswordValid() && (
          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="off"
              id="confirmPassword"
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="input-icon"
              onClick={toggleConfirmPasswordVisibility}
            />
          </div>
        )}
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
