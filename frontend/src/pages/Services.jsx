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
import { Button, IconButton, MenuItem } from "@mui/material";
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
import Edit from "@mui/icons-material/Edit";
import EditIcon from "@mui/icons-material/Edit";
//test

// test
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Дата",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Вид:",
  },
  {
    id: "desc",
    numeric: false,
    disablePadding: false,
    label: "Описание",
  },
  {
    id: "invoice",
    numeric: false,
    disablePadding: false,
    label: "Фактура №",
  },

  {
    id: "km",
    numeric: true,
    disablePadding: false,
    label: "Километри:",
  },
  {
    id: "cost",
    numeric: true,
    disablePadding: false,
    label: "Стойност:",
  },
  {
    id: "delete",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,

    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "grey" }}>
        {headCells.map((headCell) => (
          <TableCell
            align={
              headCell.id === "delete" ||
              headCell.id === "cost" ||
              headCell.id === "km"
                ? "right"
                : "left"
            }
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// test
const Services = ({ vehicle, services, fuels, userRole, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
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
    if (
      !newServ.date ||
      !newServ.type ||
      !newServ.desc ||
      !newServ.invoice ||
      !newServ.km ||
      !newServ.cost
    ) {
      setError([true, "Всички полета са задължителни"]);
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
        vehicle.startDate > newServ.date.$d.toISOString()
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
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };

  const data = services.data.map((obj) => {
    return [
      bgDate(obj.date.slice(0, 10)),
      obj.type,
      obj.desc,
      obj.invoice,
      obj.km + " км",
      obj.cost + " лв",
      userRole === "admin" || userRole === vehicle.site ? (
        <Box>
          <IconButton
            onClick={() => {
              setVerifyDelete([true, obj]);
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
      },
    },
    { name: "Вид" },
    { name: "Описание" },
    { name: "Фактура №" },
    { name: "Километри" },
    { name: "Стойност" },
    { name: "Действия" },
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
            {userRole === "admin" || userRole === vehicle.site ? (
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

            {/* <h1 className="text-center text-2xl">Сервизна история</h1> */}
            <MUIDataTable
              title={"СЕРВИЗНА ИСТОРИЯ"}
              data={data}
              columns={columns}
              options={options}
            />
            {/* test */}
            {/* <Box sx={{ width: "100%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  {services.data && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={services.data.length}
                    />
                  )}

                  {services.data && (
                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            // onClick={(event) => handleClick(event, row._id)}
                            // tabIndex={-1}
                            key={row._id}
                          >
                            <TableCell component="th" id={labelId} scope="row">
                              {`${bgDate(row.date)}`}
                            </TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.desc}</TableCell>
                            <TableCell>{row.invoice}</TableCell>
                            <TableCell align="right">{row.km} км.</TableCell>
                            <TableCell align="right">{row.cost} лв.</TableCell>
                            {userRole === "admin" ||
                            userRole === vehicle.site ? (
                              <TableCell align="right">
                                <Button
                                  onClick={() => {
                                    axios
                                      .delete(
                                        `http://192.168.0.147:5555/services/${row._id}`
                                      )
                                      .then(() => {
                                        axios.post(
                                          `http://192.168.0.147:5555/logs`,
                                          {
                                            date: dayjs(),
                                            user: username,
                                            changed: {
                                              delServ: [row.invoice, row.desc],
                                            },
                                            vehicleId: vehicle._id,
                                          }
                                        );
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
                                </Button>
                              </TableCell>
                            ) : (
                              ""
                            )}
                          </TableRow>
                        );
                      })}
                      {add ? (
                        <TableRow>
                          <TableCell component="th" scope="row" align="left">
                            {" "}
                            <div className="flex justify-start">
                              <input
                                value={newServ.date}
                                id="date"
                                onChange={handleChange}
                                type="date"
                                className="w-fit"
                                style={{
                                  width: "130px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(100,100,100)",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </TableCell>

                          <TableCell align="left">
                            <div>
                              <select
                                style={{
                                  height: "30px",
                                  width: "170px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(100,100,100)",
                                  color: "white",
                                  textAlign: "center",
                                }}
                                onChange={handleChange}
                                value={newServ.type}
                                name="type"
                                id="type"
                              >
                                <option value="">ИЗБЕРИ</option>
                                <option value="РЕМОНТ">РЕМОНТ</option>
                                <option value="ДИАГНОСТИКА">ДИАГНОСТИКА</option>
                              </select>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <input
                                value={newServ.desc}
                                id="desc"
                                onChange={handleChange}
                                className=""
                                style={{
                                  width: "300px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(100,100,100)",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <input
                                value={newServ.invoice}
                                id="invoice"
                                onChange={handleChange}
                                className=""
                                style={{
                                  width: "180px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(100,100,100)",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </TableCell>

                          <TableCell align="right">
                            {" "}
                            <div className="flex justify-end">
                              {" "}
                              <input
                                value={newServ.km}
                                id="km"
                                onChange={handleChange}
                                className="w-fit"
                                style={{
                                  width: "100px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(100,100,100)",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell align="right">
                            {" "}
                            <div className="flex justify-end">
                              <input
                                value={newServ.cost}
                                id="cost"
                                onChange={handleChange}
                                className="w-fit"
                                style={{
                                  width: "100px",
                                  borderRadius: "5px",
                                  backgroundColor: "rgb(100,100,100)",
                                  color: "white",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        ""
                      )}

                      {emptyRows > 0 && (
                        <TableRow
                          style={{
                            height: (dense ? 33 : 53) * emptyRows,
                          }}
                        >
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>

              <TablePagination
                labelRowsPerPage={"Покажи по:"}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={services.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              {userRole === "admin" || userRole === vehicle.site ? (
                <div className="flex justify-end">
                  {add ? (
                    <ButtonGroup fullWidth>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSave}
                      >
                        Запиши Ремонт
                        <SaveIcon />
                      </Button>
                      <Button
                        color="warning"
                        fullWidth
                        variant="contained"
                        onClick={handleCancel}
                      >
                        Отказ
                        <CancelIcon />
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Button fullWidth variant="contained" onClick={handleClick}>
                      Добави Ремонт
                      <AddCircleOutlineIcon />
                    </Button>
                  )}
                </div>
              ) : (
                ""
              )}
            </Paper>
          </Box> */}
            {/* test */}
            {/* <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey" }}>
                  <TableCell>Описание</TableCell>
                  <TableCell align="right">Дата</TableCell>
                  <TableCell align="right">Километри</TableCell>
                  <TableCell align="right">Стойност</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.desc}
                    </TableCell>
                    <TableCell align="right">
                      {row.date ? bgDate(row.date) : ""}
                    </TableCell>
                    <TableCell align="right">{row.km} км</TableCell>
                    <TableCell align="right">{row.cost} лв</TableCell>
                  </TableRow>
                ))}
                {add ? (
                  <TableRow key={vehicle}>
                    <TableCell component="th" scope="row">
                      <div>
                        <input
                          value={newServ.desc}
                          id="desc"
                          onChange={handleChange}
                          className=""
                          style={{
                            width: "300px",
                            borderRadius: "5px",
                            backgroundColor: "rgb(100,100,100)",
                            color: "white",
                            textAlign: "center",
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      <div className="flex justify-end">
                        <input
                          value={newServ.date}
                          id="date"
                          onChange={handleChange}
                          type="date"
                          className="w-fit"
                          style={{
                            width: "130px",
                            borderRadius: "5px",
                            backgroundColor: "rgb(100,100,100)",
                            color: "white",
                            textAlign: "center",
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      <div className="flex justify-end">
                        {" "}
                        <input
                          value={newServ.km}
                          id="km"
                          onChange={handleChange}
                          className="w-fit"
                          style={{
                            width: "100px",
                            borderRadius: "5px",
                            backgroundColor: "rgb(100,100,100)",
                            color: "white",
                            textAlign: "center",
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      <div className="flex justify-end">
                        <input
                          value={newServ.cost}
                          id="cost"
                          onChange={handleChange}
                          className="w-fit"
                          style={{
                            width: "100px",
                            borderRadius: "5px",
                            backgroundColor: "rgb(100,100,100)",
                            color: "white",
                            textAlign: "center",
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  ""
                )}
              </TableBody>
            </Table>
          </TableContainer> */}
            {/* <div className="flex justify-end">
            {add ? (
              <Button fullWidth variant="contained" onClick={handleSave}>
                Запиши Ремонт
                <SaveIcon />
              </Button>
            ) : (
              <Button fullWidth variant="contained" onClick={handleClick}>
                Добави Ремонт
                <AddCircleOutlineIcon />
              </Button>
            )}
          </div> */}

            {/* <h1 className="text-center my-4 text-2xl">Справка МПС</h1>

          <div className="flex justify-center">
            <TableContainer
              sx={{ maxWidth: "600px", margin: "10px" }}
              component={Paper}
            >
              <Table sx={{ minWidth: "200px" }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: "center", fontWeight: "800" }}
                      component="th"
                      scope="row"
                    >
                      Общи
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Общо километри:
                    </TableCell>
                    <TableCell align="right">
                      {(vehicle.km - vehicle.startKm).toLocaleString()} км.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Общо месеци:
                    </TableCell>
                    <TableCell align="right">{months} м.</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell
                      sx={{ textAlign: "center", fontWeight: "800" }}
                      component="th"
                      scope="row"
                    >
                      Ремонти
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Ремонти общо:
                    </TableCell>
                    <TableCell align="right">
                      {services.data
                        .reduce((acc, obj) => acc + obj.cost, 0)
                        .toLocaleString()}{" "}
                      лв.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Обща стойност МПС:
                    </TableCell>
                    <TableCell align="right">
                      {vehicle.price
                        ? (
                            parseFloat(
                              services.data.reduce(
                                (acc, obj) => acc + obj.cost,
                                0
                              )
                            ) + parseFloat(vehicle.price)
                          ).toLocaleString() + " лв."
                        : "Няма данни"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Среден месечен разход ремонти:
                    </TableCell>
                    <TableCell align="right">
                      {months
                        ? (
                            services.data.reduce(
                              (acc, obj) => acc + obj.cost,
                              0
                            ) / months
                          ).toFixed(2) + " лв."
                        : "Няма данни"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Среден разход на км (ремонти):
                    </TableCell>
                    <TableCell align="right">
                      {vehicle.km - vehicle.startKm
                        ? (
                            services.data.reduce(
                              (acc, obj) => acc + obj.cost,
                              0
                            ) /
                            (vehicle.km - vehicle.startKm)
                          ).toFixed(2) + " лв."
                        : "Няма данни"}
                    </TableCell>
                  </TableRow> */}
            {/* <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  > */}
            {/* <TableCell
                      sx={{ textAlign: "center" }}
                      component="th"
                      scope="row"
                    >
                      Гориво
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Гориво общо:
                    </TableCell>
                    <TableCell align="right">
                      {fuels.data
                        .reduce((acc, obj) => acc + obj.cost, 0)
                        .toLocaleString()}{" "}
                      лв.
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Среден месечен разход гориво:
                    </TableCell>
                    <TableCell align="right">
                      {months
                        ? (
                            fuels.data.reduce((acc, obj) => acc + obj.cost, 0) /
                            months
                          ).toFixed(2) + " лв."
                        : "Няма данни"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Среден разход на км (гориво):
                    </TableCell>
                    <TableCell align="right">
                      {vehicle.km - vehicle.startKm
                        ? (
                            fuels.data.reduce((acc, obj) => acc + obj.cost, 0) /
                            (vehicle.km - vehicle.startKm)
                          ).toFixed(2) + " лв."
                        : "Няма данни"}
                    </TableCell>
                  </TableRow> */}
            {/* </TableBody>
              </Table>
            </TableContainer>
          </div> */}
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default Services;
