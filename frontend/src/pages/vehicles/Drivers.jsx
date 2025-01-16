import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import DriversList from "../../components/vehicles/drivers/DriversList.jsx";
import { Box } from "@mui/material";

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
    <Box>
      {loading ? <CircularProgress /> : <DriversList drivers={drivers} />}
    </Box>
  );
};

export default Drivers;
