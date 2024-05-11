import React, { useContext, useEffect, useState } from "react";
import "./singleMovie.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Navbar from "../../Component/navbar/Navbar";
import SingleMovieItem from "../../Component/singleMovieItem/singleMovieItem";
import { Button } from "@mui/material";
import { MyListContext } from "../../context/myListContext/MyListContext";
import {
  addingMovieTOMyList,
  getMyList,
  removingMovieFromMyList,
} from "../../context/myListContext/apiCalls";
import { AuthContext } from "../../context/authContext/AuthContext";

const SingleMovie = ({}) => {
  const [content, setContent] = useState({});
  const param=useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {user} = useContext(AuthContext);
  const movie = param.id;
  const [type, setType] = useState(null);
  const [loader, setLoader] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const { myList, dispatch } = useContext(MyListContext);
  const [favourite, setFavourite] = useState(false);

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
    const getRandomList = async () => {
      try {
        const res = await axios.get(
          `/api/movie/similar/${movie}${type ? "?type=" + type : ""}${
            content.genre ? "&genre=" + content.genre : ""
          }`
        );
        setSimilarMovies(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (type && content.genre) getRandomList();
  }, [type, content.genre,movie]);

  useEffect(() => {
    const getSingleMovie = async () => {
      try {
        setLoader(true);
        const res = await axios.get(`/api/movie/find/` + movie);
        setLoader(false);
        setContent(res.data);
        setType(res.data.isSeries ? "series" : "movie");
      } catch (err) {
        setLoader(false);
      }
    };
    getSingleMovie();
  }, [movie]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
          await getMyList(user._id, dispatch);
          const isFavourite = myList?.movies?.some(
            (listItem) => listItem && listItem.movie === movie
          );
          setFavourite(isFavourite);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };
    fetchUserList();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [movie]);

  return (
    <div className="single-movie">
      <Navbar />
      {content ? (
        <>
          <div className="single-movie-main">
            <div className="image-container">
              <img src={content.img} width="100%" alt="img" />
              <div className="gradient-overlay"></div>
            </div>
            <div className="info">
              <img src={content.imgTitle} width="100%" alt="img" />
              <div className="title">{content.title}</div>
              <span className="desc">{content.desc}</span>
              <div className="buttons">
                <button
                  className="play"
                  onClick={(e) => {
                    navigate("/watch", { state: { movie: content } });
                  }}
                >
                  <PlayArrowIcon />
                  <span>Play</span>
                </button>
              </div>
            </div>
          </div>
          <div className="movie-detail">
            <div className="detail-header">
              <div className="title">More Details</div>
              <Button
                className="my-list"
                style={{ backgroundColor: favourite ? "#9a9a9a": "red"  }}
                onClick={() => toggleMovieInList(content)}
              >
                {favourite?"Remove To My List":"Add To My List"}
              </Button>
            </div>

            <div className="movie-desc">Title : {content.title}</div>
            <div className="movie-desc">Description : {content.desc}</div>
            <div className="movie-desc">
              Type : {content.isSeries ? "Series" : "Movie"}
            </div>
            <div className="movie-desc">
              {content.isSeries ? "Episodes" : "Duration"}: {content.duration}
            </div>
            <div className="movie-desc">Genre : {content.genre}</div>
            <div className="movie-desc">U/A : {content.limit}+</div>
            <div className="movie-desc">Year : {content.year}</div>
            <button
              className="mobile-mylist"
              style={{ backgroundColor: favourite ? "#9a9a9a":"red" }}
              onClick={() => toggleMovieInList(content)}
            >
             {favourite?"Remove To My List":"Add To My List"}
            </button>
          </div>
          <div className="similar-movies">
         <div className="title">
           Similar {type === "movie" ? "Movies" : "Series"}
         </div>
         <div className="container">
           {similarMovies?.map((item, index) => (
             <SingleMovieItem key={index} item={item._id} />
           ))}
         </div>
       </div>
        </>
      ) : (
        <div className="empty">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default SingleMovie;
