import React from "react";
import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "0px",
        width: "100%",
      }}
      className="text-right bg-gray-600"
    >
      Version v{process.env.REACT_APP_VERSION}{" "}
    </Box>
  );
};

export default Footer;
