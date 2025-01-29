import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Ref from "./Ref";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { Button, ButtonGroup, MenuItem, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

const StyledTextField = styled(TextField)(({ theme }) => ({
  ...theme.typography.body2,
  "& .MuiInputBase-input": {
    fontSize: 14,
    height: "20px",
    padding: 1,
    fontWeight: 800,
    textAlign: "center",
  },
  "& .MuiFormLabel-root": {
    fontWeight: 800,
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: theme.palette.mode === "dark" ? "white" : "black",
  },
}));

const VehicleDetails = ({ id }) => {
  const [vehicle, setVehicle] = useState({});
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [error, setError] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!vehicle.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(
          `http://192.168.0.147:5555/api/vehicle/${id}`
        );
        setVehicle(res.data);

        const expenses = await axios.get(
          `http://192.168.0.147:5555/api/services/${res.data._id}`
        );
        setServices(expenses.data.data);
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, []);
  return (
    <Box display={"flex"}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="Година"
            value={vehicle.year}
            disabled
            name="year"
          />
        </Box>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="Гориво"
            value={vehicle.fuel}
            disabled
            name="fuel"
          />
        </Box>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="№ ДВГ"
            value={vehicle.engNum}
            disabled
            name="engNum"
          />
        </Box>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="№ Рама"
            value={vehicle.bodyNum}
            disabled
            name="bodyNum"
          />
        </Box>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="№ талон"
            value={vehicle.talonNum}
            disabled
            name="talonNum"
          />
        </Box>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="Размер Гуми"
            value={vehicle.tires}
            disabled
            name="tires"
          />
        </Box>
        <Box sx={{ margin: "5px" }}>
          <StyledTextField
            InputLabelProps={{ shrink: true }}
            label="Собственик"
            value={vehicle.owner}
            disabled
            name="owner"
          />
        </Box>
      </Box>
      <Box sx={{ width: "1000px" }}>
        <Ref vehicle={vehicle} services={services} />
      </Box>
    </Box>
  );
};

export default VehicleDetails;
