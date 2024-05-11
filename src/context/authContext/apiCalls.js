import axios from "axios";
import { loginFailure, loginStart, loginSuccess, updateFailure, updateStart, updateSuccess } from "./AuthAction";


export const login = async (user,dispatch) => {
    dispatch(loginStart());
    try{
     const res = await axios.post("/api/auth/login",user);
      dispatch(loginSuccess(res.data));
    }catch(error){
        dispatch(loginFailure());
    }
}

export const updateUser = async (userid,user,dispatch) => {
    dispatch(updateStart());
    try{
     const res = await axios.put(`/api/auth/update-user/${userid}`,user);
       dispatch(updateSuccess(res.data.change));
    }catch(error){
        dispatch(updateFailure());
    }
}