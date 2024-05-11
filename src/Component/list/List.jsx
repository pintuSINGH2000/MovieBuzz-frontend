import "./list.scss";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import Listitem from "../listitem/Listitem";
import { useContext, useEffect, useRef, useState } from "react";
import { getMyList } from "../../context/myListContext/apiCalls";
import { AuthContext } from "../../context/authContext/AuthContext";
import { MyListContext } from "../../context/myListContext/MyListContext";

const List = ({ list }) => {
  const [isMoved, setIsMoved] = useState(false);
  const [isSliding,setIsSliding]=useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [clickLimit, setClickLimit] = useState(window.innerWidth / 230);
  const { user } = useContext(AuthContext);
  const { myList, dispatch } = useContext(MyListContext);

  const listRef = useRef();

  useEffect(() => {
    getMyList(user._id, dispatch);
  }, []);

  const handleClick = (direction) => {
    if (!isSliding) {
      setIsMoved(true);
      setIsSliding(true);
      let distance = listRef.current.getBoundingClientRect().x - 50;
      if (direction === "left" && slideNumber > 0) {
        setSlideNumber(slideNumber - 1);
        listRef.current.style.transform = `translateX(${230 + distance}px)`;
      }
      if (direction === "right" && slideNumber < 10 - clickLimit) {
        setSlideNumber(slideNumber + 1);
        listRef.current.style.transform = `translateX(${-230 + distance}px)`;
      }
      setTimeout(() => {
        setIsSliding(false);
      }, 1000);
    }
  };
  return (
    <div className="list">
      <span className="listTitle">{list.title}</span>
      <div className="wrapper">
        <ArrowBackIosNewOutlinedIcon
          className="sliderArrow left"
          onClick={() => handleClick("left")}
          style={{ display: !isMoved && "none" }}
        />
        <div className="container" ref={listRef}>
          {list?.content?.map((item, index) => (
            <Listitem key={index} item={item} myList={myList} />
          ))}
        </div>
        <ArrowForwardIosOutlinedIcon
          className="sliderArrow right"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
};

export default List;
