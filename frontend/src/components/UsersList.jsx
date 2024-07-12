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
import Register from "../pages/Register";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

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
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Потребител",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Права",
  },

  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "ID:",
  },
  {
    id: "delete",
    numeric: false,
    disablePadding: false,
    label: "Изтриване",
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
            align={
              headCell.id === "delete" || headCell.id === "id"
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
                  {order === "username"
                    ? "sorted descending"
                    : "sorted ascending"}
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

const Users = ({ users }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, 0]);
  const [add, setAdd] = useState(false);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleAdd = () => {
    setAdd(true);
  };

  const handleDelete = () => {
    // axios.delete(`http://192.168.0.147/users/${e}`)
  };
  const handleCancel = () => {
    setAdd(false);
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("model");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [currentUser, setCurrentUser] = useState();
  const [newData, setNewData] = useState({ password: "", role: "" });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (newData.role === "") {
        setNewData({ newData, role: currentUser.role });
      }
      if (newData.password === "") {
        setNewData({ newData, password: currentUser.password });
      }
      const { data } = await axios.post(
        "http://192.168.0.147:5555/auth/update",
        {
          ...newData,
        }
      );
      const { status, message } = data;

      // if (status) {
      //   handleSuccess(message);
      //   window.location.reload();
      // } else {
      //   handleError(message);
      // }
    } catch (error) {
      console.log(error);
    }
    setNewData({
      ...newData,
      username: "",
      password: "",
      role: "",
    });
  };
  const handleClick = (event, id) => {
    setEdit([true, id]);
    setCurrentUser(users.data.filter((obj) => obj._id === id));
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChange = (e) => {
    if (e.target.name === "role") {
      setNewData({
        ...currentUser[0],
        password: newData.password,
        role: e.target.value,
      });
    }
    if (e.target.name === "password") {
      setNewData({
        ...currentUser[0],
        role: newData.role,
        password: e.target.value,
      });
    }
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;
  setTimeout(() => {}, 1000);
  const visibleRows = React.useMemo(
    () =>
      users.data
        ? stableSort(users.data, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
        : [],
    [order, orderBy, page, rowsPerPage]
  );
  const handleClose = () => {
    setEdit(false);
  };
  return (
    <div>
      <Dialog
        open={edit[0]}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {currentUser ? currentUser[0].username : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <span>Права: </span>
            <span>{currentUser ? currentUser[0].role : ""}</span>
          </div>
          <div>
            <span>ID: </span>
            <span>{currentUser ? currentUser[0]._id : ""}</span>
          </div>
          <div className="my-2">
            <TextField
              fullWidth
              type="password"
              name="password"
              id="password"
              label="Нова Парола:"
              variant="filled"
              value={newData.password}
              onChange={handleChange}
            />
          </div>
          <div className="my-2">
            <TextField
              fullWidth
              name="role"
              select
              id="role"
              label="Права:"
              variant="filled"
              value={newData.role}
              onChange={handleChange}
            >
              <MenuItem key={1} value="admin">
                ADMIN
              </MenuItem>
              <MenuItem key={2} value="user">
                USER
              </MenuItem>
              <MenuItem key={3} value="office">
                ОФИС ОТГОВОРНИК
              </MenuItem>
              <MenuItem key={4} value="warehouse">
                СКЛАД ОТГОВОРНИК
              </MenuItem>
            </TextField>
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
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Запази
          </Button>
        </DialogActions>
      </Dialog>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="my-4 flex flex-col items-center">
          <h1 className="text-center text-2xl">ПОТРЕБИТЕЛИ</h1>
          <Box sx={{ width: "50%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  {users.data && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={users.data.length}
                    />
                  )}

                  {users.data && (
                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            onClick={(event) => {
                              handleClick(event, row._id);
                            }}
                            hover
                            key={row._id}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#ccc",
                              "&:hover": {
                                backgroundColor: "#000000",
                                boxShadow: "none",
                              },
                            }}
                          >
                            <TableCell component="th" id={labelId} scope="row">
                              {row.username}
                            </TableCell>
                            <TableCell>{row.role}</TableCell>
                            <TableCell align="right">{row._id}</TableCell>
                            <TableCell align="right">
                              <Button
                                onClick={() => {
                                  axios
                                    .delete(
                                      `http://192.168.0.147:5555/users/${row._id}`
                                    )
                                    .then(() => {
                                      window.location.reload();
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.data ? users.data.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <div className="flex justify-end">
                {add ? (
                  <Button
                    color="warning"
                    fullWidth
                    variant="contained"
                    onClick={handleCancel}
                  >
                    Отказ
                    <CancelIcon />
                  </Button>
                ) : (
                  <Button fullWidth variant="contained" onClick={handleAdd}>
                    Добави
                    <AddCircleOutlineIcon />
                  </Button>
                )}
              </div>
              {/* {add ? <Register /> : ""} */}
              <Dialog
                open={add}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Добави Потребител"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                  <div className="">
                    <Register />
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
                  {/* <Button variant="contained" onClick={handleUpdate} autoFocus>
                    Запази
                  </Button> */}
                </DialogActions>
              </Dialog>
            </Paper>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Users;
