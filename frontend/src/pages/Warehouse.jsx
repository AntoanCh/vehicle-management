import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";

const Warehouse = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/vehicle")
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
        <h1 className="text-center text-3xl">СКЛАД</h1>
      </div>
      {loading ? <CircularProgress /> : <VehiclesList data={trucks} />}
    </div>
  );
};

export default Warehouse;
