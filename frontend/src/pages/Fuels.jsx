import React from "react";
import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

// test
const Fuels = ({ vehicle, services, fuels, userRole, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
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
    if (
      !newFuel.date ||
      !newFuel.type ||
      !newFuel.invoice ||
      !newFuel.km ||
      !newFuel.cost
    ) {
      setError([true, "Всички полета са задължителни"]);
    } else {
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
      if (
        !vehicle.startKm ||
        parseInt(vehicle.startKm) > parseInt(newFuel.km)
      ) {
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
        window.location.reload();
      }, 1000);
    }
  };
  const handleClose = () => {
    setAdd(false);
  };
  const handleChange = (e) => {
    const newData = { ...newFuel };
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

    setNewFuel({ ...newData });
  };

  const handleCloseError = () => {
    setError([false, ""]);
  };
  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };

  const data = fuels.data.map((obj) => {
    return [
      obj.date,
      obj.type,
      obj.invoice,
      obj.km + " км",
      obj.cost + " лв",
      userRole.includes("admin") || userRole.includes(vehicle.site) ? (
        <IconButton
          onClick={() => {
            setVerifyDelete([true, obj]);
          }}
          color="error"
          variant="contained"
        >
          <DeleteForeverIcon />
        </IconButton>
      ) : (
        ""
      ),
    ];
  });

  const columns = [
    {
      name: "Дата",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
        filterOptions: {
          logic: (date, filters, row) => {
            console.log(date);
            if (filters.length) return !date.includes(filters);
          },
          names: fuels.data
            ? fuels.data
                .map((fuel) => dayjs(fuel.date).format("DD/MM/YYYY"))
                .filter((fuel, index, fuels) => fuels.indexOf(fuel) === index)
            : [],
        },
      },
    },
    { name: "Вид" },
    { name: "Фактура №", options: { filter: false } },
    { name: "Километри", options: { filter: false } },
    { name: "Стойност", options: { filter: false } },
    { name: "", options: { filter: false, sort: false } },
  ];
  const options = {
    filterType: "dropdown",
    selectableRows: false,
    download: false,
    print: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 100],
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
          open={verifyDelete[0]}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
            {`Сигурен ли сте, че искате да изтриете записът ${
              verifyDelete[1].type +
              " \n с № на фактура: " +
              verifyDelete[1].invoice +
              " на стойност: " +
              verifyDelete[1].cost +
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
                    `http://192.168.0.147:5555/fuels/${verifyDelete[1]._id}`
                  )
                  .then(() => {
                    axios.post(`http://192.168.0.147:5555/logs`, {
                      date: dayjs(),
                      user: username,
                      changed: {
                        delFuel: [
                          verifyDelete[1].invoice,
                          verifyDelete[1].cost,
                        ],
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
              autoFocus
            >
              ИЗТРИЙ
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={error[0]}
          onClose={handleCloseError}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Грешка"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error[1]}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseError} autoFocus>
              Добре
            </Button>
          </DialogActions>
        </Dialog>
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
            {userRole.includes("admin") || userRole.includes(vehicle.site) ? (
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
