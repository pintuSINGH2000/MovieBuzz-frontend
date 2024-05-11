import { toast } from "react-toastify";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "Login_Start":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "Login_Success":
      toast.success("Login Successfully");
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "Login_Failure":
      toast.error("Invalid Username or Password");
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "LOGOUT":
      toast.success("Logout Successfully");
      return {
        user: null,
        isFetching: false,
        error: false,
      };
    case "UPDATE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "UPDATE_FAILURE":
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "UPDATE_SUCCESS":
      const updatedUser = { ...state.user };
      for (const key in action.payload) {
          updatedUser[key] = action.payload[key];
      }
      return {
        user: updatedUser,
        isFetching: false,
        error: false,
      };
    default:
      return { ...state };
  }
};

export default AuthReducer;
