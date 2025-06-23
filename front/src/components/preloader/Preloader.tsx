import "./Preloader.css";
import React from "react";

interface PreloaderProps {
  addPosts: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ addPosts }) => {
  return (
    <div className="preloader">
      <button className="preloader__button" onClick={addPosts}>
        Ещё
      </button>
    </div>
  );
};

export default Preloader;