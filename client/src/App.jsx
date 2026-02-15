import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/protectedRoute";
import Loader from "./components/loader.jsx";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Profile from "./pages/profile/index.jsx";

function App() {
  const {loader} = useSelector((state) => state.loaderReducer);

  return (
    <>
      <Toaster reverseOrder={false} />
     {loader && <Loader />  }
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
