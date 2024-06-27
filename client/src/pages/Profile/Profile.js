import React, { useState } from "react";
import bannerImage from "../../assets/bannerImage.jpg";
import "./Profile.css";

const Profile = () => {
  const [bannerURL, setBannerURL] = useState();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const bannerUrl = URL.createObjectURL(file);
      setBannerURL(bannerUrl);
      // setFormData({
      //   ...formData,
      //   banner: file,
      // });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-banner-label-container">
        <label htmlFor="banner-upload">
          <img
            src={bannerURL || bannerImage}
            alt="Banner"
            className="profile-banner"
          />
        </label>
      </div>
      <input
        id="banner-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="banner-upload-input"
      />
    </div>
  );
};

export default Profile;
