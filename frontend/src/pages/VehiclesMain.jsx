import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, ButtonGroup } from "@mui/material";

const VehiclesMain = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  // const handleClick = (e) => {
  //   setFilter(e.target.id);
  // };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.145:5555/vehicles")
      .then((res) => {
        setVehicles(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="home">
      {/* <div className="flex justify-center bg-white">
        <ButtonGroup
          className="mt-2"
          variant="outlined"
          aria-label="Basic button group"
        >
          <Button
            variant={filter === "all" ? "contained" : "outlined"}
            id="all"
            onClick={handleClick}
          >
            ВСИЧКИ
          </Button>
          <Button
            variant={filter === "cars" ? "contained" : "outlined"}
            id="cars"
            onClick={handleClick}
          >
            ЛЕКИ
          </Button>
          <Button
            variant={filter === "trucks" ? "contained" : "outlined"}
            id="trucks"
            onClick={handleClick}
          >
            ТОВАРНИ
          </Button>
        </ButtonGroup>
      </div> */}
      {loading ? <CircularProgress /> : <VehiclesList data={vehicles} />}
    </div>
  );
};

export default VehiclesMain;
