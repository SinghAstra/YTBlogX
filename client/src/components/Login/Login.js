import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Email from "../Email/Email";
import Password from "../Password/Password";

const Login = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [userInfo, setUserInfo] = useState({});
  // const { handleLogIn } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //  Implement Validate Email
  const validateEmail = (email) => {};

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
        const response = await axios.get("http://localhost:5000/api/user/", {
          email,
        });
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
          "http://localhost:5000/api/user/login",
          {
            email,
            password,
          }
        );
        console.log("response: ", response);
        // handleLogIn(response.data.token);
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
