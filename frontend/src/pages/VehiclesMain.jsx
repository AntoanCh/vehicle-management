import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";
import Box from "@mui/material/Box";

const VehiclesMain = ({ filter, setFilter }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/vehicle")
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
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <VehiclesList data={vehicles} filter={filter} setFilter={setFilter} />
      )}
    </Box>
  );
};

export default VehiclesMain;
