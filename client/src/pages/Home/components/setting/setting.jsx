import { useState } from "react";
import { IoMdSettings } from "react-icons/io";
import { Menu, MenuItem, Divider, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function SettingsDropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const location = useLocation(); // get current path

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    if (location.pathname !== "/profile") {
      navigate("/profile");
    }
  };

  const handlePasswordChange = () => {
    handleClose();
    if (location.pathname !== "/password") {
      navigate("/changePassword");
    }
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <IoMdSettings size={24} color="#8B4513" />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <Divider />
        <MenuItem onClick={handlePasswordChange}>Change Password</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
