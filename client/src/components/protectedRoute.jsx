import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../api/user";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const getloggedInUser = async () => {
    let response = null;
    try {
      const response = await getLoggedUser();
      if (response.success) {
        setUser(response.data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
     getloggedInUser();
    }else{
 navigate("/login");
    }
  }, [navigate]);

  return( 
  <>
  <p>Name: {user?.firstname + ' ' + user?.lastname}</p>
  {children}
  </>
  );
};

export default ProtectedRoute;
