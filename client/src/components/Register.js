import React, { useState } from "react";
import user from "../assets/user.png";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    picture: "",
    location: "",
    occupation: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  console.log("profilePicture is ", profilePicture);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
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

// {/* <div className="input-container">
//   <input
//     type="file"
//     id="picture"
//     name="picture"
//     onChange={(e) =>
//       setFormData({ ...formData, picture: e.target.files[0] })
//     }
//   />
// </div> */}
