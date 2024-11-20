import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, IconButton, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";

const AddExpense = ({
  vehicle,
  username,
  refresh,
  setRefresh,
  services,
  setError,
  setLoading,
  add,
  setAdd,
  date,
  setDate,
}) => {
  const [newServ, setNewServ] = useState({
    date: date,
    type: "",
    desc: "",
    invoice: "",
    km: "",
    cost: "",
    vehicleId: vehicle._id,
  });

  const handleSave = () => {
    if (!newServ.date || !newServ.type || !newServ.desc || !newServ.cost) {
      setError([true, "Дата, описание, вид и стойност са задължителни полета"]);
    } else {
      setAdd(false);
      axios
        .post("http://192.168.0.147:5555/services", newServ)
        .then(() => {
          axios.post(`http://192.168.0.147:5555/logs`, {
            date: dayjs(),
            user: username,
            changed: { newServ: [newServ.invoice, newServ.desc] },
            vehicleId: vehicle._id,
          });
        })
        .catch((err) => {
          setLoading(false);
          alert("Грешка, проверете конзолата 1");
          console.log(err);
        });
      if (
        !vehicle.startKm ||
        vehicle.startKm === 0 ||
        parseInt(vehicle.startKm) > parseInt(newServ.km)
      ) {
        vehicle.startKm = newServ.km.toString();
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 2");
            console.log(err);
          });
      }
      if (
        !vehicle.startDate ||
        dayjs(vehicle.startDate).diff(dayjs(newServ.date)) > 1
      ) {
        vehicle.startDate = newServ.date;
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 3");
            console.log(err);
          });
      }
      axios
        .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
          ...vehicle,
          totalServiceCost: (
            totalServiceCost + parseFloat(newServ.cost)
          ).toFixed(2),
        })
        .then(() => {})
        .catch((err) => {
          alert("Грешка, проверете конзолата 3");
          console.log(err);
        });
      setDate(newServ.date);
      setTimeout(() => {
        // window.location.reload();
        setRefresh(!refresh);
      }, 1000);
    }
  };

  const totalServiceCost = services.data.reduce(
    (acc, obj) => acc + parseFloat(obj.cost),
    0
  );
  const handleClose = () => {
    setAdd(false);
  };

  const handleChange = (e) => {
    const newData = { ...newServ };
    if (e.target.id === "km") {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    } else if (e.target.id === "cost") {
      if (e.target.value.endsWith(",")) {
        e.target.value = parseFloat(e.target.value).toString() + ".";
      } else if (e.target.value.endsWith(".")) {
        e.target.value = parseFloat(e.target.value).toString() + ".";
      } else if (e.target.value.endsWith(".0")) {
        e.target.value = parseFloat(e.target.value).toString() + ".0";
      } else if (/^[0-9]*\.[0-9]{2,3}$/.test(e.target.value)) {
        e.target.value = Number(parseFloat(e.target.value).toFixed(2));
      } else if (e.nativeEvent.inputType === "insertFromPaste") {
        e.target.value = Number(parseFloat(e.target.value).toFixed(2));
      } else {
        e.target.value = parseFloat(e.target.value);
        if (e.target.value === "NaN") {
          e.target.value = "";
        } //.toString();
      }
    }
    if (e.target.name === "type") {
      newData[e.target.name] = e.target.value;
    } else {
      newData[e.target.id] = e.target.value;
    }

    setNewServ({ ...newData });
  };

  return (
    <Box>
      {services && (
        <Dialog
          // fullWidth
          onKeyUp={(e) => {
            const ENTER = 13;
            console.log(e.keyCode);

            if (e.keyCode === ENTER) {
              handleSave();
            }
          }}
          open={add}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Добави разход</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
            <Box>
              {" "}
              <Box>
                <DemoContainer components={["DatePicker, DatePicker"]}>
                  <DatePicker
                    fullWidth
                    format="DD/MM/YYYY"
                    id="date"
                    label="Дата:"
                    value={newServ.date}
                    onChange={(newValue) => {
                      const newData = { ...newServ };
                      newData.date = newValue;
                      setNewServ({ ...newData });
                    }}
                  />
                </DemoContainer>
              </Box>
              <Box className="my-4">
                <TextField
                  fullWidth
                  onChange={handleChange}
                  value={newServ.type}
                  name="type"
                  id="type"
                  select
                  label="Вид:"
                >
                  <MenuItem key={1} value="РЕМОНТ">
                    РЕМОНТ
                  </MenuItem>
                  <MenuItem key={2} value="КОНСУМАТИВ">
                    КОНСУМАТИВ
                  </MenuItem>
                  <MenuItem key={3} value="ГУМИ">
                    ГУМИ
                  </MenuItem>
                  <MenuItem key={4} value="ДРУГИ">
                    ДРУГИ
                  </MenuItem>
                </TextField>
              </Box>
              <Box className="my-4">
                <TextField
                  fullWidth
                  onChange={handleChange}
                  value={newServ.desc}
                  name="desc"
                  id="desc"
                  label="Описание:"
                />
              </Box>
              <Box className="my-4">
                <TextField
                  fullWidth
                  onChange={handleChange}
                  value={newServ.invoice}
                  name="invoice"
                  id="invoice"
                  label="Фактура №:"
                />
              </Box>
              <Box className="my-4">
                <TextField
                  fullWidth
                  onChange={handleChange}
                  value={newServ.km}
                  name="km"
                  id="km"
                  label="Километри:"
                />
              </Box>
              <Box className="my-4">
                <TextField
                  fullWidth
                  onChange={handleChange}
                  value={newServ.cost}
                  name="cost"
                  id="cost"
                  label="Стойност:"
                />
              </Box>
            </Box>
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
            <Button variant="contained" onClick={handleSave} autoFocus>
              Добави
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AddExpense;
