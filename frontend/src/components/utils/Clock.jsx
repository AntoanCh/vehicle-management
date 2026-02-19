import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { darken, lighten, useTheme } from "@mui/material";

const Clock = () => {
  const [time, setTime] = useState(dayjs());
  useEffect(() => {
    setTime(dayjs());
  }, [dayjs()]);
  const theme = useTheme();
  return (
    <TextField
      label=""
      disabled
      InputLabelProps={{ shrink: true }}
      sx={{
        marginBottom: "10px",
        "& .MuiInputBase-input": {
          padding: "8px",
          fontWeight: 800,
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor:
            theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
        },
      }}
      variant="standard"
      value={dayjs().format("DD/MM/YYYY      HH:mm:ss")}
    />
  );
};

export default Clock;
