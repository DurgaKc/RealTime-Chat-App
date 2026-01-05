import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers, getAllChats } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers,setAllChats} from "../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(state => state.userReducer)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getloggedInUser = async () => {
    let response = null;
    try {
      dispatch(showLoader());
      const response = await getLoggedUser();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        navigate("/login");
      }
    } catch (error) {
       dispatch(hideLoader());
      navigate("/login");
    }
  };
  const getAllUsersFromDb = async () => {
    let response = null;
    try {
      dispatch(showLoader());
      const response = await getAllUsers();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllUsers(response.data));
      } else {
        navigate("/login");
      }
    } catch (error) {
       dispatch(hideLoader());
      navigate("/login");
    }
  };
const getCurrentUserChats = async () =>{
 let response = null;
    try {
      dispatch(showLoader());
      const response = await getAllChats();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllChats(response.data));
      } else {
        navigate("/login");
      }
    } catch (error) {
       dispatch(hideLoader());
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getloggedInUser();
      getAllUsersFromDb();
      getCurrentUserChats();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoute;
