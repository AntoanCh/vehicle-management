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
  const [monthsArr, setMonthsArr] = useState([]);
  const months = dayjs().diff(vehicle.startDate, "month");
  const endDate = dayjs();
  let startDate = dayjs(vehicle.startDate);
  // const monthsArr = [];
  // monthsArr.push(startDate.format("MM/YYYY"));
  useEffect(() => {
    const arr = [];
    let start = startDate;
    while (start.isBefore(endDate, "month")) {
      arr.push(start.format("MM/YYYY"));
      start = start.add(1, "month");
    }
    setMonthsArr([...arr]);
    setSlider([0, months]);
  }, [monthsArr]);
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
    <Box sx={{ backgroundColor: "#78909c", borderRadius: "10px" }}>
      <h1 className="text-center my-4 text-2xl">Справка Разходи</h1>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}></Box>

      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-around" }}
      >
        <Box>
          <TableContainer
            sx={{ maxWidth: "600px", margin: "10px", minWidth: "20%" }}
            component={Paper}
          >
            <Table sx={{ minWidth: "200px" }} aria-label="simple table">
              {/* <div className="flex justify-between">
              <IconButton>
                <PrintIcon />
              </IconButton>
              <IconButton>
                <PrintIcon />
              </IconButton>
            </div> */}

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
                >
                  <TableCell
                    sx={{ textAlign: "center", fontWeight: "800" }}
                    component="th"
                    scope="row"
                  >
                    {`Разходи`}
                    <TextField
                      value={filter}
                      select
                      SelectProps={{ sx: { width: "200px", height: "20px" } }}
                      name="site"
                      onChange={handleChangeFilter}
                      variant="standard"
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 18,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "center",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "black", //Adjust text color here
                        },
                      }}
                    >
                      <MenuItem key={1} value={"РЕМОНТИ"}>
                        РЕМОНТИ
                      </MenuItem>
                      <MenuItem key={2} value={"ГУМИ"}>
                        ГУМИ
                      </MenuItem>
                      <MenuItem key={3} value={"КОНСУМАТИВИ"}>
                        КОНСУМАТИВИ
                      </MenuItem>
                      <MenuItem key={4} value={"ДРУГИ"}>
                        ДРУГИ
                      </MenuItem>
                    </TextField>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            width: "60%",
            margin: "10px",
            padding: "10px",
            backgroundColor: "white",
          }}
        >
          <BarChart
            // barLabel="value"
            height={400}
            xAxis={[
              {
                data: monthsArr,
                scaleType: "band",
              },
            ]}
            series={[{ data: monthlyCost }]}
            //   {...chartSetting}
          />
          <Slider
            min={0}
            max={months}
            // getAriaLabel={() => "Temperature range"}
            value={slider}
            onChange={handleChangeSlider}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Ref;
