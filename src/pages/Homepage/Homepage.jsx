import React, { useContext, useEffect, useState } from "react";
import "./homepage.scss";
import Navbar from "../../Component/navbar/Navbar";
import Featured from "../../Component/featured/Featured";
import List from "../../Component/list/List";
import axios from "axios";
import { AuthContext } from "../../context/authContext/AuthContext";
const Homepage = ({type}) => {
  const [lists,setLists] = useState([]);
  const [genre,setGenre] = useState("");
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const getRandomList = async () => {
      try{
         const res = await axios.get(`/api/list${type ? "?type=" + type : ""}${genre ? "&genre="+genre: ""}`,{
          headers:{
            token: "Bearer "+user?.accessToken
          } 
         });
         setLists(res?.data)
      }catch(err){
        console.log(err);
      }
    }
    getRandomList();
  },[type,genre])
  return (
    <div className="home">
      <Navbar />
      <Featured type={type} setGenre={setGenre}/>
      {lists?.map((list,index) => (
        <List list={list} key={index}/>
      ))}
    </div>
  );
};

export default Homepage;
