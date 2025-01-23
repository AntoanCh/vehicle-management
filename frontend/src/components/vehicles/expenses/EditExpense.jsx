import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
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

const EditExpense = ({
  vehicle,
  username,
  refresh,
  setRefresh,
  services,
  setError,
  setLoading,
  edit,
  setEdit,
  date,
  setDate,
  alert,
  setAlert,
}) => {
  const [newServ, setNewServ] = useState({
    date: date,
    type: "РЕМОНТ",
    desc: "",
    invoice: "",
    km: 0,
    cost: "",
    vehicleId: vehicle._id,
  });

  const handleSaveEdit = () => {
    console.log(edit.expense.date);
    console.log(edit.expense.type);
    console.log(edit.expense.desc);
    console.log(edit.expense.cost);
    if (
      !edit.expense.date ||
      !edit.expense.type ||
      !edit.expense.desc ||
      !edit.expense.cost
    ) {
      setError({
        show: true,
        message: "Дата, описание, вид и стойност са задължителни полета",
      });
    } else {
      setEdit(false);

      setNewServ({
        ...newServ,
        invoice: newServ.invoice.padStart(10, "0"),
      });
      axios
        .put(
          `http://192.168.0.147:5555/api/services/${edit.expense._id}`,
          edit.expense
        )
        .then(() => {
          axios
            .post(`http://192.168.0.147:5555/api/logs`, {
              date: dayjs(),
              user: username,
              changed: { newServ: [edit.expense.invoice, edit.expense.desc] },
              vehicleId: vehicle._id,
            })
            .then(() => {
              setAlert({
                show: true,
                message: `Разходът на стойност ${newServ.cost} лв, Ф-ра № '${newServ.invoice}' за ${vehicle.reg} редактиран успешно!`,
                severity: "success",
              });
            })
            .catch(() => {
              setAlert({
                show: true,
                message: `Разходът на стойност ${newServ.cost} лв, Ф-ра № '${newServ.invoice}' за ${vehicle.reg} редактиран успешно, с грешка при комуникация!`,
                severity: "warning",
              });
            });

          setTimeout(() => {
            setRefresh(!refresh);
          }, 100);
        })
        .catch((err) => {
          setLoading(false);
          setError({ show: true, message: `Грешка при комуникация: ${err}` });
        });
      // if (
      //   !vehicle.startKm ||
      //   vehicle.startKm === "0" ||
      //   parseInt(vehicle.startKm) > parseInt(edit.expense.km)
      // ) {
      //   vehicle.startKm = edit.expense.km.toString();
      //   axios
      //     .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
      //     .then(() => {})
      //     .catch((err) => {
      //       alert("Грешка, проверете конзолата 2");
      //       console.log(err);
      //     });
      // }
      // if (
      //   !vehicle.startDate ||
      //   dayjs(vehicle.startDate).diff(dayjs(edit.expense.date)) > 1
      // ) {
      //   vehicle.startDate = edit.expense.date;
      //   axios
      //     .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
      //     .then(() => {})
      //     .catch((err) => {
      //       alert("Грешка, проверете конзолата 3");
      //       console.log(err);
      //     });
      // }
      setEdit({ show: false, expense: {} });
    }
  };
  const handleChangeEdit = (e) => {
    const newData = { ...edit.expense };
    if (e.target.id === "km") {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    } else if (e.target.id === "cost") {
      if (e.target.value.endsWith(",")) {
        e.target.value = parseFloat(e.target.value).toString() + ".";
      } else if (e.target.value.endsWith(".")) {
        e.target.value = parseFloat(e.target.value).toString() + ".";
      } else if (e.target.value.endsWith(".0")) {
        e.target.value = parseFloat(e.target.value).toString() + ".0";
      } else if (/^[0-9]*\.[0-9]{2,3}$/.test(e.target.value)) {
        e.target.value = Number(parseFloat(e.target.value).toFixed(2));
      } else if (e.nativeEvent.inputType === "insertFromPaste") {
        e.target.value = Number(parseFloat(e.target.value).toFixed(2));
      } else {
        e.target.value = parseFloat(e.target.value);
        if (e.target.value === "NaN") {
          e.target.value = "";
        } //.toString();
      }
    }
    if (e.target.name === "type") {
      newData[e.target.name] = e.target.value;
    } else {
      newData[e.target.id] = e.target.value;
    }

    setEdit({ show: true, expense: { ...newData } });
  };

  const handleCloseEdit = () => {
    setEdit({ show: false, expense: {} });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <Box>
        {services && (
          <Dialog
            PaperComponent={DraggablePaper}
            open={edit.show}
            onKeyUp={(e) => {
              const ENTER = 13;

              if (e.keyCode === ENTER) {
                handleSaveEdit();
              }
            }}
            onClose={handleCloseEdit}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle
              style={{ cursor: "move", backgroundColor: "#42a5f5" }}
              id="draggable-dialog-title"
            >
              Редактирай Разход
              <IconButton
                sx={{
                  margin: 0,
                  padding: 0,
                  float: "right",
                }}
                color="error"
                onClick={handleCloseEdit}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"></DialogContentText>

              <Box>
                <h1 style={{ textAlign: "center" }}>{vehicle.reg}</h1>
                <Box>
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      fullWidth
                      id="date"
                      label="Дата:"
                      value={
                        dayjs(edit.expense.date)
                        // .add(3, "hour")
                      }
                      onChange={(newValue) => {
                        // const newData = { ...newServ };
                        // newData.date = newValue;
                        // setNewServ({ ...newData });
                        setEdit({
                          show: true,
                          expense: { ...edit.expense, date: newValue },
                        });
                      }}
                    />
                  </DemoContainer>
                </Box>
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChangeEdit}
                    value={edit.expense.type}
                    name="type"
                    id="type"
                    select
                    label="Вид:"
                  >
                    <MenuItem key={1} value="РЕМОНТ">
                      РЕМОНТ
                    </MenuItem>
                    <MenuItem key={2} value="ОБСЛУЖВАНЕ">
                      ОБСЛУЖВАНЕ
                    </MenuItem>
                    <MenuItem key={3} value="ГУМИ">
                      ГУМИ
                    </MenuItem>
                    <MenuItem key={4} value="КОНСУМАТИВ">
                      КОНСУМАТИВ
                    </MenuItem>
                    <MenuItem key={5} value="ГОРИВО">
                      ГОРИВО
                    </MenuItem>
                    <MenuItem key={6} value="ДРУГИ">
                      ДРУГИ
                    </MenuItem>
                  </TextField>
                </Box>
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChangeEdit}
                    value={edit.expense.cost}
                    name="cost"
                    id="cost"
                    label="Стойност:"
                  />
                </Box>
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChangeEdit}
                    value={edit.expense.desc}
                    name="desc"
                    id="desc"
                    label="Описание:"
                  />
                </Box>
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChangeEdit}
                    value={edit.expense.invoice}
                    name="invoice"
                    id="invoice"
                    label="Фактура №:"
                  />
                </Box>
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChangeEdit}
                    value={edit.expense.compName}
                    name="compName"
                    id="compName"
                    label="Ан. Наименование"
                  />
                </Box>

                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    onChange={handleChangeEdit}
                    value={edit.expense.km}
                    name="km"
                    id="km"
                    label="Километри:"
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="contained"
                onClick={handleCloseEdit}
                autoFocus
              >
                Отказ
              </Button>
              <Button variant="contained" onClick={handleSaveEdit} autoFocus>
                Запази
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default EditExpense;
