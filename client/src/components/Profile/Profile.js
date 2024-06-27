import React, { useState } from "react";
import defaultBannerImage from "../../assets/bannerImage.jpg";

const Profile = () => {
  const [bannerImage, setBannerImage] = useState(defaultBannerImage);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const bannerURL = URL.createObjectURL(file);
      setBannerImage(bannerURL);
      //   setFormData({
      //     ...formData,
      //     banner: file,
      //   });
    }
  };
  return (
    <div>
      <div className="profile-banner">
        <img src={bannerImage} alt="Banner" />
      </div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default Profile;
