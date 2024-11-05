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
import TableRow from "@mui/material/TableRow";

const Scan = () => {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState([false, ""]);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [time, setTime] = useState(dayjs());
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
  }, []);

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
        console.log(data);

        if (data.length !== 0) {
          if (data[0].occupied) {
            setTimeout(() => {
              navigate(`/drop-off/${data[0]._id}`);
            }, 400);
          } else {
            setTimeout(() => {
              navigate(`/pick-up/${data[0]._id}`);
            }, 400);
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
  return (
    <>
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
      <Box className="flex justify-center">
        <Box
          sx={{
            backgroundColor: "#ccc",
          }}
          className="  border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto mt-5"
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: 24,
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
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#ccc",
        }}
        className="  border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto mt-5"
      >
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 450 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Модел</TableCell>
                <TableCell align="right">Номер</TableCell>
                <TableCell align="right">Шофьор</TableCell>
                <TableCell align="right">Време на тръгване</TableCell>
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
                  } else {
                    return 0;
                  }
                })
                .map((vehicle, index) => (
                  <TableBody key={index}>
                    <TableRow
                      key={index}
                      sx={[
                        vehicle.occupied.bool
                          ? { backgroundColor: "grey" }
                          : { backgroundColor: "#29b6f6" },
                      ]}
                    >
                      <TableCell component="th" scope="row">
                        {`${vehicle.make} ${vehicle.model}`}
                      </TableCell>
                      <TableCell align="right">{vehicle.reg}</TableCell>
                      <TableCell align="right">
                        {vehicle.occupied.user}
                      </TableCell>
                      <TableCell align="right">
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
