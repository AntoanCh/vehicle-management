import React from "react";
import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, IconButton, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";

const Services = ({ vehicle, services, fuels, userRole, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
  const [edit, setEdit] = useState([false, {}]);
  const [newServ, setNewServ] = useState({
    date: dayjs(),
    type: "",
    desc: "",
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
    if (!newServ.date || !newServ.type || !newServ.desc || !newServ.cost) {
      setError([true, "Дата, описание, вид и стойност са задължителни полета"]);
    } else {
      setAdd(false);
      axios
        .post("http://192.168.0.147:5555/services", newServ)
        .then(() => {
          axios.post(`http://192.168.0.147:5555/logs`, {
            date: dayjs(),
            user: username,
            changed: { newServ: [newServ.invoice, newServ.desc] },
            vehicleId: vehicle._id,
          });
        })
        .catch((err) => {
          setLoading(false);
          alert("Грешка, проверете конзолата 1");
          console.log(err);
        });
      if (
        !vehicle.startKm ||
        vehicle.startKm === 0 ||
        parseInt(vehicle.startKm) > parseInt(newServ.km)
      ) {
        vehicle.startKm = newServ.km.toString();
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 2");
            console.log(err);
          });
      }
      if (
        !vehicle.startDate ||
        dayjs(vehicle.startDate).diff(dayjs(newServ.date)) > 1
      ) {
        vehicle.startDate = newServ.date;
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 3");
            console.log(err);
          });
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  const handleSaveEdit = () => {
    if (!edit[1].date || !edit[1].type || !edit[1].desc || !edit[1].cost) {
      setError([true, "Дата, описание, вид и стойност са задължителни полета"]);
    } else {
      setAdd(false);
      axios
        .put(`http://192.168.0.147:5555/services/${edit[1]._id}`, edit[1])
        .then(() => {
          axios.post(`http://192.168.0.147:5555/logs`, {
            date: dayjs(),
            user: username,
            changed: { newServ: [edit[1].invoice, edit[1].desc] },
            vehicleId: vehicle._id,
          });
        })
        .catch((err) => {
          setLoading(false);
          alert("Грешка, проверете конзолата 1");
          console.log(err);
        });
      if (
        !vehicle.startKm ||
        vehicle.startKm === "0" ||
        parseInt(vehicle.startKm) > parseInt(edit[1].km)
      ) {
        vehicle.startKm = edit[1].km.toString();
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 2");
            console.log(err);
          });
      }
      if (
        !vehicle.startDate ||
        dayjs(vehicle.startDate).diff(dayjs(edit[1].date)) > 1
      ) {
        vehicle.startDate = edit[1].date;
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 3");
            console.log(err);
          });
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  console.log(`data ${vehicle.startDate}`);
  console.log(`data ${dayjs(vehicle.startDate).diff(dayjs(edit[1].date))}`);
  const handleClose = () => {
    setAdd(false);
  };
  const handleCloseError = () => {
    setError([false, ""]);
  };
  const handleChange = (e) => {
    const newData = { ...newServ };
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

    setNewServ({ ...newData });
  };
  const handleChangeEdit = (e) => {
    const newData = { ...edit[1] };
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

    setEdit([true, { ...newData }]);
  };

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };
  const handleCloseEdit = () => {
    setEdit([false, {}]);
  };

  const data = services.data.map((obj) => {
    return [
      obj.date,
      obj.type,
      obj.desc,
      obj.invoice,
      obj.km.toString().slice(0, -3) +
        " " +
        obj.km.toString().slice(-3) +
        " км",
      obj.cost + " лв",
      userRole.includes("admin") || userRole.includes(vehicle.site) ? (
        <Box>
          <IconButton
            onClick={() => {
              setEdit([true, obj]);
            }}
            color="warning"
            variant="contained"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setVerifyDelete([true, obj]);
            }}
            color="error"
            variant="contained"
          >
            <DeleteForeverIcon />
          </IconButton>
        </Box>
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
          names: services.data
            ? services.data
                .map((serv) => dayjs(serv.date).format("DD/MM/YYYY"))
                .filter(
                  (serv, index, services) => services.indexOf(serv) === index
                )
            : [],
        },
      },
    },
    { name: "Вид" },
    { name: "Описание", options: { filter: false } },
    { name: "Фактура №", options: { filter: false } },
    { name: "Километри", options: { filter: false } },
    { name: "Стойност", options: { filter: false } },
    { name: "Действия", options: { filter: false, sort: false } },
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
              " " +
              verifyDelete[1].desc +
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
                    `http://192.168.0.147:5555/services/${verifyDelete[1]._id}`
                  )
                  .then(() => {
                    axios.post(`http://192.168.0.147:5555/logs`, {
                      date: dayjs(),
                      user: username,
                      changed: {
                        delServ: [
                          verifyDelete[1].invoice,
                          verifyDelete[1].desc,
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
          open={edit[0]}
          onClose={handleCloseEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">РЕДАКТИРАНЕ</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>

            <div className="my-4">
              <DemoContainer components={["DatePicker, DatePicker"]}>
                <DatePicker
                  fullWidth
                  id="date"
                  label="Дата:"
                  value={
                    dayjs(edit[1].date)
                    // .add(3, "hour")
                  }
                  onChange={(newValue) => {
                    // const newData = { ...newServ };
                    // newData.date = newValue;
                    // setNewServ({ ...newData });
                    setEdit([true, { ...edit[1], date: newValue }]);
                  }}
                />
              </DemoContainer>
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].type}
                name="type"
                id="type"
                select
                label="Вид:"
              >
                <MenuItem key={1} value="РЕМОНТ">
                  РЕМОНТ
                </MenuItem>
                <MenuItem key={2} value="ДИАГНОСТИКА">
                  ДИАГНОСТИКА
                </MenuItem>
              </TextField>
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].desc}
                name="desc"
                id="desc"
                label="Описание:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].invoice}
                name="invoice"
                id="invoice"
                label="Фактура №:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].km}
                name="km"
                id="km"
                label="Километри:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].cost}
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
          <DialogTitle id="alert-dialog-title">Добави нов ремонт</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>

            <div className="my-4">
              <DemoContainer components={["DatePicker, DatePicker"]}>
                <DatePicker
                  fullWidth
                  format="DD/MM/YYYY"
                  id="date"
                  label="Дата:"
                  value={newServ.date}
                  onChange={(newValue) => {
                    const newData = { ...newServ };
                    newData.date = newValue;
                    setNewServ({ ...newData });
                  }}
                />
              </DemoContainer>
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newServ.type}
                name="type"
                id="type"
                select
                label="Вид:"
              >
                <MenuItem key={1} value="РЕМОНТ">
                  РЕМОНТ
                </MenuItem>
                <MenuItem key={2} value="ДИАГНОСТИКА">
                  ДИАГНОСТИКА
                </MenuItem>
              </TextField>
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newServ.desc}
                name="desc"
                id="desc"
                label="Описание:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newServ.invoice}
                name="invoice"
                id="invoice"
                label="Фактура №:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newServ.km}
                name="km"
                id="km"
                label="Километри:"
              />
            </div>
            <div className="my-4">
              <TextField
                fullWidth
                onChange={handleChange}
                value={newServ.cost}
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
            {(userRole.includes("admin") || userRole.includes(vehicle.site)) &&
            !vehicle.sold ? (
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={handleClick}
              >
                ДОБАВИ РЕМОНТ
              </Button>
            ) : (
              ""
            )}

            <MUIDataTable
              title={"СЕРВИЗНА ИСТОРИЯ"}
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

export default Services;
