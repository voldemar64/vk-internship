import "./Register.css";
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useFormWithValidation } from "../../utils/formValidator";

interface RegisterProps {
  submit: (
    name: string,
    surname: string,
    phone: string,
    email: string,
    password: string,
  ) => void;
  loggedIn: boolean;
}

const Register: React.FC<RegisterProps> = ({ submit, loggedIn }) => {
  const validateName = (name: string) => {
    if (!name) return "Введите имя.";
    return "";
  };

  const validateSurname = (surname: string) => {
    if (!surname) return "Введите фамилию.";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Введите пароль.";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email) return "Введите адрес электронной почты.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Введите корректный адрес электронной почты.";
  };

  const validatePhone = (phone: string) => {
    if (!phone) return "Введите номер телефона.";
    const phoneRegex = /^8\d{10}$/;
    return phoneRegex.test(phone)
      ? ""
      : "Введите номер телефона в формате 8XXXXXXXXXX.";
  };

  const validateConfirmPassword = (confirmPassword: string, values: any) => {
    if (!confirmPassword) return "Введите подтверждение пароля.";
    return confirmPassword === values.password ? "" : "Пароли не совпадают.";
  };

  const { values, errors, handleChange, isValid } = useFormWithValidation({
    name: validateName,
    surname: validateSurname,
    password: validatePassword,
    email: validateEmail,
    phone: validatePhone,
    confirmPassword: (confirmPassword: string) =>
      validateConfirmPassword(confirmPassword, values),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      submit(
        values.name,
        values.surname,
        values.phone,
        values.email,
        values.password,
      );
    }
  };

  return !loggedIn ? (
    <section className="register register_type_big">
      <Link className="register__logo" to="/" />
      <h2 className="register__title">Добро пожаловать!</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__columns">
          <div className="register__column">
            <h3 className="register__column-title">О вас:</h3>
            <div className="register__container">
              <label className="register__label">Имя</label>
              <input
                name="name"
                required
                type="text"
                className="register__input"
                onChange={handleChange}
              />
              {errors.name && (
                <span className="register__error">{errors.name}</span>
              )}
            </div>
            <div className="register__container">
              <label className="register__label">Фамилия</label>
              <input
                name="surname"
                required
                type="text"
                className="register__input"
                onChange={handleChange}
              />
              {errors.surname && (
                <span className="register__error">{errors.surname}</span>
              )}
            </div>
            <div className="register__container">
              <label className="register__label">Телефон</label>
              <input
                name="phone"
                required
                type="tel"
                className="register__input"
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="register__error">{errors.phone}</span>
              )}
            </div>
          </div>
          <div className="register__column">
            <h3 className="register__column-title">Учётные данные:</h3>
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
            <div className="register__container">
              <label className="register__label">Повторить пароль</label>
              <input
                name="confirmPassword"
                required
                type="password"
                className="register__input"
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="register__error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          className={`register__button${!isValid ? " register__button_disabled" : ""}`}
          type="submit"
          disabled={!isValid}
        >
          Зарегистрироваться
        </button>
      </form>
      <p className="register__text">
        Уже зарегистрированы?
        <Link to="/signin" className="register__link">
          Войти
        </Link>
      </p>
    </section>
  ) : (
    <Navigate to="/list" />
  );
};

export default Register;