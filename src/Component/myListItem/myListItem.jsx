import "./myListItem.scss";
import { useContext, useEffect, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { Link } from "react-router-dom";
import { removingMovieFromMyList, toggleLikeMovie } from "../../context/myListContext/apiCalls";
import { MyListContext } from "../../context/myListContext/MyListContext";
import { AuthContext } from "../../context/authContext/AuthContext";

const MyListItem = ({ index, item, isLike }) => {
  const [movie, setMovie] = useState({});
  const [isRemoveMenuOpen, setRemoveMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { myList,dispatch } = useContext(MyListContext);

  const toggleRemoveMenu = () => {
    setRemoveMenuOpen(!isRemoveMenuOpen);
  };

  const removeMovie = async () => {
    
    if (isLike) {
      await toggleLikeMovie({listId:myList._id,movieId:movie._id,isLike:isLike},dispatch);
    } else {
      await removingMovieFromMyList(
        { userId: user._id, movieId: movie._id },
        dispatch
      );
    }
    setRemoveMenuOpen(!isRemoveMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setRemoveMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
        <div className="movie-title">{movie.title}</div>
      </Link>
      <div className="menu-icon" ref={dropdownRef} onClick={toggleRemoveMenu}>
        <MoreVertIcon className="icon" />
      </div>
      {isRemoveMenuOpen && (
        <div className="remove-list">
          <ul style={{ padding: "0px",margin:"0px" }}>
            <li style={{ listStyle: "none" }} onClick={removeMovie}>
              Remove
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyListItem;
