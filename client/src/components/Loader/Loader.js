import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="content">
        {[...Array(16)].map((_, b) => (
          <div key={b} className="cuboid">
            {[...Array(6)].map((_, s) => (
              <div key={s} className="side"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
