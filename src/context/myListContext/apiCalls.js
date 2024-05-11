import axios from "axios";
import { DislikeFailure, DislikeStart, DislikeSuccess, LikeStart, LikeSuccess, addingFailure, addingStart, addingSuccess, gettingFailure, gettingStart, gettingSuccess,removingFailure, removingStart, removingSuccess } from "./MyListAction";
import { toast } from "react-toastify";


export const getMyList = async (userid,dispatch) => {
    dispatch(gettingStart());
    try{
     const res = await axios.get("/api/user/mylist/" + userid);
      dispatch(gettingSuccess(res.data));
    }catch(error){
        dispatch(gettingFailure());
    }
}

export const addingMovieTOMyList = async (data,dispatch) => {
    dispatch(addingStart());
    try{
     const res = await axios.post(`/api/user/add/` + data.userId, {
        videoId: data.movieId,
        type: data.isSeries,
      });
      dispatch(addingSuccess());
    }catch(error){
        dispatch(addingFailure());
    }
}

export const removingMovieFromMyList = async (data,dispatch) => {
    dispatch(removingStart());
    try{
     const res = await axios.delete(`/api/user/remove/${data.userId}/${data.movieId}`);
      dispatch(removingSuccess(data.movieId));
    }catch(error){
        dispatch(removingFailure());
    }
}

export const toggleLikeMovie = async (data,dispatch) => {
    dispatch(LikeStart());
    try{
     const res = await axios.post('/api/movie/like', {
        movieId: data.movieId,
        listId: data.listId
      });
      dispatch(LikeSuccess(data.movieId,data.isLike));
    }catch(error){
        dispatch(addingFailure());
    }
}

export const toggleDislikeMovie = async (data,dispatch) => {
    dispatch(DislikeStart());
    try{
     const res = await axios.post('/api/movie/dislike', {
        movieId: data.movieId,
        listId: data.listId
      });
      dispatch(DislikeSuccess(data.movieId,data.isDislike));
    }catch(error){
        (DislikeFailure());
    }
}