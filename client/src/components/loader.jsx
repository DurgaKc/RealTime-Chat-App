import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const Loader = ({ open = true }) => {
  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 999,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <CircularProgress />
        <p className="text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </Backdrop>
  );
};

export default Loader;
