import axios from "axios";
import React, { useState } from "react";
import user from "../assets/user.png";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "Mr",
    lastName: "Robot",
    email: "mrrobot@gmail.com",
    password: "Abhay@codeman1",
    picture: "",
    location: "London",
    occupation: "Security Analyst",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log(response.data);
    } catch (error) {
      console.log("Error registering user:", error);
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
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            autoComplete="off"
            id="location"
            required
          />
          <label htmlFor="location">Location</label>
        </div>
        <div className="input-container">
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            autoComplete="off"
            id="occupation"
            required
          />
          <label htmlFor="occupation">Occupation</label>
        </div>
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
