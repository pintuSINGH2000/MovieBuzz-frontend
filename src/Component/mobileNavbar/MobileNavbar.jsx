import React, { useContext, useEffect, useState } from "react";
import "./mobileNavbar.scss";
import { AuthContext } from "../../context/authContext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { logout } from "../../context/authContext/AuthAction";

const MobileNavbar = ({ toggle,visible }) => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  let cancelToken;

  const setVisibility = () => {
    toggle(!visible);
  }
  const searchMovies = async () => {
    if (cancelToken) {
      cancelToken.cancel("New search initiated");
    }
    cancelToken = axios.CancelToken.source();

    try {
      const res = await axios.get(`/api/movie/search?query=${query}`, {
        cancelToken: cancelToken.token,
      });
      setMovies(res?.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(error);
      } else {
        console.error("Error searching for movies: ", error);
      }
    }
  };
  useEffect(() => {
    searchMovies();
    return () => {
      if (cancelToken) {
        cancelToken.cancel("Component unmounted");
      }
    };
  }, [query]);


  return (
    <div className="m-navbar">
        <div className="close-icon">
        <CloseIcon
        className="icon "
        onClick={() => {
         setVisibility();
        }}
      />
        </div>
     
      <div className="m-profile">
        <img
          src={user.profilePic ? user.profilePic : "../image/user.png"}
          alt="img"
        />
        <div>Hi {user.name ? user.name : "Buddy"}</div>
      </div>
      <div className="search-container">
        <div className="search-input">
          <input
            type="text"
            placeholder="Search for a movie"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span>
            <SearchIcon className="icon" onClick={() => searchMovies()} />
          </span>
        </div>
        {query && (
          <ul className="movie-dropdown">
            {movies.length > 0 ? (
              movies?.map((movie) => (
                <li key={movie._id} onClick={(e) => {toggle(!visible);navigate("/single-movie/"+ movie._id)}}>
                  {movie.title}
                </li>
              ))
            ) : (
              <span className="empty-search">No Movie Found</span>
            )}
          </ul>
        )}
      </div>
      <Link to="/movies" className="link">
        <span className="navLink">Movies</span>
      </Link>
      <Link to="/series" className="link">
        <span className="navLink">Series</span>
      </Link>
      <Link to="/popular" className="link">
        <span>New and Popular</span>
      </Link>
      <Link to="/mylist" className="link">
        <span>My List</span>
      </Link>
      <Link to="/kid" className="link">
        <span>Kid</span>
      </Link>
      <Link to="/setting" className="link">
        <span>Setting</span>
      </Link>
      <div className="link" onClick={() => dispatch(logout())}>
        Logout
      </div>
    </div>
  );
};

export default MobileNavbar;
