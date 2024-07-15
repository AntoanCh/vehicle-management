import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import ButtonGroup from "@mui/material/ButtonGroup";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

// test
const Fuels = ({ vehicle, services, fuels, userRole, username }) => {
  const [loading, setLoading] = useState(false);

  const [newFuel, setNewFuel] = useState({
    date: dayjs(),
    type: "",
    station: "",
    invoice: "",
    km: "",
    cost: "",
    vehicleId: vehicle._id,
  });

  const [add, setAdd] = useState(false);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleClick = () => {
    setAdd(true);
  };
  const handleSave = () => {
    setAdd(false);
    axios
      .post("http://192.168.0.147:5555/fuels", newFuel)
      .then(() => {
        axios.post(`http://192.168.0.147:5555/logs`, {
          date: dayjs(),
          user: username,
          changed: { newFuel: [newFuel.invoice, newFuel.desc] },
          vehicleId: vehicle._id,
        });
      })
      .catch((err) => {
        // setLoading(false);
        alert("Грешка, проверете конзолата");
        console.log(err);
      });
    if (!vehicle.startKm || parseInt(vehicle.startKm) > parseInt(newFuel.km)) {
      vehicle.startKm = newFuel.km;
      axios
        .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
        .then(() => {})
        .catch((err) => {
          alert("Грешка, проверете конзолата");
          console.log(err);
        });
    }
    if (!vehicle.startDate || vehicle.startDate > newFuel.date) {
      vehicle.startDate = newFuel.date;
      axios
        .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
        .then(() => {})
        .catch((err) => {
          alert("Грешка, проверете конзолата");
          console.log(err);
        });
    }

    setTimeout(() => {
      // window.location.reload();
    }, 1000);
  };
  const handleClose = () => {
    setAdd(false);
  };
  const handleChange = (e) => {
    const newData = { ...newFuel };
    if (e.target.name === "type") {
      newData[e.target.name] = e.target.value;
    } else {
      newData[e.target.id] = e.target.value;
    }

    setNewFuel({ ...newData });
  };
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };

  const data = fuels.data.map((obj) => {
    return [
      bgDate(obj.date.slice(0, 10)),
      obj.type,
      obj.station,
      obj.invoice,
      obj.km + " км",
      obj.cost + " лв",
      <Button
        onClick={() => {
          axios
            .delete(`http://192.168.0.147:5555/fuels/${obj._id}`)
            .then(() => {
              axios.post(`http://192.168.0.147:5555/logs`, {
                date: dayjs(),
                user: username,
                changed: {
                  delFuel: [obj.invoice, obj.station],
                },
                vehicleId: vehicle._id,
              });
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        color="error"
        variant="contained"
      >
        <DeleteForeverIcon />
      </Button>,
    ];
  });

  const columns = [
    {
      name: "Дата",
      options: {
        sortDirection: "desc",
      },
    },
    { name: "Вид" },
    { name: "Фактура №" },
    { name: "Километри" },
    { name: "Стойност" },
    { name: "" },
  ];
  const options = {
    filterType: "checkbox",
    selectableRows: false,
    download: false,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    // expandableRowsOnClick: true,
    // expandableRows: true,
    textLabels: {
      body: {
        noMatch: "Нищо не е намерено",
      },
      pagination: {
        next: "Следваща страница",
        previous: "Предишна страница",
        rowsPerPage: "Покажи по:",
        displayRows: "от", // 1-10 of 30
      },
      toolbar: {
        search: "Търсене",
        downloadCsv: "Изтегли CSV",
        print: "Принтирай",
        viewColumns: "Показване на колони",
        filterTable: "Филтри",
      },
      filter: {
        title: "ФИЛТРИ",
        reset: "изчисти",
      },
      viewColumns: {
        title: "Покажи колони",
      },
      selectedRows: {
        text: "rows(s) deleted",
        delete: "Delete",
      },
    },
  };
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
        <Dialog
          open={add}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Добави нов разход</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>

            <div className="my-4">
              <DemoContainer components={["DatePicker, DatePicker"]}>
                <DatePicker
                  fullWidth
                  format="DD/MM/YYYY"
                  id="date"
                  label="Дата:"
                  value={newFuel.date}
                  onChange={(newValue) => {
                    const newData = { ...newFuel };
                    newData.date = newValue;
                    setNewFuel({ ...newData });
                  }}
                />
              </DemoContainer>
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newFuel.type}
                name="type"
                id="type"
                select
                label="Вид:"
              >
                <MenuItem key={1} value="ДИЗЕЛ">
                  ДИЗЕЛ
                </MenuItem>
                <MenuItem key={2} value="А95">
                  А95
                </MenuItem>
                <MenuItem key={3} value="А98">
                  А98
                </MenuItem>
                <MenuItem key={4} value="А100">
                  А100
                </MenuItem>
                <MenuItem key={5} value="ГАЗ">
                  ГАЗ
                </MenuItem>
                <MenuItem key={6} value="Ad-Blue">
                  Ad-Blue
                </MenuItem>
              </TextField>
            </div>

            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newFuel.invoice}
                name="invoice"
                id="invoice"
                label="Фактура №:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newFuel.km}
                name="km"
                id="km"
                label="Километри:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newFuel.cost}
                name="cost"
                id="cost"
                label="Стойност:"
              />
            </div>
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
            <Button variant="contained" onClick={handleSave} autoFocus>
              Добави
            </Button>
          </DialogActions>
        </Dialog>
        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="my-4">
            {userRole === "admin" || userRole === vehicle.site ? (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleClick}
              >
                ДОБАВИ
              </Button>
            ) : (
              ""
            )}

            {/* <h1 className="text-center text-2xl">Сервизна история</h1> */}
            <MUIDataTable
              title={"ГОРИВО"}
              data={data}
              columns={columns}
              options={options}
            />
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default Fuels;
