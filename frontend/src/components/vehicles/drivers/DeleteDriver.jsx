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
import DraggablePaper from "../../DraggablePaper";

const DeleteDriver = ({
  verifyDelete,
  setVerifyDelete,
  setError,
  refresh,
  setAlert,
  setRefresh,
  setErrorBanner,
  setIsRefetching,
}) => {
  const handleClose = () => {
    setVerifyDelete({ show: false, driver: {} });
  };
  const handleDelete = async () => {
    // axios
    //   .delete(
    //     `http://192.168.0.147:5555/api/drivers/${verifyDelete.driver._id}`
    //   )
    //   .then(() => {
    //     window.location.reload();
    //   })
    //   .catch((err) => {
    //     setError({
    //       show: true,
    //       message: `Грешка при комуникация: ${err}`,
    //     });
    //   });

    try {
      const { data } = await axios.delete(
        `http://192.168.0.147:5555/api/drivers/${verifyDelete.driver._id}`
      );
      const { status, message } = data;

      if (data) {
        setAlert({
          show: true,
          message: `Успешно изтрихте водач! ${verifyDelete.driver.firstName} ${verifyDelete.driver.lastName}`,
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
      setVerifyDelete({ show: false, driver: {} });
    } catch (error) {
      setErrorBanner({
        show: true,
        message: "Грешка при комуникация със сървъра!",
        color: "error",
      });
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    setVerifyDelete({ show: false, driver: {} });
  };
  return (
    <Dialog
      PaperComponent={DraggablePaper}
      open={verifyDelete.show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        ИЗТРИВАНЕ
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
        {`Сигурен ли сте, че искате да изтриете шофьор ${verifyDelete.driver.firstName} ${verifyDelete.driver.lastName} Тази операция е необратима`}
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          variant="contained"
          onClick={handleClose}
          autoFocus
        >
          ОТКАЗ
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={handleDelete}
          autoFocus
        >
          ИЗТРИЙ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDriver;
