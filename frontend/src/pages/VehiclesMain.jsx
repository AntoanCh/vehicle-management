import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";

const VehiclesMain = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
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
      {loading ? <CircularProgress /> : <VehiclesList data={vehicles} />}
    </div>
  );
};

export default VehiclesMain;
