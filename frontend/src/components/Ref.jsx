import React from "react";
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

const Ref = ({ vehicle, services, userRole, username }) => {
  const months = dayjs().diff(vehicle.startDate, "month");
  return (
    <div>
      <h1 className="text-center my-4 text-2xl">Справка МПС</h1>

      <div className="flex justify-center">
        <TableContainer
          sx={{ maxWidth: "600px", margin: "10px" }}
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
                  Общо месеци:
                </TableCell>
                <TableCell align="right">{months} м.</TableCell>
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
                  Ремонти
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Ремонти общо:
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
                  Обща стойност МПС:
                </TableCell>
                <TableCell align="right">
                  {vehicle.price
                    ? (
                        parseFloat(
                          services.data.reduce((acc, obj) => acc + obj.cost, 0)
                        ) + parseFloat(vehicle.price)
                      ).toLocaleString() + " лв."
                    : "Няма данни"}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Среден месечен разход ремонти:
                </TableCell>
                <TableCell align="right">
                  {months
                    ? (
                        services.data.reduce((acc, obj) => acc + obj.cost, 0) /
                        months
                      ).toFixed(2) + " лв."
                    : "Няма данни"}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Среден разход на км (ремонти):
                </TableCell>
                <TableCell align="right">
                  {vehicle.km - vehicle.startKm
                    ? (
                        services.data.reduce((acc, obj) => acc + obj.cost, 0) /
                        (vehicle.km - vehicle.startKm)
                      ).toFixed(2) + " лв."
                    : "Няма данни"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Ref;
