import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import ErrorDialog from "../../components/utils/ErrorDialog";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DraggablePaper from "../../components/DraggablePaper";
import CloseIcon from "@mui/icons-material/Close";
import { darken, lighten, useTheme } from "@mui/material";

const DropOff = ({ dropoff, setDropoff, baseBackgroundColor }) => {
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState({});
  const [record, setRecord] = useState({});
  const [atRepair, setAtRepair] = useState(false);
  const [driver, setDriver] = useState({});
  const [time, setTime] = useState(dayjs());
  const [problems, setProblems] = useState("");
  const [km, setKm] = useState("");
  const [kmError, setKmError] = useState(false);
  const [error, setError] = useState({ show: false, message: "" });
  const [destination, setDestination] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://192.168.0.147:5555/api/drivers/${dropoff.driver}`
        );
        setDriver(res.data);
        const rec = await axios.get(
          `http://192.168.0.147:5555/api/records/${res.data.recordId}`
        );
        setRecord(rec.data);
        const veh = await axios.get(
          `http://192.168.0.147:5555/api/vehicle/${rec.data.vehicleId}`
        );
        setVehicle(veh.data);
        setLoading(false);
      } catch (error) {
        setError({ show: true, message: `Грешка при комуникация: ${error}` });
      }
    };
    fetchData();
    // setLoading(true);
    // axios
    //   .get(`http://192.168.0.147:5555/api/drivers/${dropoff.driver}`)
    //   .then((res) => {
    //     setDriver(res.data);
    //     axios
    //       .get(`http://192.168.0.147:5555/api/records/${res.data.recordId}`)
    //       .then((res) => {
    //         setRecord(res.data);
    //         axios
    //           .get(
    //             `http://192.168.0.147:5555/api/vehicle/${res.data.vehicleId}`
    //           )
    //           .then((res) => {
    //             setVehicle(res.data);
    //           })
    //           .catch((err) => {
    //             console.log(err);
    //           });
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });

    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);
  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setTime(dayjs());
    }, 20000);
  }, [time]);

  const handleClose = () => {
    setDropoff({ show: false, driver: "" });
  };

  const handleDropOff = async () => {
    try {
      const res = await axios.put(
        `http://192.168.0.147:5555/api/records/${record._id}`,
        {
          ...record,
          dropoffTime: dayjs(),
          dropoffKm: km,
          destination: destination,
          problem: problems,
          driverName: `${record.driverName}${
            location.state ? ` (${location.state.secondDriver})` : ""
          }`,
        }
      );
      await axios.put(`http://192.168.0.147:5555/api/drivers/${driver._id}`, {
        ...driver,
        occupied: false,
      });

      if (problems) {
        await axios.post(`http://192.168.0.147:5555/api/problems`, {
          date: dayjs(),
          desc: problems,
          km: km,
          vehicleId: vehicle._id,
          driverName: driver.firstName,
        });
        await axios.put(
          `http://192.168.0.147:5555/api/vehicle/${vehicle._id}`,
          {
            ...vehicle,
            occupied: {
              status: false,
              user: "",
            },
            km: km,
            issue: true,
          }
        );
      } else {
        await axios.put(
          `http://192.168.0.147:5555/api/vehicle/${vehicle._id}`,
          {
            ...vehicle,
            occupied: {
              status: false,
              user: "",
            },
            km: km,
          }
        );
      }
      setDropoff({ show: false, driver: "" });
      setLoading(false);
    } catch (error) {
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    // axios
    //   .put(`http://192.168.0.147:5555/api/records/${record._id}`, {
    //     ...record,
    //     dropoffTime: dayjs(),
    //     dropoffKm: km,
    //     destination: atRepair ? destination + " СЕРВИЗ" : destination,
    //     problem: atRepair ? problems + " СЕРВИЗ" : problems,
    //     driverName: `${record.driverName}${
    //       location.state ? ` (${location.state.secondDriver})` : ""
    //     }`,
    //   })
    //   .then((res) => {
    //     axios
    //       .put(`http://192.168.0.147:5555/api/drivers/${driver._id}`, {
    //         ...driver,
    //         occupied: false,
    //       })
    //       .then((res) => {})
    //       .catch((err) => {
    //         console.log(err);
    //       });

    //     if (problems) {
    //       axios
    //         .post(`http://192.168.0.147:5555/api/problems`, {
    //           date: dayjs(),
    //           desc: problems,
    //           km: km,
    //           vehicleId: vehicle._id,
    //           driverName: driver.firstName,
    //         })
    //         .then((res) => {})
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //       axios
    //         .put(`http://192.168.0.147:5555/api/vehicle/${vehicle._id}`, {
    //           ...vehicle,
    //           occupied: {
    //             status: false,
    //             user: atRepair ? "В СЕРВИЗ" : "",
    //           },
    //           km: km,
    //           issue: true,
    //         })
    //         .then((res) => {})
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     } else {
    //       axios
    //         .put(`http://192.168.0.147:5555/api/vehicle/${vehicle._id}`, {
    //           ...vehicle,
    //           occupied: {
    //             status: false,
    //             user: atRepair ? "В СЕРВИЗ" : "",
    //           },
    //           km: km,
    //         })
    //         .then((res) => {})
    //         .catch((err) => {
    //           console.log(err);
    //         });
    //     }
    //     setDropoff({ show: false, driver: "" });
    //     setLoading(false);
    //     navigate("/scan");
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const handleAtRepair = () => {
    setAtRepair(!atRepair);
  };

  const handleProblems = (e) => {
    setProblems(e.target.value);
  };
  const handleDestination = (e) => {
    setDestination(e.target.value);
  };
  const handleKm = (e) => {
    if (e.target.value) {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    }

    setKm(e.target.value);
  };
  const validateKm = (e) => {
    if (e.target.value && e.target.value < parseInt(vehicle.km)) {
      setKmError(true);
    } else {
      setKmError(false);
    }
  };
  return (
    <Dialog
      PaperComponent={DraggablePaper}
      maxWidth={"lg"}
      open={dropoff.show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        {"ВРЪЩАНЕ НА АВТОМОБИЛ"}
        <IconButton
          sx={{
            margin: 0,
            padding: 0,
            float: "right",
          }}
          color="error"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box>
            <ErrorDialog error={error} setError={setError} />

            {/* <Box
              sx={{
                backgroundColor: "#ccc",
                width: "80%",
              }}
              className="  border-2 border-blue-400 rounded-xl  p-4 mx-auto mt-5"
            > */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* <Button
                sx={{ marginBottom: "5px" }}
                color="error"
                variant="contained"
                onClick={() => navigate("/scan")}
              >
                <ArrowBackIosIcon />
                НАЗАД
              </Button> */}
              <Box sx={{ display: "flex" }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="warning"
                        value={atRepair}
                        onChange={handleAtRepair}
                      />
                    }
                    label=""
                    labelPlacement="end"
                  />
                </FormGroup>
                <Alert
                  sx={{
                    fontWeight: 800,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 1,
                  }}
                  variant="filled"
                  icon={<CarRepairIcon />}
                  severity={atRepair ? "warning" : ""}
                >
                  АВТОМОБИЛЪТ Е ОСТАВЕН В СЕРВИЗ
                </Alert>
              </Box>
            </Box>

            <TextField
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 18,

                  padding: 1,
                  fontWeight: 800,
                  textAlign: "center",
                  color: "black",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor:
                    theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                },
              }}
              fullWidth
              variant="filled"
              disabled
              value={`${driver.firstName} ${driver.lastName}`}
            >{`${driver.firstName} ${driver.lastName}`}</TextField>
            <h1 style={{ fontWeight: 800, fontSize: 24, textAlign: "center" }}>
              ВРЪЩАНЕ НА АВТОМОБИЛ
            </h1>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                label="Време на взимане"
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
                value={dayjs(record.pickupTime).format(
                  "DD/MM/YYYY     [Час:] HH:mm"
                )}
              />

              <TextField
                label="Време на връщане"
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
                value={time.format("DD/MM/YYYY     [Час:] HH:mm")}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  margin: "5px",
                  width: "50%",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? baseBackgroundColor
                      : darken(baseBackgroundColor, 0.2),
                  borderRadius: "10px",
                  borderColor:
                    theme.palette.mode === "dark" ? "#bdbdbd" : "black",
                  borderWidth: "2px",
                }}
              >
                <TextField
                  disabled
                  fullWidth
                  value={vehicle.reg}
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 18,
                      padding: 1,
                      fontWeight: 800,
                      textAlign: "center",
                      color: "black",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor:
                        theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                    },
                  }}
                />
                <TextField
                  fullWidth
                  disabled
                  value={`${vehicle.make} ${vehicle.model}`}
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 18,
                      padding: 1,
                      fontWeight: 800,
                      textAlign: "center",
                      color: "black",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor:
                        theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                    },
                  }}
                />
                <TextField
                  disabled
                  fullWidth
                  value={vehicle.fuel}
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 18,
                      padding: 1,
                      fontWeight: 800,
                      textAlign: "center",
                      color: "black",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor:
                        theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                    },
                  }}
                />
                <TextField
                  disabled
                  fullWidth
                  value={`ГТП:   ${dayjs(vehicle.gtp).format("DD/MM/YYYY")}`}
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 18,
                      padding: 1,
                      fontWeight: 800,
                      textAlign: "center",
                      color: "black",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor:
                        theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                    },
                  }}
                />
                <TextField
                  disabled
                  fullWidth
                  value={`ГО:   ${dayjs(vehicle.insDate).format("DD/MM/YYYY")}`}
                  variant="standard"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: 18,
                      padding: 1,
                      fontWeight: 800,
                      textAlign: "center",
                      color: "black",
                    },
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor:
                        theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  margin: "5px",
                  padding: "10px",
                  width: "50%",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? baseBackgroundColor
                      : darken(baseBackgroundColor, 0.2),
                  borderRadius: "10px",
                  borderColor:
                    theme.palette.mode === "dark" ? "#bdbdbd" : "black",
                  borderWidth: "2px",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    label="КИЛОМЕТРИ НА ВЗИМАНЕ"
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    value={
                      vehicle.km
                        ? vehicle.km.toString().slice(0, -3) +
                          " " +
                          vehicle.km.toString().slice(-3)
                        : vehicle.km
                    }
                    sx={{
                      width: "100%",
                      marginBottom: "10px",
                      marginRight: "2px",
                      "& .MuiInputBase-input": {
                        fontSize: 24,
                        padding: "8px",
                        height: "100%",
                        fontWeight: 800,
                        textAlign: "center",
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor:
                          theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                      },
                    }}
                  />
                  <TextField
                    label="КИЛОМЕТРИ НА ВРЪЩАНЕ"
                    autoFocus
                    onChange={handleKm}
                    onBlur={validateKm}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 6 }}
                    value={km}
                    helperText={
                      kmError
                        ? "Километрите на връщане са по-малко от километрите на взимане. Вероятна причина е, че предишният водач не е въвел правилни километри"
                        : ""
                    }
                    error={kmError}
                    sx={{
                      width: "100%",
                      marginBottom: "10px",
                      marginLeft: "2px",
                      "& .MuiInputBase-input": {
                        fontSize: 24,
                        padding: "8px",
                        height: "100%",
                        fontWeight: 800,
                        textAlign: "center",
                      },
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor:
                          theme.palette.mode === "dark" ? "white" : "black",
                      },
                    }}
                  />
                </Box>

                <TextField
                  label="МАРШРУТ"
                  onChange={handleDestination}
                  value={destination}
                  sx={{
                    width: "100%",
                    marginBottom: "10px",
                    "& .MuiInputBase-input": {
                      height: "100%",
                    },
                  }}
                  multiline
                />

                <TextField
                  label="ЗАБЕЛЕЖКИ"
                  onChange={handleProblems}
                  value={problems}
                  sx={{
                    width: "100%",
                    marginBottom: "10px",
                    "& .MuiInputBase-input": {
                      height: "100%",
                    },
                  }}
                  multiline
                />
                <Box
                  sx={{
                    borderRadius: "5px",
                    backgroundColor: "#4dabf5",
                    textAlign: "center",
                    marginBottom: "5px",
                    color: "№1769aa",
                  }}
                >
                  Оставете полето празно, ако нямате забележки към колата
                </Box>
              </Box>
            </Box>
            {/* <Button
              sx={{ marginY: "10px", fontWeight: "800" }}
              variant="contained"
              fullWidth
              onClick={() => {
                if (!destination || !km || kmError) {
                  setError([
                    true,
                    "Моля, попълнете правилни маршрут и километри на връщане",
                  ]);
                } else {
                  handleDropOff(false);
                }
              }}
            >
              ВЪРНИ АВТОМОБИЛ
            </Button> */}
            {/* </Box> */}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" variant="contained" onClick={handleClose}>
          Отказ
        </Button>

        <Button
          color={"primary"}
          disabled={false}
          variant="contained"
          onClick={() => {
            if (!destination || !km || kmError) {
              setError([
                true,
                "Моля, попълнете правилни маршрут и километри на връщане",
              ]);
            } else {
              handleDropOff(false);
            }
          }}
        >
          ВРРНИ АВТОМОБИЛ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DropOff;
