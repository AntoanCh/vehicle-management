import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import dayjs from "dayjs";

const PickUp = () => {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [driver, setDriver] = useState({});
  const [agree, setAgree] = useState(false);
  const [select, setSelect] = useState([false, {}]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://192.168.0.147:5555/api/drivers/${id}`)
      .then((res) => {
        setDriver(res.data);
        axios
          .get("http://192.168.0.147:5555/vehicle")
          .then((res) => {
            setVehicles(res.data.data.filter((item) => item.site === "ОФИС"));
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
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
  const handleClick = (vehicle) => {
    setSelect([true, { ...vehicle }]);
  };
  const handleClose = () => {
    setSelect([false, {}]);
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
        navigate("/scan");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAgree = () => {
    setAgree(!agree);
  };
  return (
    <div>
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
      <Box
        sx={{
          backgroundColor: "#ccc",
          width: "80%",
        }}
        className="  border-2 border-blue-400 rounded-xl  p-4 mx-auto mt-5"
      >
        <Button
          sx={{ marginBottom: "10px" }}
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
        <Box>
          <h1 style={{ fontWeight: 800, fontSize: 24, textAlign: "center" }}>
            ИЗБЕРЕТЕ АВТОМОБИЛ
          </h1>
        </Box>
        <Grid container spacing={2}>
          {vehicles.map((vehicle) => (
            <Grid item xs={4}>
              <Paper
                onClick={() =>
                  vehicle.occupied.bool ? "" : handleClick(vehicle)
                }
                sx={[
                  vehicle.occupied.bool
                    ? { backgroundColor: "grey" }
                    : {
                        backgroundColor: "#53c4f7",
                        "&:hover": {
                          boxShadow: 6,
                          cursor: "pointer",
                          backgroundColor: "#29b6f6",
                        },
                      },
                ]}
              >
                <Typography
                  sx={{
                    letterSpacing: "2px",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                  variant="h4"
                  gutterBottom
                >
                  {`${vehicle.reg}`}
                </Typography>
                <Typography
                  sx={{
                    letterSpacing: "2px",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                  variant="h6"
                  gutterBottom
                >
                  {`${vehicle.make} ${vehicle.model}`}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default PickUp;
