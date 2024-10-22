import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import DriversList from "../components/DriversList.jsx";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/api/drivers")
      .then((res) => {
        setDrivers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="home">
      {loading ? <CircularProgress /> : <DriversList drivers={drivers} />}
    </div>
  );
};

export default Drivers;
