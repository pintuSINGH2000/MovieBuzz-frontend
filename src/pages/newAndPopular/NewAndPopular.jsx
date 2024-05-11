import "./newAndPopular.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import List from "../../Component/list/List";
import Navbar from "../../Component/navbar/Navbar";

const NewAndPopular = ({ type, setGenre }) => {
  const [content, setContent] = useState({});
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const res = await axios.get("/api/movie/newrandom");
        setContent(res.data[0]);
      } catch (err) {
        console.log(err);
      }
    };

    const getRandomList = async () => {
      try {
        const res = await axios.get("/api/list/new-popular");
        setLists(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomContent();
    getRandomList();
  }, []);
  return (
    <div className="popular">
    <div className="popular-container">
    <Navbar />
      <div className="popular-image-container">
        <img src={content.img} width="100%" alt="img" />
        <div className="popular-gradient-overlay"></div>
      </div>
      <div className="popular-info">
        <img src={content.imgTitle} width="100%" alt="img" />
        <div className="popular-title">{content.title}</div>
        <span className="popular-desc">{content.desc}</span>
        <div className="popular-buttons">
          <button
            className="popular-play"
            onClick={(e) => {
              navigate("/watch", { state: { movie: content } });
            }}
          >
            <PlayArrowIcon />
            <span>Play</span>
          </button>
          <button className="popular-more">
            <InfoOutlinedIcon />
            <span>Info</span>
          </button>
        </div>
  
    </div>
    </div>
      {lists?.map((list,index) => (
        <List list={list} key={index}/>
      ))}
    </div>
  
  );
};

export default NewAndPopular;
