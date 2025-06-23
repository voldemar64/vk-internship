import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="loader__container">
        <span className="loader__round"></span>
      </div>
    </div>
  );
};

export default Loader;