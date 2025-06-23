import "./Header.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onSideBarOpen: () => void;
  isLogged: boolean;
  windowWidth: () => { width: number };
}

const Header: React.FC<HeaderProps> = ({
                                         onSideBarOpen,
                                         isLogged,
                                         windowWidth,
                                       }) => {
  const location = useLocation();
  const { width } = windowWidth();
  const isList = location.pathname === "/list";
  const isSavedList = location.pathname === "/saved-list";

  return (
    <header className={"header"}>
      <div className="header__container">
        {isLogged ? (
          width >= 1280 ? (
            <nav className="header__nav">
              <Link
                to="/list"
                className={`header__link header__link_type_list${isList ? " header__link_active" : ""}`}
              >
                Объявления
              </Link>
              <Link
                to="/saved-list"
                className={`header__link header__link_type_list${isSavedList ? " header__link_active" : ""}`}
              >
                Сохранённое
              </Link>
            </nav>
          ) : (
            <button
              type="button"
              className="header__button"
              onClick={onSideBarOpen}
            ></button>
          )
        ) : (
          <nav className="header__nav">
            <Link
              to="/signup"
              className="header__link header__link_type_register"
            >
              Регистрация
            </Link>
            <Link
              to="/signin"
              className="header__link header__link_type_signin"
            >
              Войти
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;