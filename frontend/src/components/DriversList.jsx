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
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

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
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Име",
  },

  {
    id: "barcode",
    numeric: false,
    disablePadding: false,
    label: "Номер карта",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Дейстия",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "grey" }}>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ fontWeight: 800 }}
            align={
              headCell.id === "actions" || headCell.id === "barcode"
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
                  {order === "name" ? "sorted descending" : "sorted ascending"}
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
const Drivers = ({ drivers }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, {}]);
  const [add, setAdd] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
  const [copyList, setCopyList] = useState();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("model");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const requestSearch = (searched) => {
    if (searched) {
      setCopyList(
        drivers.data.filter(
          (item) =>
            item.firstName.toUpperCase().includes(searched.toUpperCase()) ||
            item.lastName.toUpperCase().includes(searched.toUpperCase()) ||
            item.barcode.toString().includes(searched)
        )
      );
    } else {
      setCopyList();
    }
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - drivers.length) : 0;
  setTimeout(() => {}, 1000);
  const visibleRows = React.useMemo(() => {
    if (copyList) {
      return stableSort(copyList, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return drivers.data
        ? stableSort(drivers.data, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
        : [];
    }
  }, [order, orderBy, page, rowsPerPage]);
  //
  const navigate = useNavigate();
  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    barcode: "",
  });
  const { firstName, lastName, barcode } = input;

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEdit([true, { ...edit[1], [name]: value }]);
    console.log(edit);
  };

  const handleCloseEdit = () => {
    setEdit([false, {}]);
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/api/drivers",
        {
          ...input,
        }
      );
      const { status, message } = data;

      if (status) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    setInput({
      ...input,
      firstName: "",
      lastName: "",
      barcode: "",
    });
  };
  //
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleAddModal = () => {
    setAdd(true);
  };

  const handleDelete = () => {
    // axios.delete(`http://192.168.0.147/sites/${e}`)
  };
  const handleCloseAdd = () => {
    setAdd(false);
  };

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `http://192.168.0.147:5555/api/drivers/${edit[1]._id}`,
        {
          ...edit[1],
        }
      );
      const { status, message } = data;

      // if (status) {
      //   handleSuccess(message);
      //   window.location.reload();
      // } else {
      //   handleError(message);
      // }
      setEdit([false, {}]);
    } catch (error) {
      console.log(error);
    }
    setEdit([false, {}]);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const data = drivers.data
    ? drivers.data.map((obj) => {
        return [
          obj.firstName,
          obj.lastName,
          obj.barcode,
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
          </Box>,
        ];
      })
    : [];

  const columns = [
    {
      name: "Обект",
      options: {
        sortDirection: "desc",
      },
    },
    { name: "Адрес" },
    { name: "Телефон" },
    { name: "Email" },
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
    <Box>
      <Dialog
        open={verifyDelete[0]}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {`Сигурен ли сте, че искате да изтриете шофьор] ${verifyDelete[1].name} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/api/drivers/${verifyDelete[1]._id}`
                )
                .then(() => {
                  window.location.reload();
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
        <DialogTitle id="alert-dialog-title">
          {`РЕДАКТИРАНЕ ${edit[1].firstName} ${edit[1].lastName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <span>ID: </span>
            <span>{edit ? edit[1]._id : ""}</span>
          </div>

          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  fullWidth
                  name="firstName"
                  label="Име:"
                  value={edit[1].firstName}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="lastName"
                  label="Фамилия:"
                  value={edit[1].lastName}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>

              <div className="my-4">
                <TextField
                  fullWidth
                  name="barcode"
                  label="Номер карта:"
                  value={edit[1].barcode}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </div>
            </div>
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
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Обнови
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Добавяне на шофьор"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  fullWidth
                  name="firstName"
                  label="Име:"
                  value={firstName}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="lastName"
                  label="Фамилия:"
                  value={lastName}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>

              <div className="my-4">
                <TextField
                  fullWidth
                  name="barcode"
                  label="Номер карта:"
                  value={barcode}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </div>
              {/* <div className="my-4">
                <Button onClick={handleSubmit} fullWidth variant="outlined">
                  ЗАПИШИ
                </Button>
              </div> */}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => setAdd(false)}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleAddSubmit} autoFocus>
            Добави
          </Button>
        </DialogActions>
      </Dialog>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className="my-4 flex flex-col items-center">
          <Box sx={{ width: "50%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer sx={{ borderRadius: "3px" }}>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey" }}>
                      <TableCell sx={{ fontWeight: "800", fontSize: "20px" }}>
                        {"ШОФЬОРИ"}
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          sx={{
                            backgroundColor: "#bdbdbd",
                          }}
                          variant="outlined"
                          placeholder="Търси..."
                          type="search"
                          onInput={(e) => requestSearch(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  {drivers.data && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={drivers.data.length}
                    />
                  )}

                  {drivers.data && (
                    <TableBody>
                      {(copyList ? copyList : visibleRows).map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow hover key={row._id}>
                            <TableCell
                              sx={{ fontWeight: "800" }}
                              component="th"
                              id={labelId}
                              scope="row"
                            >
                              {`${row.firstName} ${row.lastName}`}
                            </TableCell>
                            <TableCell align="right">{row.barcode}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => {
                                  setEdit([true, row]);
                                }}
                                color="warning"
                                variant="outlined"
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  setVerifyDelete([true, row]);
                                }}
                                color="error"
                                variant="contained"
                              >
                                <DeleteForeverIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}

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
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} от ${count !== -1 ? count : `MORE THAN ${to}`}`
                }
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={drivers.data ? drivers.data.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <Button fullWidth variant="contained" onClick={handleAddModal}>
                Добави Шофьор
                <PersonAddAlt1Icon />
              </Button>
            </Paper>

            {/* )}
             */}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Drivers;
