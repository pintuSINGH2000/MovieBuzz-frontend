import "./listitem.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { MyListContext } from "../../context/myListContext/MyListContext";
import CloseIcon from "@mui/icons-material/Close";
import {
  addingMovieTOMyList,
  removingMovieFromMyList,
  toggleDislikeMovie,
  toggleLikeMovie,
} from "../../context/myListContext/apiCalls";

const Listitem = ({ index, item, myList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [movies, setMovie] = useState({});
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(MyListContext);
  const hoverRef = useRef(null);
  const [favourite, setFavourite] = useState(false);
  const [like, setLike] = useState(false);
  const [disLike, setDisLike] = useState(false);
  const navigate = useNavigate();
  const [isLike,setIsLike] = useState(false);
  const [isDisLike,setIsDisLike] = useState(false);

  const toggleMovieInList = async (movie) => {
    if (favourite) {
      await removingMovieFromMyList(
        { userId: user._id, movieId: movie._id },
        dispatch
      );
      setFavourite(false);
    } else {
      await addingMovieTOMyList(
        { userId: user._id, movieId: movie._id, isSeries: movie.isSeries },
        dispatch
      );
      setFavourite(true);
    }
  };

  useEffect(() => {
    if (myList && movies._id) {
      const isFavourite = myList?.movies?.some(
        (listItem) => listItem && listItem.movie === movies._id
      );
      setFavourite(isFavourite);
      const isLiked = myList?.likeMovies?.some(
        (likemovie) => likemovie === movies._id
      );
      setLike(isLiked);
      const isDisLiked = myList?.dislikeMovies?.some(
        (dislikemovie) => dislikemovie === movies._id
      );
      setDisLike(isDisLiked);
    }
  }, [myList, movies._id]);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get("/api/movie/find/" + item);
        setMovie(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [item]);

  //toggle Like and disLike
  const toggleMovieLike = async (movie) => {
    if(isLike||isDisLike) return ;
    setIsLike(true);
    try {
      if (like) {
        setLike(false);
        setMovie({ ...movies, likes: Math.max(movies.likes - 1,0) });
      } else {
        setMovie((prevMovie) => ({
          ...prevMovie,
          likes: prevMovie.likes + 1,
        }));
        setLike(true);
        if (disLike) {
          setMovie((prevMovie) => ({
            ...prevMovie,
            dislikes: Math.max(prevMovie.dislikes - 1,0),
          }));
          setDisLike(false);
        }
      }
      await toggleLikeMovie(
        { listId: myList._id, movieId: movie._id, isLike: like },
        dispatch
      );
      setIsLike(false);
      
    } catch (error) {
      setIsLike(false);
      console.log(error);
    }
  };

  const toggleMovieDisLike = async (movie) => {
    if(isDisLike||isLike) return;
    setIsDisLike(true);
    try {
      if (disLike) {
        setDisLike(false);
        setMovie((prevMovie) => ({
          ...prevMovie,
          dislikes: Math.max(prevMovie.dislikes - 1,0),
        }));
      } else {
        setMovie((prevMovie) => ({
          ...prevMovie,
          dislikes: prevMovie.dislikes + 1,
        }));
        setDisLike(true);
        if (like) {
          setMovie((prevMovie) => ({
            ...prevMovie,
            likes: Math.max(prevMovie.likes - 1,0),
          }));
          setLike(false);
        }
      }
      await toggleDislikeMovie(
        { listId: myList._id, movieId: movie._id, isDislike: disLike },
        dispatch
      );
      setIsDisLike(false);
     
    } catch (error) {
      setIsDisLike(false);
      console.log(error);
    }
  };

  const handleTouch = (isClose) => {
      setIsHovered(true);
  };

  const handleTouchEvent = (event) => {
    if (
      hoverRef.current &&
      !hoverRef.current.contains(event.target) 
    ) {
      setIsHovered(false);
    }
  };
  useEffect(() => {

    if (isHovered) {
      document.addEventListener('click', handleTouchEvent);
    }
    return () => {
      document.removeEventListener("click", handleTouchEvent);
    };
  }, [isHovered]);

  return (
    <>
      <div>
        <div
          className={`listItem ${isHovered ? "touch" : ""}`}
          style={{ left: isHovered && index * 225 - 50 + index * 2.5  }}
          onClick={() => handleTouch(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={hoverRef}
        >
          
          <div className="close-icon" onClick={(e) => {e.stopPropagation();setIsHovered(false)}}>
            <CloseIcon className="icon" />
          </div>

          <img src={movies.imgSm} width="100%" alt="img" />
          {isHovered && (
            <>
              <Link
                to={{ pathname: "/single-movie/" + movies._id }}
                className="link"
              >
                <video src={movies.trailer} autoPlay={true} loop />
              </Link>
              <div className="itemInfo">
                <div className="icons">
                  <div className="list-icon">
                    <PlayArrowIcon
                      className="icon"
                      onClick={(e) => {
                        navigate("/watch", { state: { movie: movies } });
                      }}
                    />
                  </div>
                  <div
                    onClick={() => toggleMovieInList(movies)}
                    className="list-icon"
                  >
                    {favourite ? (
                      <BookmarkIcon className="icon" />
                    ) : (
                      <BookmarkBorderIcon className="icon" />
                    )}
                  </div>
                  <div
                    onClick={(e) => {e.stopPropagation();toggleMovieLike(movies);}}
                    className="list-icon"
                  >
                    {like ? (
                      <ThumbUpIcon className="icon" />
                    ) : (
                      <ThumbUpOutlinedIcon className="icon" />
                    )}{" "}
                    {movies.likes}
                  </div>
                  <div
                    onClick={(e) => {e.stopPropagation();toggleMovieDisLike(movies);}}
                    className="list-icon"
                  >
                    {disLike ? (
                      <ThumbDownIcon className="icon" />
                    ) : (
                      <ThumbDownOutlinedIcon className="icon" />
                    )}{" "}
                    {movies.dislikes}
                  </div>
                </div>

                <div className="itemInfoTop">
                  <span>{movies.duration}</span>{isHovered}
                  <span className="limit">+{movies.limit}</span>
                  <span>{movies.year}</span>
                </div>
                <div className="desc">{movies.desc}</div>
                <div className="genre">{movies.genre}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Listitem;
