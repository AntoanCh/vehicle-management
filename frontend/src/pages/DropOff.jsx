import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DropOff = () => {
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState({});
  const [record, setRecord] = useState({});
  const [driver, setDriver] = useState({});
  const [time, setTime] = useState(dayjs());
  const [problems, setProblems] = useState("");
  const [km, setKm] = useState("");
  const [kmError, setKmError] = useState(false);
  const [error, setError] = useState(false);
  const [destination, setDestination] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://192.168.0.147:5555/api/drivers/${id}`)
      .then((res) => {
        setDriver(res.data);
        axios
          .get(`http://192.168.0.147:5555/api/records/${res.data.recordId}`)
          .then((res) => {
            setRecord(res.data);
            axios
              .get(`http://192.168.0.147:5555/vehicle/${res.data.vehicleId}`)
              .then((res) => {
                setVehicle(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    setTime(dayjs());
  }, [dayjs()]);

  const handleDropOff = () => {
    axios
      .put(`http://192.168.0.147:5555/api/records/${record._id}`, {
        ...record,
        dropoffTime: dayjs(),
        dropoffKm: km,
        destination: destination,
        problem: problems,
      })
      .then((res) => {
        axios
          .put(`http://192.168.0.147:5555/api/drivers/${driver._id}`, {
            ...driver,
            occupied: false,
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });

        if (problems) {
          axios
            .post(`http://192.168.0.147:5555/problems`, {
              date: dayjs(),
              desc: problems,
              km: km,
              vehicleId: vehicle._id,
              driverName: driver.firstName,
            })
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
          axios
            .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
              ...vehicle,
              occupied: {
                bool: false,
                user: "",
              },
              km: km,
              issue: true,
            })
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
        } else {
          axios
            .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
              ...vehicle,
              occupied: {
                bool: false,
                user: "",
              },
              km: km,
            })
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
        }
        setLoading(false);
        navigate("/scan");
      })
      .catch((err) => {
        console.log(err);
      });
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
    if (e.target.value && e.target.value < vehicle.km) {
      setKmError(true);
    } else {
      setKmError(false);
    }
  };
  const handleClose = () => {
    setError(false);
  };
  return (
    <div>
      <Dialog
        maxWidth={"xs"}
        open={error}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ГРЕШКА"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Моля, попълнете маршрут и километри на връщане
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autofocus
            color="primary"
            variant="contained"
            onClick={handleClose}
          >
            добре
          </Button>
        </DialogActions>
      </Dialog>{" "}
      <Box
        sx={{
          backgroundColor: "#ccc",
          width: "80%",
        }}
        className="  border-2 border-blue-400 rounded-xl  p-4 mx-auto mt-5"
      >
        <Button
          sx={{ marginBottom: "5px" }}
          color="error"
          variant="contained"
          onClick={() => navigate("/scan")}
          autoFocus
        >
          <ArrowBackIosIcon />
          НАЗАД
        </Button>
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
              WebkitTextFillColor: "black", //Adjust text color here
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
                WebkitTextFillColor: "black", //Adjust text color here
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
                WebkitTextFillColor: "black", //Adjust text color here
              },
            }}
            variant="standard"
            value={time.format("DD/MM/YYYY     [Час:] HH:mm")}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              backgroundColor: "#bbb",
              width: "50%",
            }}
            className="  border-2 border-blue-400 rounded-xl  p-4  mt-5 mx-1"
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
                  WebkitTextFillColor: "black", //Adjust text color here
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
                  WebkitTextFillColor: "black", //Adjust text color here
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
                  WebkitTextFillColor: "black", //Adjust text color here
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
                  WebkitTextFillColor: "black", //Adjust text color here
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
                  WebkitTextFillColor: "black", //Adjust text color here
                },
              }}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: "#bbb",
              width: "50%",
            }}
            className="  border-2 border-blue-400 rounded-xl  p-4  mt-5 mx-1"
          >
            <Box sx={{ display: "flex" }}>
              <TextField
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
                    WebkitTextFillColor: "black", //Adjust text color here
                  },
                }}
              />
              <TextField
                label="КИЛОМЕТРИ НА ВРЪЩАНЕ"
                onChange={handleKm}
                onBlur={validateKm}
                InputLabelProps={{ shrink: true }}
                inputProps={{ maxLength: 6 }}
                value={km}
                helperText={
                  kmError
                    ? "Километрите на връщане не могат да са по-малко от километрите на взимане"
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
                    WebkitTextFillColor: "black", //Adjust text color here
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
        <Button
          sx={{ marginY: "10px", fontWeight: "800" }}
          variant="contained"
          fullWidth
          onClick={() => {
            if (!destination || !km || kmError) {
              setError(true);
            } else {
              handleDropOff();
            }
          }}
        >
          ВЪРНИ АВТОМОБИЛ
        </Button>
      </Box>
    </div>
  );
};

export default DropOff;
