import { toast } from "react-toastify";

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "GETTING_START":
      return {
        myList: null,
        isFetching: true,
        error: false,
      };
    case "GETTING_SUCCESS":
      return {
        myList: action.payload,
        isFetching: false,
        error: false,
      };
    case "GETTING_FAILURE":
      return {
        myList: null,
        isFetching: false,
        error: true,
      };
    case "ADDING_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "ADDING_SUCCESS":
      toast.success("Movie Added To My List");
      return {
        myList: {
          ...state.myList,
          movies: [...state.myList.movies, action.payload],
        },
        isFetching: false,
        error: false,
      };
    case "ADDING_FAILURE":
      toast.error("Error While Adding Movie");
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "REMOVING_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "REMOVING_SUCCESS":
      toast.warning("Movie Removed from My List");
      return {
        myList: {
          ...state.myList,
          movies: state.myList.movies.filter((m) => m.movie !== action.payload),
        },
        isFetching: false,
        error: false,
      };
    case "REMOVING_FAILURE":
      toast.error("Error While Removing Movie");
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "LIKE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "LIKE_SUCCESS":
      toast.success("Movie Liked Successfully");
      return {
        myList: action.payload.isLike
          ? {
              ...state.myList,
              likeMovies: state.myList.likeMovies.filter(
                (m) => m !== action.payload.movie
              ),
            }
          : {
              ...state.myList,
              likeMovies: [...state.myList.likeMovies, action.payload.movie],
              dislikeMovies: state.myList.dislikeMovies.filter(
                (m) => m !== action.payload.movie
              ),
            },
        isFetching: false,
        error: false,
      };
    case "LIKE_FAILURE":
      toast.error("Something went wrong");
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case "DISLIKE_START":
      return {
        ...state,
        isFetching: true,
        error: false,
      };
    case "DISLIKE_SUCCESS":
      toast.warning("Movie Dislike Successfully");
      return {
        myList: action.payload.isDislike
          ? {
              ...state.myList,
              likeMovies: state.myList.likeMovies.filter(
                (m) => m !== action.payload.movie
              ),
            }
          : {
              ...state.myList,
              dislikeMovies: [...state.myList.dislikeMovies, action.payload.movie],
              likeMovies: state.myList.likeMovies.filter(
                (m) => m !== action.payload.movie
              ),
            },
        isFetching: false,
        error: false,
      };
    case "DISLIKE_FAILURE":
      toast.error("Something went wrong");
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return { ...state };
  }
};

export default AuthReducer;
