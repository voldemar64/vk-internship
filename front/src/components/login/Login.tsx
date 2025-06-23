import "../register/Register.css";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useFormWithValidation } from "../../utils/formValidator";

interface LoginProps {
  submit: (email: string, password: string) => void;
  loggedIn: boolean;
}

const Login: React.FC<LoginProps> = ({ submit, loggedIn }) => {
  const validateEmail = (email: string): string => {
    if (!email) return "Введите адрес электронной почты.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Введите корректный адрес электронной почты.";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Введите пароль.";
    return "";
  };

  const { values, errors, handleChange, isValid } = useFormWithValidation({
    email: validateEmail,
    password: validatePassword,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isValid) {
      submit(values.email, values.password);
    }
  }

  return !loggedIn ? (
    <section className="register">
      <Link className="register__logo" to="/" />
      <h2 className="register__title">Рады видеть!</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__columns">
          <div className="register__column">
            <div className="register__container">
              <label className="register__label">E-mail</label>
              <input
                name="email"
                required
                type="email"
                className="register__input"
                onChange={handleChange}
              />
              {errors.email && (
                <span className="register__error">{errors.email}</span>
              )}
            </div>
            <div className="register__container">
              <label className="register__label">Пароль</label>
              <input
                name="password"
                required
                type="password"
                className="register__input"
                onChange={handleChange}
              />
              {errors.password && (
                <span className="register__error">{errors.password}</span>
              )}
            </div>
          </div>
        </div>
        <button
          className={`register__button register__button_type_big${
            !isValid ? " register__button_disabled" : ""
          }`}
          type="submit"
          disabled={!isValid}
        >
          Войти
        </button>
      </form>
      <p className="register__text">
        Ещё не зарегистрированы?{" "}
        <Link to="/signup" className="register__link">
          Регистрация
        </Link>
      </p>
    </section>
  ) : (
    <Navigate to="/list" />
  );
};

export default Login;