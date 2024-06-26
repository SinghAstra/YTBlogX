import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import user from "../../assets/user.png";
import { AuthContext } from "../../context/AuthContext";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const location = useLocation();
  const { handleSendOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    otp: "",
  });
  if (!location.state) {
    return <Navigate to="/login" />;
  }
  const { userInfo } = location.state;

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

  const validateOTP = () => {
    const { otp } = formData;

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error("Invalid OTP");
      return false;
    }

    return true;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const { otp } = formData;
    if (validateOTP()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/verifyOTP",
          {
            email: userInfo.email,
            otp,
          }
        );
        toast.success(response.data.message);
        navigate("/reset-password", {
          state: {
            userInfo,
          },
        });
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleResendEmail = () => {
    handleSendOTP(userInfo.email);
  };

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
          <input
            type="text"
            name="otp"
            id="otp"
            value={formData.otp}
            onChange={handleChange}
          />
          <label htmlFor="otp">OTP</label>
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
        <p className="bottom-text">
          Email Not Sent ?{" "}
          <span onClick={handleResendEmail} className="bottom-link">
            {" "}
            Resend Email
          </span>
        </p>
      </form>
    </div>
  );
};

export default VerifyOTP;
