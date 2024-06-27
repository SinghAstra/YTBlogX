import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import Email from "../Email/Email";
import Password from "../Password/Password";

const Login = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [userInfo, setUserInfo] = useState({});
  const { saveJWTToken } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const inputContainer = e.target.closest(".input-container");
    if (value.trim() !== "") {
      inputContainer.classList.add("has-text");
    } else {
      inputContainer.classList.remove("has-text");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    const lengthRegex = /.{8,}/;
    const numberRegex = /\d/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (
      !lengthRegex.test(password) ||
      !numberRegex.test(password) ||
      !upperCaseRegex.test(password) ||
      !lowerCaseRegex.test(password) ||
      !specialCharRegex.test(password)
    ) {
      toast.error("Incorrect Password");
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;
    if (validateEmail(email)) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/fetchUserInfo",
          {
            email,
          }
        );
        console.log("response.data.user is ", response.data.user);
        setUserInfo(response.data.user);
        setStep(2);
      } catch (error) {
        console.log("error is ", error);
        toast.error(error.response.data.message);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (validatePassword(password)) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email,
            password,
          }
        );
        saveJWTToken(response.data.token);
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div>
      {step === 1 ? (
        <Email
          email={formData.email}
          handleChange={handleChange}
          handleEmailSubmit={handleEmailSubmit}
        />
      ) : (
        <Password
          userInfo={userInfo}
          password={formData.password}
          handleChange={handleChange}
          handlePasswordSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
};

export default Login;
