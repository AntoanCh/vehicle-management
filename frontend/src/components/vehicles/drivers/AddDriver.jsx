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
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DraggablePaper from "../../DraggablePaper";

const AddDriver = ({
  add,
  setAdd,
  drivers,
  setError,
  setRefresh,
  refresh,
  setAlert,
  setErrorBanner,
}) => {
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    barcode: "",
    barcode2: "",
  });
  const { firstName, lastName, barcode, barcode2 } = input;
  // console.log(
  //   drivers.filter(
  //     (driver) =>
  //       driver.firstName + driver.lastName ===
  //       input.firstName.toUpperCase() + input.lastName.toUpperCase()
  //   ).length
  // );
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!input.firstName || !input.lastName) {
      setError({ show: true, message: `Въведете име и фамилия!` });
      return;
    } else if (!input.barcode) {
      setError({ show: true, message: `Въведете номер на карта1` });
      return;
    } else if (
      drivers.filter(
        (driver) =>
          driver.firstName + driver.lastName ===
          input.firstName.toUpperCase() + input.lastName.toUpperCase()
      ).length
    ) {
      setError({ show: true, message: `Водач с тези имена вече съществува` });
      return;
    } else if (
      drivers.filter(
        (driver) =>
          (driver.barcode === input.barcode && input.barcode !== "") ||
          (driver.barcode === input.barcode2 && input.barcode2 !== "") ||
          (driver.barcode2 === input.barcode && input.barcode !== "") ||
          (driver.barcode2 === input.barcode2 && input.barcode2 !== "")
      ).length
    ) {
      setError({
        show: true,
        message: `Водач с такъв номер на карта вече съществува `,
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/api/drivers",
        {
          ...input,
        }
      );
      const { status, message } = data;

      if (data) {
        setAlert({
          show: true,
          message: "Успешно добавихте нов водач!",
          severity: "success",
        });
      } else {
        setAlert({
          show: true,
          message: "Грешка при запис",
          severity: "error",
        });
        setErrorBanner({
          show: true,
          message: "Грешка при запис",
          color: "error",
        });
      }
      setRefresh(!refresh);
      setAdd(false);
    } catch (error) {
      setErrorBanner({
        show: true,
        message: "Грешка при комуникация със сървъра!",
        color: "error",
      });
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    setInput({
      ...input,
      firstName: "",
      lastName: "",
      barcode: "",
      barcode2: "",
    });
  };

  const handleClose = () => {
    setAdd(false);
  };
  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <Dialog
        PaperComponent={DraggablePaper}
        open={add}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move", backgroundColor: "#42a5f5" }}
          id="draggable-dialog-title"
        >
          {"Добавяне на шофьор"}
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
            <Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Име:"
                  value={firstName}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Фамилия:"
                  value={lastName}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </Box>

              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="barcode"
                  label="Номер карта:"
                  value={barcode}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="barcode2"
                  label="Номер карта 2:"
                  value={barcode2}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => setAdd(false)}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleAddSubmit} autoFocus>
            Добави
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddDriver;
