import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DraggablePaper from "./DraggablePaper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import FilledInput from "@mui/material/FilledInput";
import { Button, MenuItem } from "@mui/material";
import axios from "axios";
import Chip from "@mui/material/Chip";

const UserEditPassword = ({
  editPassword,
  setEditPassword,
  alert,
  setAlert,
  error,
  setError,
  setErrorBanner,
  setRefresh,
  setIsRefetching,
  refresh,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [caps, setCaps] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClose = () => {
    setEditPassword({ show: false, user: {} });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/auth/updatepswrd",
        {
          ...editPassword.user,
        }
      );
      const { status, message } = data;

      if (status) {
        setAlert({
          show: true,
          message: `Паролата на потребител ${editPassword.user.username} е сменена успешно!`,
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
      setEditPassword({ show: false, user: {} });
    } catch (error) {
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    setEditPassword({ show: false, user: {} });
    setShowPassword(false);
  };

  const handleChange = (e) => {
    setEditPassword({
      ...editPassword,
      user: { ...editPassword.user, password: e.target.value },
    });
  };

  return (
    <Dialog
      PaperComponent={DraggablePaper}
      open={editPassword.show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"xl"}
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        {editPassword.user.username}
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
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
        <Box sx={{ marginTop: "15px" }}>
          {caps ? (
            <Chip
              size="large"
              sx={{
                fontWeight: 800,
              }}
              label={"CAPSLOCK ON"}
              color="error"
            />
          ) : (
            ""
          )}
        </Box>

        <Box sx={{ marginTop: "15px" }}>
          <FormControl sx={{ minWidth: "400px" }} fullWidth variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Нова Парола
            </InputLabel>
            <FilledInput
              value={editPassword.user.password}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.getModifierState("CapsLock")) {
                  setCaps(true);
                } else {
                  setCaps(false);
                }
              }}
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
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
  );
};

export default UserEditPassword;
