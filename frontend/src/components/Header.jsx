import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { useLocation } from "react-router-dom";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Header = () => {
  const [tab, setTab] = useState("");
  const handleClick = (e) => {
    setTab(e.target.id);
  };
  const location = useLocation().pathname;
  useEffect(() => {
    if (location === "/cars") {
      setTab("cars");
    } else if (location === "/trucks") {
      setTab("trucks");
    }
  }, []);

  return (
    <div className="flex justify-between bg-gray-300">
      <div></div>
      <div>
        {" "}
        <ButtonGroup
          className="mt-2"
          variant="outlined"
          aria-label="Basic button group"
        >
          <Button
            variant={tab === "cars" ? "contained" : "outlined"}
            id="cars"
            onClick={handleClick}
            component={Link}
            to={"/cars"}
          >
            КОЛИ
          </Button>
          <Button
            variant={tab === "trucks" ? "contained" : "outlined"}
            id="trucks"
            onClick={handleClick}
            component={Link}
            to={"/trucks"}
          >
            КАМИОНИ
          </Button>
          {/* <Button>Three</Button> */}
        </ButtonGroup>
      </div>
      <div className="px-2 py-2">
        <Button
          sx={{ margin: "auto" }}
          variant="contained"
          component={Link}
          to="/vehicle/create"
        >
          {"НОВ"}
          <AddCircleOutlineIcon />
        </Button>
      </div>
    </div>
  );
};

export default Header;
