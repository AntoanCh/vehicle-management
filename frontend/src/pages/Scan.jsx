import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Paper from "@mui/material/Paper";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import CancelIcon from "@mui/icons-material/Cancel";
import TableRow from "@mui/material/TableRow";
import CountdownTimer from "../components/CountdownTimer";
import Pickup from "../components/Pickup";

const Scan = () => {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState([false, ""]);
  const [driver, setDriver] = useState({});
  const [blur, setBlur] = useState(false);
  const [select, setSelect] = useState([false, {}]);
  const [secondDriver, setSecondDriver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [time, setTime] = useState(dayjs());
  const [stopTimer, setStopTimer] = useState(true);

  const handleChange = (e) => {
    setBarcode(e.target.value);
  };
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/vehicle")
      .then((res) => {
        setVehicles(res.data.data.filter((item) => item.site === "ОФИС"));

        vehicles
          .filter(
            (veh) =>
              veh.availability.status === "РЕЗЕРВИРАН" &&
              dayjs().diff(veh.availability.time) > 1
          )
          .map((veh) =>
            axios
              .put(`http://192.168.0.147:5555/vehicle/${veh._id}`, {
                ...veh,
                availability: {
                  status: "",
                  user: "",
                },
              })
              .then((res) => {})
              .catch((err) => {
                console.log(err);
              })
          );

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    const interval = setInterval(() => {
      setLoading(true);
      axios
        .get("http://192.168.0.147:5555/vehicle")
        .then((res) => {
          setVehicles(res.data.data.filter((item) => item.site === "ОФИС"));

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 20000);
    return () => clearInterval(interval);
  }, [driver]);

  useEffect(() => {
    setTime(dayjs());
  }, [dayjs()]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcode) {
      setError([true, "Не е сканирана карта"]);
    } else {
      try {
        const { data } = await axios.get(
          `http://192.168.0.147:5555/api/drivers/barcode/${barcode}`
        );

        const { status, message } = data;

        if (data.length !== 0) {
          if (data[0].availability === "occupied") {
            setTimeout(() => {
              navigate(`/drop-off/${data[0]._id}`);
            }, 400);
          } else {
            setStopTimer(false);
            setDriver(data[0]);
          }
        } else {
          setError([true, "Шофьор с такъв номер не съществува"]);
        }
      } catch (error) {
        console.log(error);
      }
      setBarcode("");
    }
  };
  const handleError = () => {
    setError(false, "");
  };
  const handleClick = (vehicle) => {
    setSelect([true, { ...vehicle }]);
  };

  const handleSecondDriver = (vehicle) => {
    axios
      .get(`http://192.168.0.147:5555/api/records/vehicle/${vehicle._id}`)
      .then((res) => {
        const record = res.data.data.filter((rec) => !rec.dropoffTime)[0];
        navigate(`/drop-off/${record.driverId}`, {
          state: { id: 1, secondDriver: driver.firstName },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {select[0] && (
        <Pickup
          open={select[0]}
          vehicle={select[1]}
          driver={driver}
          setDriver={setDriver}
          setLoading={setLoading}
          setSelect={setSelect}
        />
      )}

      <Dialog
        open={error[0]}
        onClose={handleError}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Грешка"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error[1]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleError} autoFocus>
            Добре
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          backgroundColor: "#ccc",
          width: "80%",
        }}
        className="  border-2 border-blue-400 rounded-xl  p-4 mx-auto "
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: 20,
            margin: "auto",
            textAlign: "center",
          }}
        >
          БАРКОД:
        </h1>
        <form action="">
          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              onFocus={() => setBlur(false)}
              inputRef={(input) => input && input.focus()}
              error={blur}
              autoFocus
              autoComplete="off"
              fullWidth
              id="barcode"
              name="barcode"
              label="Баркод:"
              variant="filled"
              value={barcode}
              onChange={handleChange}
            />
            <Button
              sx={{ maxWidth: "10%" }}
              type="submit"
              onClick={handleSubmit}
              fullWidth
              color={blur ? "error" : "primary"}
              variant="contained"
            >
              <DoubleArrowIcon />
            </Button>
          </Box>
        </form>
        <Box sx={{ display: "flex" }}>
          {driver._id && (
            <>
              <Button
                onClick={() => {
                  setStopTimer(true);
                  setSecondDriver(false);
                  setDriver({});
                }}
                sx={{
                  marginTop: "10px",
                  "& .MuiInputBase-input": {
                    fontSize: 18,
                    padding: 1,
                    fontWeight: 800,
                    textAlign: "center",
                    color: "black",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "black", //Adjust text color here
                  },
                }}
                color="error"
                variant="contained"
              >
                <CancelIcon />
              </Button>
              <CountdownTimer
                initialSeconds={30}
                stop={stopTimer}
                setDriver={setDriver}
                setSecondDriver={setSecondDriver}
                setSelect={setSelect}
              />
            </>
          )}

          <TextField
            sx={{
              marginTop: "10px",
              "& .MuiInputBase-input": {
                fontSize: 18,
                padding: 1,

                fontWeight: 800,
                textAlign: "center",
                color: "black",
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black", //Adjust text color here
              },
            }}
            fullWidth
            variant="filled"
            disabled
            value={driver._id ? `${driver.firstName} ${driver.lastName}` : ""}
          ></TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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

          {driver._id && (
            <Box sx={{ display: "flex", width: "70%" }}>
              <TextField
                sx={{
                  marginTop: "10px",
                  height: "38px",
                  width: "50%",
                  "& .MuiInputBase-input": {
                    padding: 1,

                    fontWeight: 800,
                    textAlign: "center",
                    color: "black",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "black", //Adjust text color here
                  },
                }}
                variant="filled"
                disabled
                value="ИЗБЕРЕТЕ АВТОМОБИЛ"
              ></TextField>

              <Button
                variant="contained"
                onClick={() => setSecondDriver(!secondDriver)}
                color={secondDriver ? "primary" : "warning"}
                sx={{
                  marginTop: "10px",
                  height: "38px",
                  width: "50%",
                  fontWeight: 800,
                }}
              >
                {secondDriver
                  ? "ВЗЕМЕТЕ АВТОМОБИЛ"
                  : "ВЪРНЕТЕ АВТОМОБИЛ ВЗЕТ ОТ ДРУГ ВОДАЧ"}
              </Button>
            </Box>
          )}
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Модел</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="left">
                  Номер
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="left"></TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Водач
                </TableCell>

                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Време на тръгване
                </TableCell>
              </TableRow>
            </TableHead>
            {vehicles &&
              vehicles
                .sort((a, b) => {
                  if (a.availability.status && !b.availability.status) {
                    return 1;
                  } else if (!a.availability.status && b.availability.status) {
                    return -1;
                  } else if (a.availability.status && b.availability.status) {
                    if (a.availability.time < b.availability.time) {
                      return 1;
                    }
                  } else if (!a.availability.status && !b.availability.status) {
                    if (`${a.make} ${a.model}` > `${b.make} ${b.model}`) {
                      return 1;
                    }
                  } else {
                    return 0;
                  }
                })
                .map((vehicle, index) => (
                  <TableBody key={index}>
                    <TableRow
                      onClick={
                        driver._id &&
                        !secondDriver &&
                        !vehicle.availability.status
                          ? () => handleClick(vehicle)
                          : driver._id &&
                            secondDriver &&
                            vehicle.availability.status
                          ? () => handleSecondDriver(vehicle)
                          : vehicle.availability.status
                          ? undefined
                          : undefined
                      }
                      key={index}
                      sx={[
                        driver._id &&
                        !secondDriver &&
                        !vehicle.availability.status
                          ? {
                              backgroundColor: "#53c4f7",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "#29b6f6",
                              },
                            }
                          : driver._id &&
                            secondDriver &&
                            vehicle.availability.status
                          ? {
                              backgroundColor: "#9e9e9e",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "grey",
                              },
                            }
                          : vehicle.availability.status
                          ? vehicle.availability.status === "РЕЗЕРВИРАН"
                            ? {
                                backgroundColor: "#80cbc4",
                              }
                            : {
                                backgroundColor: "grey",
                              }
                          : { backgroundColor: "#29b6f6" },
                      ]}
                    >
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        component="th"
                        scope="row"
                      >
                        {`${vehicle.make} ${vehicle.model}`}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        align="left"
                      >
                        {vehicle.reg}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        align="left"
                      >
                        {vehicle.availability.status === "РЕЗЕРВИРАН" ||
                        vehicle.availability.status === "В СЕРВИЗ"
                          ? vehicle.availability.status
                          : ""}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        align="right"
                      >
                        {vehicle.availability.user}
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 20 }}
                        align="right"
                      >
                        {vehicle.availability.status
                          ? vehicle.availability.status === "РЕЗЕРВИРАН"
                            ? dayjs(vehicle.availability.time).format(
                                "[ДО ]  HH:mm"
                              )
                            : dayjs(vehicle.availability.time).format(
                                "DD/MM/YYYY - HH:mm"
                              )
                          : ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Scan;
