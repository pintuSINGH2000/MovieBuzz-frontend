import "./featured.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Featured = ({ type, setGenre }) => {
  const [content, setContent] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    const getRandomContent = async () => {
      try{
        const res = await axios.get(`/api/movie/random?type=${type}`);
        setContent(res.data[0]);
      }catch(err){
        console.log(err);
      }
    }
    getRandomContent();
  },[type])
  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movie" ? "Movies" : "Series"}</span>
          <select name="genre" id="genre" onChange={(e)=> {setGenre(e.target.value)}}>
            <option>Genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      <div className="image-container">
         <img src={content.img} width="100%" alt="img" />
         <div className="gradient-overlay gradient-overlay-mobile"></div>
      </div>
      <div className="info">
        <img src={content.imgTitle} width="100%" alt="img" />
        <div className="title">{content.title}</div>
        <span className="desc">
          {content.desc}
        </span>
        <div className="buttons">
          <button className="play" onClick={(e) => {navigate("/watch",{state:{movie:content}})}}>
            <PlayArrowIcon />
            <span>Play</span>
          </button>
          <button className="more" onClick={(e) => {navigate("/single-movie/"+content._id)}}>
            <InfoOutlinedIcon />
            <span>Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
