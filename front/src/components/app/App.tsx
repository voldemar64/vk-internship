import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import Header from "../header/Header";
import Login from "../login/Login";
import Register from "../register/Register";
import CardsList from "../cards_list/CardsList"
import NotFound from "../not_found/NotFound";
import InfoTooltip from "../infotooltip/InfoTooltip";
import SideBar from "../sidebar/SideBar";
import ProtectedRoute from "../protected_route/ProtectedRoute";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";

import { useWindowWidth } from "../../utils/windowWidth";
import authApi from "../../utils/authApi";
import mainApi from "../../utils/mainApi";
import likesApi from "../../utils/likesApi";
import catsApi from '../../utils/catsApi';

import tick from "../../images/tick.svg";
import cross from "../../images/cross.svg";

interface User {
  _id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

interface PostSchema {
  _id: string;
  name: string;
  url: string;
  likes: string[];
  owner: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

function App() {
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>("");
  const [popupPhoto, setPopupPhoto] = useState<string>("");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [tokenChecked, setTokenChecked] = useState<boolean>(false);

  const [listLength, setListLength] = useState<number>(5);

  const [localApiPosts, setLocalApiPosts] = useState<PostSchema[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostSchema[]>([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (token) {
      mainApi
        .getUserInfo()
        .then((res: ApiResponse) => {
          if (res) {
            setTokenChecked(true);
            setCurrentUser(res.data);
            setLoggedIn(true);
          } else {
            setTokenChecked(false);
            handleSignOut();
          }
        })
        .catch((err: any) => {
          setTokenChecked(false);
          handleSignOut();
          console.log(`Не получается токен: ${err}`);
        });
    } else {
      setTokenChecked(false);
    }
  }, [token]);

  useEffect(() => {
    if (loggedIn) {
      catsApi
        .getCats()
        .then((res: ApiResponse) => {
          localStorage.setItem("posts", JSON.stringify(res.data));
          const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
          setLocalApiPosts(allPosts);
        })
        .catch((err: any) => console.log(`Ошибка при получении объявлений: ${err}`));
    }
  }, []);

  useEffect(() => {
    if (loggedIn && currentUser && currentUser._id) {
      likesApi
        .getSavedPosts(currentUser._id)
        .then((res: ApiResponse) => {
          const likedPosts = res.data.filter((post: PostSchema) =>
            post.likes.includes(currentUser._id),
          );

          localStorage.setItem("savedPosts", JSON.stringify(likedPosts));
          localStorage.setItem(
            "savedFilteredPosts",
            JSON.stringify(likedPosts),
          );

          setSavedPosts(likedPosts);
        })
        .catch((err: any) =>
          console.log(`Ошибка при получении сохранённых объявлений: ${err}`),
        );
    }
  }, [loggedIn, currentUser]);


  function handleRegister(
    name: string,
    surname: string,
    phone: string,
    email: string,
    password: string,
  ): void {
    authApi
      .register({ name, surname, phone, email, password })
      .then((res: ApiResponse) => {
        if (res.success) {
          setPopupTitle("Вы успешно зарегистрировались!");
          setPopupPhoto(tick);
          handleLogin(email, password);
        } else {
          setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
          setPopupPhoto(cross);
        }
      })
      .catch(() => {
        setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
        setPopupPhoto(cross);
      })
      .finally(() => setIsInfoTooltipOpen(true));
  }

  function handleLogin(email: string, password: string): void {
    authApi
      .authorize({ email, password })
      .then((res: ApiResponse) => {
        if (res.success) {
          localStorage.setItem("jwt", res.data.token);
          setLoggedIn(true);
          navigate("/list");
        } else {
          setPopupTitle("Что-то пошло не так!:(");
          setPopupPhoto(cross);
          setIsInfoTooltipOpen(true);
        }
      })
      .catch(() => {
        setPopupTitle("Что-то пошло не так!:(");
        setPopupPhoto(cross);
        setIsInfoTooltipOpen(true);
      });
  }

  function handleSignOut(): void {
    setTokenChecked(false);
    setLoggedIn(false);
    setCurrentUser(null);
    setLocalApiPosts([]);
    localStorage.removeItem("posts");
    localStorage.removeItem("savedPosts");
    localStorage.removeItem("jwt");
    navigate("/list");
  }

  function handlePostLike(post: PostSchema): void {
    const liked = savedPosts.some((i: PostSchema) => post._id === i._id);

    if (!liked) {
      postsApi
        .likePost(post._id, currentUser!._id)
        .then((res: ApiResponse) => {
          const newSavedPosts = [...savedPosts, res.data];

          setSavedPosts(newSavedPosts);
          setLocalApiPosts((state: PostSchema[]) =>
            state.map((p: PostSchema) =>
              p._id === res.data._id ? res.data : p,
            ),
          );
          setLocalApiPosts((state: PostSchema[]) =>
            state.map((p: PostSchema) =>
              p._id === res.data._id ? res.data : p,
            ),
          );

          localStorage.setItem("savedPosts", JSON.stringify(newSavedPosts));
        })
        .catch((err: string) => console.error(`Ошибка при лайке: ${err}`));
    } else {
      handlePostDislike(post);
    }
  }

  function handlePostDislike(post: PostSchema): void {
    postsApi
      .dislikePost(post._id, currentUser!._id)
      .then((res: ApiResponse) => {
        const newSavedPosts = savedPosts.filter(
          (i: PostSchema) => i._id !== res.data._id,
        );

        setSavedPosts(newSavedPosts);
        setLocalApiPosts((state: PostSchema[]) =>
          state.map((p: PostSchema) => (p._id === res.data._id ? res.data : p)),
        );

        localStorage.setItem("savedPosts", JSON.stringify(newSavedPosts));
      })
      .catch((err: string) => console.error(`Ошибка при дизлайке: ${err}`));
  }

  function addPosts(): void {
    setListLength((prev) => prev + 5);
  }

  function handleInfoTooltip(): void {
    setIsInfoTooltipOpen(false);
  }

  function handleOverlayClick(e: React.MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains("popup")) {
      handleInfoTooltip();
    }
  }

  function handleSideBar(): void {
    setIsSideBarOpen(!isSideBarOpen);
  }

  return (
    <CurrentUserContext.Provider value={currentUser!}>
      <Header
        onSideBarOpen={handleSideBar}
        windowWidth={useWindowWidth}
        isLogged={loggedIn}
      />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route
            path="/list"
            element={
              <CardsList
                posts={localApiPosts}
                addPosts={addPosts}
                onSave={handlePostLike}
                listLength={listLength}
              />}
          />
          <Route
            path="/signin"
            element={<Login submit={handleLogin} loggedIn={loggedIn} />}
          />
          <Route
            path="/signup"
            element={<Register submit={handleRegister} loggedIn={loggedIn} />}
          />
          <Route
            path="/saved-list"
            element={
              <ProtectedRoute
                component={CardsList}
                posts={savedPosts}
                addPosts={addPosts}
                onSave={handlePostLike}
                listLength={listLength}
                loggedIn={loggedIn}
                tokenChecked={tokenChecked}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={handleInfoTooltip}
        onOverlayClick={handleOverlayClick}
        title={popupTitle}
        photo={popupPhoto}
      />

      <SideBar isOpen={isSideBarOpen} onClose={handleSideBar} />
    </CurrentUserContext.Provider>
  );
}

export default App;