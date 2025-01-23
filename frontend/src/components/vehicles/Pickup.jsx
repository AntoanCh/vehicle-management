import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import DraggablePaper from "../DraggablePaper";
import CloseIcon from "@mui/icons-material/Close";

const Pickup = ({
  open,
  vehicle,
  driver,
  setDriver,
  setLoading,
  setSelect,
}) => {
  const [agree, setAgree] = useState(false);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios
      .get(`http://192.168.0.147:5555/api/problems/${vehicle._id}`)
      .then((res) => {
        setIssues(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          .put(`http://192.168.0.147:5555/api/vehicle/${vehicle._id}`, {
            ...vehicle,
            occupied: {
              status: true,
              user: driver.firstName,
              time: dayjs(),
              userId: driver._id,
              reserved: false,
            },
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
        setLoading(false);
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
  const handleClose = () => {
    setSelect([false, {}]);
    setAgree(false);
  };
  const handleReserve = () => {
    axios
      .put(`http://192.168.0.147:5555/api/vehicle/${vehicle._id}`, {
        ...vehicle,
        occupied: {
          status: true,
          user: driver.firstName,
          time: dayjs().add(1, "hour"),
          userId: driver._id,
          reserved: true,
        },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    axios
      .put(`http://192.168.0.147:5555/api/drivers/${driver._id}`, {
        ...driver,
        occupied: true,
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
    setSelect([false, {}]);
    setDriver({});
  };
  return (
    <Dialog
      PaperComponent={DraggablePaper}
      maxWidth={"md"}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
        sx={
          vehicle.occupied.user === "В СЕРВИЗ"
            ? { backgroundColor: "#ffb74d" }
            : ""
        }
      >
        {"ВЗИМАНЕ НА КОЛА"}
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

      <DialogContent
        sx={
          vehicle.occupied.user === "В СЕРВИЗ"
            ? { backgroundColor: "#ffb74d" }
            : ""
        }
      >
        {vehicle.occupied.user === "В СЕРВИЗ" && (
          <Alert
            sx={{
              fontWeight: 800,
              paddingTop: 0,
              paddingBottom: 0,
              marginBottom: 1,
            }}
            variant="filled"
            severity="warning"
          >
            АВТОМОБИЛЪТ Е ОСТАВЕН В СЕРВИЗ !!!!!!!!!
          </Alert>
        )}
        <DialogContentText id="alert-dialog-description">
          <Box sx={{ display: "flex" }}>
            <Box sx={{ maxWidth: "30%" }}>
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
                value={
                  vehicle.km
                    ? vehicle.km.toString().slice(0, -3) +
                      " " +
                      vehicle.km.toString().slice(-3) +
                      " км"
                    : vehicle.km + " км"
                }
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
              <TextField
                disabled
                fullWidth
                value={`Група:   ${vehicle.cat}`}
                variant="standard"
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: 18,
                    padding: 1,
                    fontWeight: 800,
                    textAlign: "center",
                    color: vehicle.cat === "1" ? "red" : "black",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: vehicle.cat === "1" ? "red" : "black", //Adjust text color here
                  },
                }}
                error
                helperText={
                  vehicle.cat === "2"
                    ? "Този автомобил няма право да се движи в МАЛКИЯ РИНГ на нискоемисионните зони в София"
                    : vehicle.cat === "1"
                    ? "Този автомобил няма право да се движи в ГОЛЕМИЯ РИНГ на нискоемисионните зони в София"
                    : ""
                }
              />
            </Box>
            <Box sx={{ width: "70%" }}>
              {" "}
              <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
                <Table
                  sx={
                    vehicle.occupied.user === "В СЕРВИЗ"
                      ? { backgroundColor: "#ffb74d" }
                      : ""
                  }
                >
                  <TableHead>ЗАБЕЛЕЖКИ</TableHead>
                  <TableBody>
                    {issues
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.desc}
                          </TableCell>
                          <TableCell>{row.driverName}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox value={agree} onChange={handleAgree} />}
              label="Съгласен съм, че автомобилът има всички задължителни
          документи(Годишен технически преглед, малък талон и валидна
          застраховка 'Гражданска отговорност'), както и принадлежностите
          аптечка, триъгълник, жилетка и пожарогасител (в срок н годност) и
          нося отговрност, ако бъда санкциониран от органите на КАТ за
          липсата на някой от тях"
              labelPlacement="end"
            />
          </FormGroup>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={
          vehicle.occupied.user === "В СЕРВИЗ"
            ? { backgroundColor: "#ffb74d" }
            : ""
        }
      >
        <Button color="error" variant="contained" onClick={handleClose}>
          Отказ
        </Button>
        {/* <Button
          color="success"
          variant="contained"
          onClick={() => handleReserve(vehicle)}
        >
          РЕЗЕРВИРАЙ АВТОМОБИЛ
        </Button> */}
        <Button
          color={vehicle.occupied.user === "В СЕРВИЗ" ? "warning" : "primary"}
          disabled={agree ? false : true}
          variant="contained"
          onClick={() => handlePickUp(vehicle)}
        >
          {vehicle.occupied.user === "В СЕРВИЗ"
            ? "ВЗИМАНЕ ОТ СЕРВИЗ"
            : "ВЗИМАНЕ"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(Pickup);
