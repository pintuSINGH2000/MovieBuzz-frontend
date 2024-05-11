import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./myList.scss";
import MyListItem from "../../Component/myListItem/myListItem";
import Navbar from "../../Component/navbar/Navbar";
import { MyListContext } from "../../context/myListContext/MyListContext";
import { getMyList } from "../../context/myListContext/apiCalls";
import { Link } from "react-router-dom";

export default function MyList() {
  const { user } = useContext(AuthContext);
  const [movieVideos, setMovieVideos] = useState([]);
  const [seriesVideos, setSeriesVideos] = useState([]);
  const { myList, dispatch } = useContext(MyListContext);
  const [likeMovies, setLikeMovies] = useState(myList?.likeMovies);
  const [loader, setLoader] = useState(false);
  const movies = myList?.movies;

  useEffect(() => {
    setLoader(true);
    const fetchUserList = async () => {
      try {
        await getMyList(user._id, dispatch);
        setLikeMovies(myList?.likeMovies);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching user list:", error);
        setLoader(false);
      }
    };
    fetchUserList();
  }, [dispatch]);

  useEffect(() => {
    if (movies) {
      const moviesVideos = movies.filter((video) => !video.isSeries);
      setMovieVideos(moviesVideos);

      const seriesVideos = movies.filter((video) => video.isSeries);
      setSeriesVideos(seriesVideos);
    }
  }, [movies]);
  return (
    <div className="mylist-container">
      <Navbar />
      {myList ? (
        <div className="mylist">
          {movieVideos.length > 0 && (
            <div className="movie-container">
              <div className="title">Movies</div>
              <div className="container">
                {movieVideos?.map((item, index) => (
                  <MyListItem key={index} item={item.movie} />
                ))}
              </div>
            </div>
          )}

          {seriesVideos.length > 0 && (
            <div className="movie-container">
              <div className="title">Series</div>
              <div className="container">
                {seriesVideos?.map((item, index) => (
                  <MyListItem key={index} item={item.movie} />
                ))}
              </div>
            </div>
          )}
          {myList.likeMovies?.length > 0 && (
            <div className="movie-container">
              <div className="title">Liked</div>
              <div className="container">
                {myList?.likeMovies?.map((item, index) => (
                  <MyListItem key={index} item={item} isLike={true}/>
                ))}
              </div>
            </div>
            )}

          {myList?.movies?.length === 0 && myList?.likeMovies?.length === 0 && (
            <div className="empty">
              <div className="empty-container">
                <img src="./image/empty.png" alt="logo" />
                <div className="title">Get Started</div>
                <div className="desc">
                  Find a great movie, then relax and enjoy with MovieBuzz
                </div>
                <Link to="/" className="add-movie">
                  Add Movie
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="empty">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
