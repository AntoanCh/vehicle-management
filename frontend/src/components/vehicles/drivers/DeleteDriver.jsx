import React from "react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import dayjs from "dayjs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Edit, DeleteForever, Timeline } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CloseIcon from "@mui/icons-material/Close";

const DeleteDriver = ({ verifyDelete, setVerifyDelete, error, setError }) => {
  const handleCloseDelete = () => {
    setVerifyDelete({ show: false, message: {} });
  };

  return (
    <Dialog
      open={verifyDelete.show}
      onClose={handleCloseDelete}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
        {`Сигурен ли сте, че искате да изтриете шофьор] ${verifyDelete.driver.name} Тази операция е необратима`}
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          variant="contained"
          onClick={handleCloseDelete}
          autoFocus
        >
          ОТКАЗ
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={() => {
            axios
              .delete(
                `http://192.168.0.147:5555/api/drivers/${verifyDelete.driver._id}`
              )
              .then(() => {
                window.location.reload();
              })
              .catch((err) => {
                setError({
                  show: true,
                  message: `Грешка при комуникация: ${err}`,
                });
              });
          }}
          autoFocus
        >
          ИЗТРИЙ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDriver;
