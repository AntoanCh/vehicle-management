import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DraggablePaper from "./DraggablePaper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import { Button, MenuItem } from "@mui/material";
import axios from "axios";
import Chip from "@mui/material/Chip";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

const UserEditRole = ({
  editRole,
  setEditRole,
  alert,
  setAlert,
  error,
  setError,
  setErrorBanner,
  setRefresh,
  setIsRefetching,
  refresh,
}) => {
  const handleClose = () => {
    setEditRole({ show: false, user: {} });
  };

  const handleClickChip = (item) => {
    const arr = [...editRole.user.role];
    arr.push(item);
    setEditRole({ ...editRole, user: { ...editRole.user, role: [...arr] } });
  };

  const handleDeleteChip = (index) => {
    const arr = [...editRole.user.role];
    arr.splice(index, 1);
    setEditRole({ ...editRole, user: { ...editRole.user, role: [...arr] } });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/auth/updaterole",
        {
          ...editRole.user,
        }
      );
      const { status, message } = data;

      if (status) {
        setAlert({
          show: true,
          message: `Правата на потребител ${editRole.user.username} са сменени успешно!`,
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
      setEditRole({ show: false, user: {} });
    } catch (error) {
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    setEditRole({ show: false, user: {} });
  };

  const roles = [
    "admin",
    "hr",
    "ОФИС",
    "ВИТАЛИНО",
    "БОРСА",
    "ДРУГИ",
    "IT",
    "FREEZER",
  ];

  return (
    <Dialog
      PaperComponent={DraggablePaper}
      open={editRole.show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"xl"}
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        {editRole.user.username}
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
        {editRole.user.role ? (
          <Box>
            <Box sx={{ marginTop: "10px" }}>
              <Box
                sx={{
                  margin: "5px",
                  width: 400,
                  minHeight: 100,
                  backgroundColor: "#424242",
                  borderRadius: "10px",
                  borderColor: "#bdbdbd",
                  borderWidth: "2px",
                }}
              >
                {roles
                  .filter((item) => !editRole.user.role.includes(item))
                  .map((item, index) => (
                    <Chip
                      key={index}
                      sx={{ margin: "5px", fontWeight: 800 }}
                      color="primary"
                      label={item}
                      icon={<AddCircleOutlineOutlinedIcon />}
                      variant="outlined"
                      onClick={() => handleClickChip(item)}
                    />
                  ))}
              </Box>
              <Box
                sx={{
                  margin: "5px",
                  width: 400,
                  minHeight: 100,
                  backgroundColor: "#424242",
                  borderRadius: "10px",
                  borderColor: "#bdbdbd",
                  borderWidth: "2px",
                }}
              >
                {editRole.user.role.map((item, index) => (
                  <Chip
                    key={index}
                    sx={{ margin: "5px", fontWeight: 800 }}
                    color="success"
                    label={item}
                    // variant="outlined"
                    onDelete={() => handleDeleteChip(index)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}
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

export default UserEditRole;
