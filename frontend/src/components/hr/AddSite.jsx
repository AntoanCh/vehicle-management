import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import { Close } from "@mui/icons-material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DraggablePaper from "../DraggablePaper";
import InputAdornment from "@mui/material/InputAdornment";

const AddSite = ({
  add,
  setAdd,
  sites,
  setError,
  setRefresh,
  refresh,
  setAlert,
  setErrorBanner,
  setIsRefetching,
}) => {
  const [input, setInput] = useState({
    name: "",
    company: "",
    address: "",
    email: "",
    phone: "",
  });
  const { name, company, address, email, phone } = input;

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!input.name) {
      setError({ show: true, message: `Въведете име на обекта!` });
      return;
    }
    // else if (!input.company) {
    //   setError({ show: true, message: `Въведете фирма!` });
    //   return;
    // }
    else if (
      sites.filter((site) => site.name === input.name.toUpperCase()).length
    ) {
      setError({ show: true, message: `Този обект вече съществува` });
      return;
    }

    try {
      const { data } = await axios.post("http://192.168.0.147:5555/api/sites", {
        ...input,
      });
      const { status, message } = data;

      if (data) {
        setAlert({
          show: true,
          message: "Успешно добавихте нов обект!",
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
      setIsRefetching(true);
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
      name: "",
      company: "",
      address: "",
      email: "",
      phone: "",
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
          {"Добавяне на обект"}
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
                  name="name"
                  label="Име:"
                  value={name}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="company"
                  label="Фирма:"
                  value={company}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес:"
                  value={address}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </Box>

              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email:"
                  value={email}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Телефон:"
                  value={phone}
                  onChange={handleChangeAdd}
                  variant="filled"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+359</InputAdornment>
                    ),
                  }}
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

export default AddSite;
