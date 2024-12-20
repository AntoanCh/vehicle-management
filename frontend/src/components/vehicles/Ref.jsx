import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import Box from "@mui/material/Box";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import { Button, ButtonGroup, MenuItem, TextField } from "@mui/material";

function valuetext(slider) {
  return `${slider}°C`;
}

const Ref = ({ vehicle, services, userRole, username }) => {
  const [selected, setSelected] = useState();
  const [filter, setFilter] = useState("РЕМОНТИ");
  const [slider, setSlider] = React.useState([0, 0]);
  // const [monthsArr, setMonthsArr] = useState([]);
  const months = dayjs().diff(vehicle.startDate, "month");
  const endDate = dayjs();
  let startDate = dayjs(vehicle.startDate);
  const monthsArr = [];
  while (startDate.isBefore(endDate, "month")) {
    monthsArr.push(startDate.format("MM/YYYY"));
    startDate = startDate.add(1, "month");
  }

  // useEffect(() => {
  //   const arr = [];
  //   let start = startDate;
  //   while (start.isBefore(endDate, "month")) {
  //     arr.push(start.format("MM/YYYY"));
  //     start = start.add(1, "month");
  //   }
  //   setMonthsArr([...arr]);
  //   setSlider([0, months]);
  // }, [monthsArr]);
  //This sums all cost by month and creates an array
  const monthlyCost = monthsArr.map((month) =>
    services.data
      .filter((service) => dayjs(service.date).format("MM/YYYY") === month)
      .map((service) => service.cost)
      .reduce((sum, cost) => sum + cost, 0)
      .toFixed(2)
  );

  const handleChangeFilter = (e) => {
    setFilter(e.target.value);
  };

  const handleChangeSlider = (event, newValue) => {
    setSlider(newValue);
  };
  return (
    <Box>
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Box
          sx={[
            (theme) => ({
              width: "100%",
              margin: "10px",
              borderRadius: "5px",
              padding: "10px",
              backgroundColor: "white",
              ...theme.applyStyles("dark", {
                backgroundColor: "#212121",
              }),
            }),
          ]}
        >
          <BarChart
            // barLabel="value"
            height={250}
            xAxis={[
              {
                data: monthsArr,
                scaleType: "band",
              },
            ]}
            series={[{ data: monthlyCost }]}
          />
          <PieChart
            colors={["#009688", "#f50057", "#ffc400", "#795548"]}
            series={[
              {
                innerRadius: 20,
                paddingAngle: 3,
                cornerRadius: 3,
                arcLabel: (item) =>
                  `${((item.value / vehicle.totalExpenseCost) * 100).toFixed(
                    2
                  )}%`,
                arcLabelMinAngle: 35,
                arcLabelRadius: "60%",
                data: [
                  { id: 0, value: vehicle.totalRepairCost, label: "Ремонти" },
                  {
                    id: 1,
                    value: vehicle.totalServiceCost,
                    label: "Обслужване",
                  },
                  { id: 2, value: vehicle.totalTireCost, label: "Гуми" },
                  {
                    id: 3,
                    value:
                      vehicle.totalExpenseCost -
                      (vehicle.totalTireCost +
                        vehicle.totalServiceCost +
                        vehicle.totalRepairCost),
                    label: "Други",
                  },
                ],
              },
            ]}
            width={400}
            height={200}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Ref;
