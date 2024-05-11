import "./singleMovieItem.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SingleMovieItem = ({ index, item }) => {
  const [movie, setMovie] = useState({});

  
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

  return (
    <div className="movie-list">
      <Link
        to={{ pathname: "/single-movie/"+movie._id }}
        className="link"
      >
        <img src={movie.imgSm} width="100%" alt="movie" />
      </Link>
    </div>
  );
};

export default SingleMovieItem;
