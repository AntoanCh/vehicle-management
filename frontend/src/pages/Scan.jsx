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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";

const Scan = () => {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState([false, ""]);
  const [driver, setDriver] = useState({});
  const [blur, setBlur] = useState(false);
  const [agree, setAgree] = useState(false);
  const [select, setSelect] = useState([false, {}]);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [time, setTime] = useState(dayjs());
  const [timer, setTimer] = useState(0);
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
          if (data[0].occupied) {
            setTimeout(() => {
              navigate(`/drop-off/${data[0]._id}`);
            }, 400);
          } else {
            // setTimeout(() => {
            //   navigate(`/pick-up/${data[0]._id}`);
            // }, 400);
            setDriver(data[0]);
            startTimer();
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
  const handleClose = () => {
    setSelect([false, {}]);
    setAgree(false);
  };
  const startTimer = () => {
    setTimeout(() => {
      setDriver({});
      setSelect([false, {}]);
    }, 30000);
  };
  const handlePickUp = (vehicle) => {
    axios
      .post("http://192.168.0.147:5555/api/records", {
        driverId: driver._id,
        vehicleId: vehicle._id,
        vehicleModel: `${vehicle.make} ${vehicle.model}`,
        vehicleReg: vehicle.reg,
        driverName: driver.firstName,
        pickupTime: dayjs(),
        pickupKm: vehicle.km,
      })
      .then((res) => {
        axios
          .put(`http://192.168.0.147:5555/api/drivers/${driver._id}`, {
            ...driver,
            occupied: true,
            recordId: res.data._id,
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
            ...vehicle,
            occupied: {
              bool: true,
              user: driver.firstName,
              time: dayjs(),
            },
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
        setLoading(false);
        // navigate("/scan");
        setSelect([false, {}]);
        setDriver({});
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAgree = () => {
    setAgree(!agree);
  };
  return (
    <>
      <Dialog
        maxWidth={"xs"}
        open={select[0]}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ВЗИМАНЕ НА КОЛА"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              disabled
              fullWidth
              value={select[1].reg}
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
              value={`${select[1].make} ${select[1].model}`}
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
              value={select[1].fuel}
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
              value={
                select[1].km
                  ? select[1].km.toString().slice(0, -3) +
                    " " +
                    select[1].km.toString().slice(-3) +
                    " км"
                  : select[1].km + " км"
              }
              variant="standard"
              inputProps={{
                startAdornment: (
                  <InputAdornment position="start">kg</InputAdornment>
                ),
              }}
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
              value={`ГТП:   ${dayjs(select[1].gtp).format("DD/MM/YYYY")}`}
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
              value={`ГО:   ${dayjs(select[1].insDate).format("DD/MM/YYYY")}`}
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
            <FormGroup>
              <FormControlLabel
                control={<Checkbox value={agree} onChange={handleAgree} />}
                label="Съгласен съм, че автомобилът има всички задължителни
                документи(Годишен технически преглед, малък талон и валидна
                застраховка 'Гражданска отговорност'), както и принадлежностите
                аптечка, триъгълник, жилетка и пожарогасител (в срок н годност) и
                нося отговрност, ако бъда санкциониран от органите на КАТ за
                липсата на някой от тях"
              />
            </FormGroup>

            {/* <span>
              
            </span> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleClose}
            autoFocus
          >
            Отказ
          </Button>
          <Button
            disabled={agree ? false : true}
            variant="contained"
            onClick={() => handlePickUp(select[1])}
            autoFocus
          >
            Взимане
          </Button>
        </DialogActions>
      </Dialog>{" "}
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
              onBlur={() => setBlur(true)}
              onFocus={() => setBlur(false)}
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
              variant="contained"
            >
              <DoubleArrowIcon />
            </Button>
          </Box>
        </form>
        <Box sx={{ display: "flex" }}>
          {driver._id && (
            <Button
              onClick={() => setDriver({})}
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
          {timer && (
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
              variant="filled"
              disabled
              value={timer}
            ></TextField>
          )}
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
                color="warning"
                sx={{
                  marginTop: "10px",
                  height: "38px",
                  width: "50%",
                  fontWeight: 800,
                }}
              >
                ВЪРНЕТЕ АВТОМОБИЛ ВЗЕТ ОТ ДРУГ ВОДАЧ
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
                  if (a.occupied.bool && !b.occupied.bool) {
                    return 1;
                  } else if (!a.occupied.bool && b.occupied.bool) {
                    return -1;
                  } else if (a.occupied.bool && b.occupied.bool) {
                    if (a.occupied.time < b.occupied.time) {
                      return 1;
                    }
                  } else if (!a.occupied.bool && !b.occupied.bool) {
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
                        driver._id ? () => handleClick(vehicle) : undefined
                      }
                      key={index}
                      sx={[
                        driver._id && !vehicle.occupied.bool
                          ? {
                              backgroundColor: "#53c4f7",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "#29b6f6",
                              },
                            }
                          : vehicle.occupied.bool
                          ? { backgroundColor: "grey" }
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
                        align="right"
                      >
                        {vehicle.occupied.user}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 20 }}
                        align="right"
                      >
                        {vehicle.occupied.bool
                          ? dayjs(vehicle.occupied.time).format(
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
