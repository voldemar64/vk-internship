import "./Card.css";
import React from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

interface CardProps {
  key: string;
  card: {
    _id: string;
    owner: string;
    name: string;
    url: string;
    likes: string[];
  };
  onSave: (card: any) => void;
}

const Card: React.FC<CardProps> = ({
                                     key,
                                     card,
                                     onSave,
                                   }) => {
  const currentUser = React.useContext(CurrentUserContext);

  const isLiked = card.likes.some((i) => i === currentUser!._id);
  const cardLikeButtonClassName = `card__like-button${isLiked ? " card__like-button_active" : ""}`;


  function handleLikeClick() {
    onSave(card);
  }

  return (
    <li className="card" key={key}>
      <img
        src={card.url}
        alt={card.name}
        className="card__photo"
      />
      <button
        type="button"
        className={cardLikeButtonClassName}
        onClick={handleLikeClick}
      ></button>
    </li>
  );
};

export default Card;