import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Menu, MenuItem, Divider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SettingsDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
    toast.success("Navigating to Profile");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };


  try {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      const user = JSON.parse(userData);
      userEmail = user?.email || "User";
    }
  } catch (error) {
    console.log("Error parsing user data:", error);
  }

  return (
    <Box>
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)"
          }
        }}
      >
        <IoMdSettings size={24} color="#8B4513" />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
       
        <MenuItem onClick={handleProfile}>
          Profile
        </MenuItem>
         <Divider />
        <MenuItem onClick={handleProfile}>
          Change Password
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}