import React from "react";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

const Clock = () => {
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
          WebkitTextFillColor: "black", //Adjust text color here
        },
      }}
      variant="standard"
      value={dayjs().format("DD/MM/YYYY      HH:mm:ss")}
    />
  );
};

export default Clock;
