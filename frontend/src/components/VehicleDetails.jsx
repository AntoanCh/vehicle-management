import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Ref from "./Ref";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { Button, ButtonGroup, MenuItem, TextField } from "@mui/material";

const StyledTextField = styled(TextField)(({ theme }) => ({
  ...theme.typography.body2,
  "& .MuiInputBase-input": {
    fontSize: 14,
    height: "20px",
    padding: 1,
    fontWeight: 800,
    textAlign: "center",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: theme.palette.mode === "dark" ? "white" : "black",
  },
}));

const VehicleDetails = ({ id }) => {
  const [vehicle, setVehicle] = useState({});
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://192.168.0.147:5555/vehicle/${id}`)
      .then((res) => {
        setVehicle(res.data);
        axios
          .get(`http://192.168.0.147:5555/services/${res.data._id}`)
          .then((res) => {
            console.log(res.data);
            setServices(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <Box display={"flex"}>
      <Box>
        {Object.keys(vehicle).map((key) => (
          <StyledTextField
            value={vehicle[key]}
            disabled
            name="talonNum"
            //   onChange={handleChange}
          />
        ))}
      </Box>
      <Box sx={{ width: "1000px" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Ref vehicle={vehicle} services={services} />
        )}
      </Box>
    </Box>
  );
};

export default VehicleDetails;
