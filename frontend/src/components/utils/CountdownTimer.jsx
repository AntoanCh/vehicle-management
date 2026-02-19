import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

const CountdownTimer = ({
  initialSeconds,
  stop,
  setSecondDriver,
  setDriver,
  driver,
  setSelect,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => setSeconds(initialSeconds), [driver]);
  useEffect(() => {
    if (stop) {
      return;
    }
    // Exit early if countdown is finished
    if (seconds <= 0) {
      setSecondDriver(false);
      setDriver({});
      setSelect({ show: false, vehicle: {} });
      return;
    }

    // Set up the timer
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 950);

    // Clean up the timer
    return () => clearInterval(timer);
  }, [seconds]);

  // Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
  //   const formatTime = (timeInSeconds) => {
  //     const minutes = Math.floor(timeInSeconds / 60)
  //       .toString()
  //       .padStart(2, "0");
  //     const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
  //     return `${minutes}:${seconds}`;
  //   };

  return (
    <TextField
      sx={{
        maxWidth: "5%",
        marginTop: "10px",

        "& .MuiInputBase-input": {
          fontSize: 18,
          padding: 1,

          fontWeight: 800,
          textAlign: "center",
        },
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#e53935",
          //Adjust text color here
        },
      }}
      variant="filled"
      disabled
      value={":" + seconds}
    ></TextField>
  );
};

export default CountdownTimer;
