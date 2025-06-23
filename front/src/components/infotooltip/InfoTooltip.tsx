import "./InfoTooltip.css";
import React from "react";
import defaultImage from "../../images/cross.svg";

interface InfoTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: (_: React.MouseEvent<Element, MouseEvent>) => void;
  photo: string;
  title: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onOverlayClick,
                                                   photo,
                                                   title,
                                                 }) => {
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <article
      className={`popup${isOpen ? ` popup_opened popup_auto-close` : ""}`}
      onClick={onOverlayClick}
    >
      <div className="popup__container">
        <img
          src={photo || defaultImage}
          alt="Картинка"
          className="popup__photo"
        />
        <h2 className="popup__title popup__title_info">{title}</h2>
        <button
          type="button"
          className="popup__close-button"
          onClick={onClose}
        />
      </div>
    </article>
  );
};

export default InfoTooltip;