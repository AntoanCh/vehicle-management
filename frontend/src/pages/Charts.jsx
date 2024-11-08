import { Box } from "@mui/material";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../components/VehiclesList.jsx";
import { Button, ButtonGroup } from "@mui/material";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

const Charts = () => {
  const [filter, setFilter] = React.useState("all");
  const [vehicles, setVehicles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleFilter = (val) => {
    setFilter(val);
  };

  React.useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/vehicle")
      .then((res) => {
        setVehicles(
          res.data.data.sort((a, b) =>
            b.price.localeCompare(a.price, undefined, { numeric: true })
          )
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  const xAxis = vehicles
    .filter((obj) =>
      filter === "all" ? obj.site !== "ПРОДАДЕНИ" : obj.site === filter
    )
    .map((vehicle) => vehicle.reg);

  const data = vehicles
    .filter((obj) =>
      filter === "all" ? obj.site !== "ПРОДАДЕНИ" : obj.site === filter
    )
    .map((vehicle) => vehicle.price);

  dayjs.extend(relativeTime);
  if (vehicles[0]) {
    console.log(dayjs(vehicles[0].purchaseDate).fromNow());
  }

  return (
    <Box>
      <Box>
        <ButtonGroup>
          <Button
            sx={{ width: "40%" }}
            color={filter === "all" ? "secondary" : "primary"}
            variant={"contained"}
            onClick={() => handleFilter("all")}
          >
            {"Всички"}
          </Button>
          <Button
            sx={{ width: "40%" }}
            color={filter === "ОФИС" ? "secondary" : "primary"}
            variant={"contained"}
            onClick={() => handleFilter("ОФИС")}
          >
            {"ОФИС"}
          </Button>
          <Button
            sx={{ width: "40%" }}
            color={filter === "СКЛАД" ? "secondary" : "primary"}
            variant={"contained"}
            onClick={() => handleFilter("СКЛАД")}
          >
            {"СКЛАД"}
          </Button>
          <Button
            sx={{ width: "40%" }}
            color={filter === "ДРУГИ" ? "secondary" : "primary"}
            variant={"contained"}
            onClick={() => handleFilter("ДРУГИ")}
          >
            {"ДРУГИ"}
          </Button>
          <Button
            sx={{ width: "40%" }}
            color={filter === "ПРОДАДЕНИ" ? "secondary" : "primary"}
            variant={"contained"}
            onClick={() => handleFilter("ПРОДАДЕНИ")}
          >
            {"ПРОДАДЕНИ"}
          </Button>
        </ButtonGroup>
      </Box>{" "}
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          padding: "10px",
          backgroundColor: "grey",
        }}
      >
        <BarChart
          height={500}
          xAxis={[
            {
              data: xAxis,
              scaleType: "band",
            },
          ]}
          series={[{ data: data }]}
          //   {...chartSetting}
        />
      </Box>
    </Box>
  );
};

export default Charts;
