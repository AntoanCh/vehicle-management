import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DraggablePaper from "./DraggablePaper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Button } from "@mui/material";

const UserDelete = ({
  verifyDelete,
  setVerifyDelete,
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
    setVerifyDelete({ show: false, user: {} });
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `http://192.168.0.147:5555/api/users/${verifyDelete.user._id}`
      );

      const { message } = data;
      if (message === "User Deleted") {
        setAlert({
          show: true,
          message: `Потребител ${verifyDelete.user.username} е изтрит успешно!`,
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
      handleClose();
    } catch (error) {
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    handleClose();
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
        {`Сигурен ли сте, че искате да изтриете потребител ${verifyDelete.user.username} Тази операция е необратима`}
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

export default UserDelete;
