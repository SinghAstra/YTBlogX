import React, { useState } from "react";
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

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1>Register</h1>
        <div className="input-container">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
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
            required
          />
          <label htmlFor="lastName">Last Name</label>
        </div>
        <div className="input-container">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            required
          />
          <label htmlFor="password">Password</label>
        </div>
        {/* <div className="input-container">
          <input
            type="file"
            id="picture"
            name="picture"
            onChange={(e) =>
              setFormData({ ...formData, picture: e.target.files[0] })
            }
          />
        </div> */}
        <div className="input-container">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
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
