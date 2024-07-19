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
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

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
    id: "password",
    numeric: false,
    disablePadding: false,
    label: "",
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
    label: "",
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
                ? "center"
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
  const [edit, setEdit] = useState([false, 0, ""]);
  const [add, setAdd] = useState(false);
  const [editUser, setEditUser] = useState();
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (edit[2] === "role") {
      try {
        const { data } = await axios.post(
          "http://192.168.0.147:5555/auth/updaterole",
          {
            ...editUser,
          }
        );
        const { status, message } = data;

        // if (status) {
        //   handleSuccess(message);
        //   window.location.reload();
        // } else {
        //   handleError(message);
        // }
        setEdit([false, 0, ""]);
        setEditUser({});
      } catch (error) {
        console.log(error);
      }
    } else if (edit[2] === "password") {
      try {
        const { data } = await axios.post(
          "http://192.168.0.147:5555/auth/updatepswrd",
          {
            ...editUser,
          }
        );
        const { status, message } = data;

        // if (status) {
        //   handleSuccess(message);
        //   window.location.reload();
        // } else {
        //   handleError(message);
        // }
        setEdit([false, 0, ""]);
        setEditUser({});
      } catch (error) {
        console.log(error);
      }
      setEdit([false, 0, ""]);
      setEditUser({});
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handleEdit = (event, id, type) => {
    setEdit([true, id, type]);

    if (type === "password") {
      setEditUser({
        ...users.data.filter((obj) => obj._id === id)[0],
        password: "",
      });
    } else {
      setEditUser(users.data.filter((obj) => obj._id === id)[0]);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChange = (e) => {
    if (e.target.name === "role") {
      setEditUser({ ...editUser, role: e.target.value });
    }
    if (e.target.name === "password") {
      setEditUser({ ...editUser, password: e.target.value });
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
    setEdit([false, 0, ""]);
  };
  return (
    <div>
      <Dialog
        open={verifyDelete[0]}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {`Сигурен ли сте, че искате да изтриете потребител ${verifyDelete[1].username} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/users/${verifyDelete[1]._id}`
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
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {editUser ? editUser.username : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <span>ID: </span>
            <span>{editUser ? editUser._id : ""}</span>
          </div>

          {edit[2] === "role" ? (
            <>
              <div>
                <span>Права: </span>
                <span>{editUser ? editUser.role : ""}</span>
              </div>
              <div className="my-2">
                <TextField
                  fullWidth
                  name="role"
                  select
                  id="role"
                  label="Нови Права:"
                  variant="filled"
                  value={editUser.role}
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
            </>
          ) : (
            ""
          )}
          {edit[2] === "password" ? (
            <div className="my-2">
              <TextField
                fullWidth
                type="password"
                name="password"
                id="password"
                label="Нова Парола:"
                variant="filled"
                value={editUser.password}
                onChange={handleChange}
              />
            </div>
          ) : (
            ""
          )}
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
            Обнови
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
                          <TableRow hover key={row._id}>
                            <TableCell component="th" id={labelId} scope="row">
                              {row.username}
                            </TableCell>
                            <TableCell>
                              {row.role}
                              <IconButton
                                color="warning"
                                onClick={(event) => {
                                  handleEdit(event, row._id, "role");
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                onClick={(event) => {
                                  handleEdit(event, row._id, "password");
                                }}
                                color="warning"
                                variant="outlined"
                              >
                                <LockResetIcon />
                                ПРОМЕНИ ПАРОЛА
                              </Button>
                            </TableCell>
                            <TableCell align="right">{row._id}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => {
                                  setVerifyDelete([
                                    true,
                                    users.data.filter(
                                      (obj) => obj._id === row._id
                                    )[0],
                                  ]);
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
                    Добави Потребител
                    <PersonAddAlt1Icon />
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
