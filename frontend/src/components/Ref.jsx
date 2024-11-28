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
        {/* <Box>
          <TableContainer
            sx={{ maxWidth: "600px", margin: "10px", minWidth: "20%" }}
            component={Paper}
          >
            <Table
              sx={{ minWidth: "200px" }}
              size="small"
              aria-label="simple table"
            >
              <TableBody>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell
                    sx={{ textAlign: "center", fontWeight: "800" }}
                    component="th"
                    scope="row"
                  >
                    Общи
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Общо километри:
                  </TableCell>
                  <TableCell align="right">
                    {(vehicle.km - vehicle.startKm).toLocaleString()} км.
                  </TableCell>
                </TableRow>

                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Дата на закупуване:
                  </TableCell>
                  <TableCell align="right">
                    {dayjs(vehicle.purchaseDate).format("DD.MM.YYYY")}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Време на притежание:
                  </TableCell>
                  <TableCell align="right">
                    {`${
                      Math.floor(
                        dayjs().diff(vehicle.purchaseDate, "month") / 12
                      )
                        ? Math.floor(
                            dayjs().diff(vehicle.purchaseDate, "month") / 12
                          ) + "г. "
                        : ""
                    } ${dayjs().diff(vehicle.purchaseDate, "month") % 12}м.`}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Време от 1ви въведен ремонт:
                  </TableCell>
                  <TableCell align="right">
                    {`${
                      Math.floor(months / 12)
                        ? Math.floor(months / 12) + "г. "
                        : ""
                    } ${months % 12}м.`}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Цена на МПС:
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(vehicle.price).toLocaleString()} лв.
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Разходи общо:
                  </TableCell>
                  <TableCell align="right">
                    {services.data
                      .reduce((acc, obj) => acc + obj.cost, 0)
                      .toLocaleString()}{" "}
                    лв.
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Среден месечен разход:
                  </TableCell>
                  <TableCell align="right">
                    {months
                      ? (
                          services.data.reduce(
                            (acc, obj) => acc + obj.cost,
                            0
                          ) / months
                        ).toFixed(2) + " лв."
                      : "Няма данни"}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Среден разход на км:
                  </TableCell>
                  <TableCell align="right">
                    {vehicle.km - vehicle.startKm
                      ? (
                          services.data.reduce(
                            (acc, obj) => acc + obj.cost,
                            0
                          ) /
                          (vehicle.km - vehicle.startKm)
                        ).toFixed(2) + " лв."
                      : "Няма данни"}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Цена + Разходи:
                  </TableCell>
                  <TableCell align="right">
                    {vehicle.price
                      ? (
                          parseFloat(
                            services.data.reduce(
                              (acc, obj) => acc + obj.cost,
                              0
                            )
                          ) + parseFloat(vehicle.price)
                        ).toLocaleString() + " лв."
                      : "Няма данни"}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                ></TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box> */}
        <Box
          sx={[
            (theme) => ({
              width: "60%",
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
        </Box>
      </Box>
    </Box>
  );
};

export default Ref;
