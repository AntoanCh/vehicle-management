import React from "react";
import axios from "axios";
import { Button, IconButton, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DraggablePaper from "../../DraggablePaper";
import { DeleteForever, Close, Edit } from "@mui/icons-material/";

const DeleteExpense = ({
  verifyDelete,
  setVerifyDelete,
  username,
  vehicle,
  refresh,
  setRefresh,
  setError,
  setAlert,
}) => {
  const handleCloseDelete = () => {
    setVerifyDelete({ show: false, expense: {} });
  };

  return (
    <Dialog
      PaperComponent={DraggablePaper}
      open={verifyDelete.show}
      onClose={handleCloseDelete}
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
          onClick={handleCloseDelete}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
        {`Сигурен ли сте, че искате да изтриете записът ${
          verifyDelete.expense.type +
          " " +
          verifyDelete.expense.desc +
          " \n с № на фактура: " +
          verifyDelete.expense.invoice +
          " на стойност: " +
          verifyDelete.expense.cost +
          " лв."
        } Тази операция е необратима`}
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
                `http://192.168.0.147:5555/api/services/${verifyDelete.expense._id}`
              )
              .then(() => {
                axios
                  .post(`http://192.168.0.147:5555/api/logs`, {
                    date: dayjs(),
                    user: username,
                    changed: {
                      delServ: [
                        verifyDelete.expense.invoice,
                        verifyDelete.expense.desc,
                      ],
                    },
                    vehicleId: vehicle._id,
                  })
                  .then(() => {
                    setAlert({
                      show: true,
                      message: `Разходът на стойност ${verifyDelete.expense.cost} лв, Ф-ра № '${verifyDelete.expense.invoice}' за ${vehicle.reg} е изтрит успешно!`,
                      severity: "success",
                    });
                  })
                  .catch(() => {
                    setAlert({
                      show: true,
                      message: `Разходът на стойност ${verifyDelete.expense.cost} лв, Ф-ра № '${verifyDelete.expense.invoice}' за ${vehicle.reg} е изтрит, с грешка при комуникацията!`,
                      severity: "success",
                    });
                  });
                setTimeout(() => {
                  setRefresh(!refresh);
                }, 200);
              })
              .catch((err) => {
                setError([true, `Грешка при комуникация: ${err}`]);
              });
            handleCloseDelete();
          }}
          autoFocus
        >
          ИЗТРИЙ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteExpense;
