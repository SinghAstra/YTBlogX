import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import user from "../assets/user.png";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "Mr",
    lastName: "Robot",
    email: "mrrobot@gmail.com",
    password: "Abhay@codeman1",
    picture: "",
    confirmPassword: "Abhay@codeman1",
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const pictureUrl = URL.createObjectURL(file);
      setProfilePicture(pictureUrl);
      setFormData({
        ...formData,
        picture: file,
      });
    }
  };

  const validateFirstName = (firstName) => {
    const nameRegex = /^[A-Za-z]{2,}$/;
    if (!firstName || !nameRegex.test(firstName)) {
      toast.error("Invalid First Name");
      return false;
    }
    return true;
  };

  const validateLastName = (lastName) => {
    const nameRegex = /^[A-Za-z]{2,}$/;
    if (!lastName || !nameRegex.test(lastName)) {
      toast.error("Invalid Last Name");
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return false;
    }
    return true;
  };

  const validatePicture = (picture) => {
    if (!picture) {
      toast.error("Please upload a profile picture.");
      return false;
    }
    return true;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  const validateFormData = () => {
    const { firstName, lastName, email, password, picture, confirmPassword } =
      formData;

    return (
      validateFirstName(firstName) &&
      validateLastName(lastName) &&
      validateEmail(email) &&
      validatePassword(password) &&
      validateConfirmPassword(password, confirmPassword) &&
      validatePicture(picture)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Register</h1>
        <div className="avatar-container">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="fileInput"
            onChange={handlePictureChange}
          />
          <label htmlFor="fileInput">
            <div className="profile-picture-container">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="profile-picture"
                />
              ) : (
                <img
                  src={user}
                  alt="Profile"
                  className="profile-picture-placeholder"
                />
              )}
            </div>
          </label>
        </div>
        <div className="input-row">
          <div className="input-container">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="off"
              id="firstName"
              required
            />
            <label htmlFor="firstName">First Name</label>
          </div>
          <div className="input-container">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="off"
              id="lastName"
              required
            />
            <label htmlFor="lastName">Last Name</label>
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            id="email"
            required
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-container">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            id="password"
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        <div className="input-container">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="off"
            id="confirmPassword"
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
