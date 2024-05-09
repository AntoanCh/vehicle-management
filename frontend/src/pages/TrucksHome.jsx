import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Home = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/vehicles")
      .then((res) => {
        setTrucks(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="home">
      <div className="home-top">
        <h1 className="text-center text-3xl">Товарни Автомобили</h1>
      </div>
      {loading ? <CircularProgress /> : <VehiclesList data={trucks} />}
    </div>
  );
};

export default Home;
