import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import CancelIcon from "@mui/icons-material/Cancel";
import TableRow from "@mui/material/TableRow";
import CountdownTimer from "../../components/utils/CountdownTimer";
import Pickup from "../../components/vehicles/Pickup";
import Clock from "../../components/utils/Clock";
import ErrorDialog from "../../components/utils/ErrorDialog";

const Scan = () => {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState({ show: false, message: "" });
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
      .get("http://192.168.0.147:5555/api/vehicle")
      .then((res) => {
        setVehicles(res.data.data.filter((item) => item.site === "ОФИС"));
        console.log(
          vehicles.filter(
            (veh) =>
              veh.occupied.reserved && dayjs().diff(veh.occupied.time) > 1
          )
        );
        vehicles
          .filter(
            (veh) =>
              veh.occupied.reserved && dayjs().diff(veh.occupied.time) > 1
          )
          .forEach((veh) =>
            axios
              .put(`http://192.168.0.147:5555/api/vehicle/${veh._id}`, {
                ...veh,
                occupied: {
                  status: false,
                  user: "",
                  reserved: false,
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
        .get("http://192.168.0.147:5555/api/vehicle")
        .then((res) => {
          setVehicles(res.data.data.filter((item) => item.site === "ОФИС"));
          vehicles
            .filter(
              (veh) =>
                veh.occupied.reserved && dayjs().diff(veh.occupied.time) > 1
            )
            .forEach((veh) =>
              axios
                .put(`http://192.168.0.147:5555/api/vehicle/${veh._id}`, {
                  ...veh,
                  occupied: {
                    status: false,
                    user: "",
                    reserved: false,
                  },
                })
                .then((res) => {
                  axios
                    .put(
                      `http://192.168.0.147:5555/api/drivers/${driver._id}`,
                      {
                        ...driver,
                        occupied: false,
                      }
                    )
                    .then((res) => {
                      setDriver(driver);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                })
            );
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 10000);
    return () => clearInterval(interval);
  }, [driver]);

  useEffect(() => {
    setTime(dayjs());
  }, [dayjs()]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcode) {
      setError({ show: true, message: "Не е сканирана карта" });
    } else {
      try {
        const { data } = await axios.get(
          `http://192.168.0.147:5555/api/drivers/barcode/${barcode}`
        );

        const { status, message } = data;

        if (data.length !== 0) {
          if (data[0].occupied) {
            setTimeout(() => {
              navigate(`/drop-off/${data[0]._id}`);
            }, 400);
          } else {
            setStopTimer(false);
            setDriver(data[0]);
          }
        } else {
          setError({
            show: true,
            message: "Шофьор с такъв номер не съществува",
          });
        }
      } catch (error) {
        console.log(error);
      }
      setBarcode("");
    }
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
      <ErrorDialog error={error} setError={setError} />
      <Box
        sx={{
          // backgroundColor: "#ccc",
          width: "80%",
          margin: "auto",
        }}
        // className="  border-2 border-blue-400 rounded-xl  p-4 mx-auto "
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
                initialSeconds={60}
                stop={stopTimer}
                driver={driver}
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
          <Clock />

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
                  if (a.occupied.status && !b.occupied.status) {
                    return 1;
                  } else if (!a.occupied.status && b.occupied.status) {
                    return -1;
                  } else if (a.occupied.status && b.occupied.status) {
                    if (a.occupied.time < b.occupied.time) {
                      return 1;
                    } else {
                      return -1;
                    }
                  } else if (!a.occupied.status && !b.occupied.status) {
                    if (`${a.make} ${a.model}` > `${b.make} ${b.model}`) {
                      return 1;
                    } else if (
                      `${a.make} ${a.model}` === `${b.make} ${b.model}`
                    ) {
                      return 0;
                    } else {
                      return -1;
                    }
                  } else {
                    return 0;
                  }
                })
                .map((vehicle, index) => (
                  <TableBody key={index}>
                    <TableRow
                      onClick={
                        driver._id && !secondDriver && !vehicle.occupied.status
                          ? () => handleClick(vehicle)
                          : driver._id &&
                            secondDriver &&
                            vehicle.occupied.status &&
                            !vehicle.occupied.reserved
                          ? () => handleSecondDriver(vehicle)
                          : // : vehicle.availability.status
                            // ? undefined
                            undefined
                      }
                      key={index}
                      sx={[
                        driver._id &&
                        !secondDriver &&
                        !vehicle.occupied.status &&
                        vehicle.occupied.user === "В СЕРВИЗ"
                          ? {
                              backgroundColor: "#7986cb",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "#5c6bc0",
                              },
                            }
                          : driver._id &&
                            !secondDriver &&
                            !vehicle.occupied.status
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
                            vehicle.occupied.status &&
                            !vehicle.occupied.reserved
                          ? {
                              backgroundColor: "#9e9e9e",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "grey",
                              },
                            }
                          : vehicle.occupied.status && vehicle.occupied.reserved
                          ? {
                              backgroundColor: "#546e7a",
                            }
                          : vehicle.occupied.status
                          ? {
                              backgroundColor: "grey",
                            }
                          : vehicle.occupied.user === "В СЕРВИЗ"
                          ? { backgroundColor: "#ffb74d" }
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
                        {vehicle.reg
                          .split(/(\d{4})/)
                          .join(" ")
                          .trim()}
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        align="right"
                      >
                        {vehicle.occupied.user}
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 20 }}
                        align="right"
                      >
                        {vehicle.occupied.status
                          ? vehicle.occupied.reserved
                            ? dayjs(vehicle.occupied.time).format(
                                "[резервирана до] HH:mm"
                              )
                            : dayjs(vehicle.occupied.time).format(
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
