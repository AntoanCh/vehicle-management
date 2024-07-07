import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Office = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/vehicle")
      .then((res) => {
        setCars(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="home">
      <div className="flex justify-center">
        <h1 className="text-center text-3xl">ОФИС</h1>
      </div>
      {loading ? <CircularProgress /> : <VehiclesList data={cars} />}
    </div>
  );
};

export default Office;
