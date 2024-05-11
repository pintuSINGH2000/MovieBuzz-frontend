import React, { createContext, useReducer } from "react";
import AuthReducer from "./MyListReducer";

const INITIAL_STATE = {
  myList: {
    movies:[],
    likeMovies: [],
    dislikeMovies: [],
  },
  isFetching: false,
  error: false,
};

export const MyListContext = createContext(INITIAL_STATE);

const MyListContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <MyListContext.Provider
      value={{
        myList: state.myList,
        isFetching: state.isFetching,
        error: state.error,
        dispatch
      }}
    >
      {children}
    </MyListContext.Provider>
  );
};

export default MyListContextProvider;