import "./SideBar.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const location = useLocation();
  const isList = location.pathname === "/list";
  const isSavedList = location.pathname === "/saved-list";

  return (
    <section className={`side-bar${props.isOpen ? " side-bar_visible" : ""}`}>
      <button
        type="button"
        className="side-bar__close"
        onClick={props.onClose}
      />
      <div className="side-bar__container">
        <Link
          className={`side-bar__button${isList ? " side-bar__button_active" : ""}`}
          to="/list"
          onClick={props.onClose}
        >
          Объявления
        </Link>
        <Link
          className={`side-bar__button${isSavedList ? " side-bar__button_active" : ""}`}
          to="/saved-list"
          onClick={props.onClose}
        >
          Сохранённые объявления
        </Link>
      </div>
    </section>
  );
};

export default SideBar;