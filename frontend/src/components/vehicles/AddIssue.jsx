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
import { DeleteForever, Close, Edit } from "@mui/icons-material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DraggablePaper from "../DraggablePaper";

const AddIssue = ({
  vehicle,
  username,
  refresh,
  setRefresh,
  issues,
  setError,
  setLoading,
  add,
  setAdd,
  alert,
  setAlert,
}) => {
  const [newIssue, setNewIssue] = useState({
    date: dayjs(),
    desc: "",
    driverName: username,
    km: 0,
    vehicleId: vehicle._id,
  });

  const handleSave = () => {
    if (!newIssue.date || !newIssue.desc || !newIssue.driverName) {
      setError([true, "Дата, описание, водач са задължителни полета"]);
    } else {
      setAdd(false);

      axios
        .post("http://192.168.0.147:5555/problems", newIssue)
        .then(() => {
          setAlert({
            show: true,
            message: `Забележка  ${newIssue.desc}, за ${vehicle.reg} записана успешно!`,
            severity: "success",
          });
        })
        .catch((err) => {
          setLoading(false);
          setError([true, `Грешка при комуникация: ${err}`]);
        });
      setNewIssue({
        date: dayjs(),
        desc: "",
        driverName: username,
        km: 0,
        vehicleId: vehicle._id,
      });
      setTimeout(() => {
        setRefresh(!refresh);
      }, 500);
    }
  };

  const handleClose = () => {
    setNewIssue({
      date: dayjs(),
      desc: "",
      driverName: username,
      km: 0,
      vehicleId: vehicle._id,
    });
    setAdd(false);
  };

  const handleChange = (e) => {
    const newData = { ...newIssue };
    if (e.target.id === "km") {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    } else {
      newData[e.target.id] = e.target.value;
    }

    setNewIssue({ ...newData });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <Box>
        {issues && (
          <Dialog
            PaperComponent={DraggablePaper}
            // fullWidth
            onKeyUp={(e) => {
              const ENTER = 13;

              if (e.keyCode === ENTER) {
                handleSave();
              }
            }}
            open={add}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              style={{ cursor: "move", backgroundColor: "#42a5f5" }}
              id="draggable-dialog-title"
            >
              {"Добави забележка"}
              <IconButton
                sx={{
                  margin: 0,
                  padding: 0,
                  float: "right",
                }}
                color="error"
                onClick={handleClose}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"></DialogContentText>
              <Box>
                <h1 style={{ textAlign: "center" }}>{vehicle.reg}</h1>

                <Box>
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      fullWidth
                      format="DD/MM/YYYY"
                      id="date"
                      label="Дата:"
                      value={newIssue.date}
                      onChange={(newValue) => {
                        const newData = { ...newIssue };

                        newData.date = newValue;
                        setNewIssue({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </Box>

                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChange}
                    value={newIssue.desc}
                    name="desc"
                    id="desc"
                    label="Описание:"
                  />
                </Box>

                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChange}
                    disabled
                    value={newIssue.driverName}
                    name="driverName"
                    id="driverName"
                    label="Водач"
                  />
                </Box>
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChange}
                    value={newIssue.km}
                    name="km"
                    id="km"
                    label="Километри:"
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
    </LocalizationProvider>
  );
};

export default AddIssue;