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
import DraggablePaper from "../../DraggablePaper";

const EditDriver = ({ edit, setEdit }) => {
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `http://192.168.0.147:5555/api/drivers/${edit.driver._id}`,
        {
          ...edit.driver,
        }
      );
      const { status, message } = data;

      // if (status) {
      //   handleSuccess(message);
      //   window.location.reload();
      // } else {
      //   handleError(message);
      // }
      setEdit({ show: false, message: {} });
    } catch (error) {
      console.log(error);
    }
    setEdit([false, {}]);

    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;

    setEdit({ show: true, driver: { ...edit.driver, [name]: value } });
  };

  const handleClose = () => {
    setEdit({ show: false, message: {} });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <Dialog
        PaperComponent={DraggablePaper}
        open={edit.show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move", backgroundColor: "#42a5f5" }}
          id="draggable-dialog-title"
        >
          {`РЕДАКТИРАНЕ ${edit.driver.firstName} ${edit.driver.lastName}`}
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
            <span>ID: </span>
            <span>{edit ? edit.driver._id : ""}</span>
          </Box>

          <Box>
            <Box>
              <Box>
                <TextField
                  fullWidth
                  name="firstName"
                  label="Име:"
                  value={edit.driver.firstName}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Фамилия:"
                  value={edit.driver.lastName}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </Box>

              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="barcode"
                  label="Номер карта:"
                  value={edit.driver.barcode}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="barcode2"
                  label="Номер карта 2:"
                  value={edit.driver.barcode2}
                  onChange={handleChangeEdit}
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
            onClick={handleClose}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Обнови
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditDriver;
