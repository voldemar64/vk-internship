import "./NotFound.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  return (
    <section className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__subtitle">Страница не найдена</p>
      <Link className="not-found__link" to="#" onClick={goBack}>
        Назад
      </Link>
    </section>
  );
};

export default NotFound;