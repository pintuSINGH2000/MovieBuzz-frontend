import React, { useContext, useEffect, useRef, useState } from "react";
import "./navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";
import { logout } from "../../context/authContext/AuthAction";
import axios from "axios";
import MobileNavbar from "../mobileNavbar/MobileNavbar";
import { ToastContainer } from "react-toastify";
import { Modal } from "antd";
import Profile from "../Profile/Profile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isMobileNavbarVisible, setMobileNavbarVisible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [member, setMember] = useState("silver");

  const navigate = useNavigate();
  let cancelToken;
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    if (user.profilePic&&user.profilePic.data) {
      const uint8Array = new Uint8Array(user.profilePic?.data?.data);
      const blob = new Blob([uint8Array], {
        type: user.profilePic?.contentType,
      });
      setProfilePic(blob);
    }
  }, [user.profilePic]);
  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return window.scroll(null);
  };

  useEffect(() => {
    if (user.plan === 3) {
      setMember("red");
    } else if (user.plan === 2) {
      setMember("gold");
    } else {
      setMember("silver");
    }
  }, [user.plan]);

  useEffect(() => {
    if (cancelToken) {
      cancelToken.cancel("New search initiated");
    }
    cancelToken = axios.CancelToken.source();

    const searchMovies = async () => {
      try {
        setSearching(true);
        movies.length = 0;
        const res = await axios.get(`/api/movie/search?query=${query}`, {
          cancelToken: cancelToken.token,
        });
        setMovies(res?.data);
        setSearching(false);
      } catch (error) {
        movies.length = 0;
        if (axios.isCancel(error)) {
          console.log(error);
        } else {
          console.error("Error searching for movies: ", error);
        }
      }
    };
    if (query.length > 0) {
      searchMovies();
    }

    return () => {
      if (cancelToken) {
        cancelToken.cancel("Component unmounted");
      }
    };
  }, [query]);

  const handleSearchClose = () => {
    setIsSearchOpen(!isSearchOpen);
    setQuery("");
    setMovies([]);
  };

  const toggleMobileNavbar = () => {
    setMobileNavbarVisible(!isMobileNavbarVisible);
  };

  //profile modal
  const showModal = (openModal) => {
    setIsModalOpen(openModal);
  };

  const handleOk = () => {
    showModal(false);
  };
  return (
    <>
      <div className={isScrolled ? "navbar scrolled" : "navbar"}>
        <ToastContainer />
        <div className="container">
          <div className="left">
            <Link to="/" className="link title">
              MovieBuzz
            </Link>
            <Link to="/" className="link">
              <span>Homepage</span>
            </Link>
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
          </div>
          <div className="right">
            {isSearchOpen ? (
              <div className="search-container">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Search for a movie"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <span>
                    <CloseIcon
                      className="icon close-icon"
                      onClick={() => {
                        handleSearchClose();
                      }}
                    />
                  </span>
                </div>

                {query && (
                  <ul className="movie-dropdown">
                    {movies.length > 0 ? (
                      movies?.map((movie) => (
                        <li
                          key={movie._id}
                          onClick={(e) => {
                            navigate("/single-movie/" + movie._id);
                          }}
                        >
                          {movie.title}
                        </li>
                      ))
                    ) : searching ? (
                      <span className="empty-search">Searching...</span>
                    ) : (
                      <span className="empty-search">No Movie Found!!!</span>
                    )}
                  </ul>
                )}
              </div>
            ) : (
              <SearchIcon
                className="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            )}

            <span>KID</span>
            <NotificationsIcon className="icon" />
            <img
              style={{ border: `2px solid ${member}` }}
              src={
                profilePic
                  ? URL.createObjectURL(profilePic)
                  : "../image/user.png"
              }
              alt="img"
            />
            <span className="username">Hi, {user.username}</span>
            <div className="profile">
              <ArrowDropDownIcon className="" />
              <div className="options">
                <span onClick={() => showModal(true)}>Edit Profile</span>
                <span onClick={() => dispatch(logout())}>Logout</span>
              </div>
            </div>
          </div>
          <MenuIcon
            className="icon menu-icon"
            onClick={() => {
              toggleMobileNavbar();
            }}
          />
        </div>
        {isMobileNavbarVisible && (
          <MobileNavbar
            visible={isMobileNavbarVisible}
            toggle={setMobileNavbarVisible}
          />
        )}
      </div>
      <Modal
        onCancel={() => showModal(false)}
        onOk={handleOk}
        footer={null}
        open={isModalOpen}
        className="modal"
      >
        <h3>Edit Profile</h3>
        <Profile />
      </Modal>
    </>
  );
};

export default Navbar;
