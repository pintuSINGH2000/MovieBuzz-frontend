import { useContext } from "react";
import Featured from "./Component/featured/Featured";
import "./app.scss";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Watch from "./pages/Watch/Watch";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext }  from "./context/authContext/AuthContext"
import MyList from "./pages/myList/myList";
import NewAndPopular from "./pages/newAndPopular/NewAndPopular";
import SingleMovie from "./pages/SingleMovie/SingleMovie";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Empty from "./pages/Empty/Empty";


const App = () => {
  const {user} = useContext(AuthContext);
  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route
        exact
        path="/"
        element={user ? <Homepage /> : <Navigate to="/register" />}
      ></Route>
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      ></Route>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/" />}
      ></Route>
      {user && (
        <>
          <Route path="/movies" element={<Homepage type="movie" />}></Route>
          <Route path="/series" element={<Homepage type="series" />}></Route>
          <Route path="/mylist" element={<MyList />}></Route>
          <Route exact path="/watch" element={<Watch />}></Route>
          <Route path="/popular" element={<NewAndPopular />}></Route>
          <Route path="/single-movie/:id" element={<SingleMovie />}></Route>
          <Route path="*" element={<Empty />}></Route>
        </>
      )}
    </Routes>
    </>
  );
};

export default App;
