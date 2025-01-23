import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, MenuItem, IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DraggablePaper from "./DraggablePaper";
import axios from "axios";
import { Close } from "@mui/icons-material/";

const UserAdd = ({
  add,
  setAdd,
  alert,
  setAlert,
  error,
  setError,
  setErrorBanner,
  setRefresh,
  setIsRefetching,
  refresh,
}) => {
  const [input, setInput] = useState({
    username: "",
    password: "",
    role: [],
  });
  const { username, password, role } = input;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/auth/register",
        {
          ...input,
        }
      );
      const { status, message } = data;

      if (status) {
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
      setIsRefetching(true);
      setRefresh(!refresh);
      setAdd(false);
    } catch (error) {
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    setInput({
      ...input,
      username: "",
      password: "",
      role: [],
    });
  };

  const handleChange = (e) => {
    const { name, value, role } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  return (
    <Dialog
      PaperComponent={DraggablePaper}
      open={add}
      onClose={() => setAdd(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        {"Добави Потребител"}
        <IconButton
          sx={{
            margin: 0,
            padding: 0,
            float: "right",
          }}
          color="error"
          onClick={() => setAdd(false)}
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
                name="username"
                label="Потребител:"
                value={username}
                onChange={handleChange}
                variant="filled"
                autoComplete="off"
              ></TextField>
            </Box>
            <Box sx={{ marginY: "15px" }}>
              <TextField
                fullWidth
                select
                name="role"
                label="Права:"
                value={role}
                onChange={handleChange}
                variant="filled"
              >
                <MenuItem key={1} value="admin">
                  ADMIN
                </MenuItem>
                <MenuItem key={2} value="ОФИС">
                  ОФИС ОТГОВОРНИК АВТОМОБИЛИ
                </MenuItem>
                <MenuItem key={3} value="ВИТАЛИНО">
                  ВИТАЛИНО ОТГОВОРНИК АВТОМОБИЛИ
                </MenuItem>
                <MenuItem key={4} value="БОРСА">
                  БОРСА ОТГОВОРНИК АВТОМОБИЛИ
                </MenuItem>
                <MenuItem key={5} value="ДРУГИ">
                  ДРУГИ ОТГОВОРНИК АВТОМОБИЛИ
                </MenuItem>
                <MenuItem key={6} value="hr">
                  HR
                </MenuItem>
              </TextField>
            </Box>

            <Box sx={{ marginY: "15px" }}>
              <TextField
                type="password"
                fullWidth
                name="password"
                label="Парола:"
                value={password}
                onChange={handleChange}
                variant="filled"
                inputProps={{
                  autocomplete: "new-password",
                  form: {
                    autocomplete: "off",
                  },
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
        <Button variant="contained" onClick={handleSubmit} autoFocus>
          Добави
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserAdd;
