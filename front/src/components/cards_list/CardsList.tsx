import Card from "../card/Card";
import Preloader from "../preloader/Preloader";
import "./CardsList.css";
import React from "react";

interface CardsListProps {
  posts: {
    _id: string;
    name: string;
    url: string;
    likes: string[];
    owner: string;
  }[];
  addPosts: () => void;
  onSave: (card: any) => void;
  listLength: number;
}

const CardsList: React.FC<CardsListProps> = ({
                                                         posts,
                                                         addPosts,
                                                         onSave,
                                                         listLength,
                                                       }) => {
  return (
    <section className="posts">
      {posts.length !== 0 ? (
        <ul className="cards">
          {posts
            .map((card) => {
              return (
                <Card
                  key={card._id}
                  card={card}
                  onSave={onSave}
                />
              );
            })
            .slice(0, listLength)}
        </ul>
      ) : (
        <></>
      )}
      { posts.length > listLength && <Preloader addPosts={addPosts} /> }
    </section>
  );
};

export default CardsList;