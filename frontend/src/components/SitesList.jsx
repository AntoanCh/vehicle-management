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
    label: "Обект",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Адрес",
  },

  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Телефон:",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
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
            align={
              headCell.id === "actions" || headCell.id === "id"
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
const Sites = ({ sites }) => {
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
  const latinToBg = {
    H: "Н",
    N: "Н",
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    0: "0",
  };
  const requestSearch = (searched) => {
    if (searched.match(/[a-z,A-Z,0-9]+$[0-9]{0,1}?$/)) {
      searched = searched
        .toUpperCase()
        .split("")
        .map((char) => latinToBg[char])
        .join("");
    }
    if (searched) {
      setCopyList(
        sites.data.filter((item) =>
          item.name.toUpperCase().includes(searched.toUpperCase())
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sites.length) : 0;
  setTimeout(() => {}, 1000);
  const visibleRows = React.useMemo(() => {
    if (copyList) {
      return stableSort(copyList, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return sites.data
        ? stableSort(sites.data, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
        : [];
    }
  }, [order, orderBy, page, rowsPerPage]);
  //
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const { name, address, phone, email } = input;

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
      const { data } = await axios.post("http://192.168.0.147:5555/api/sites", {
        ...input,
      });
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
      name: "",
      address: "",
      phone: "",
      email: "",
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
        `http://192.168.0.147:5555/api/sites/${edit[1]._id}`,
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

  const data = sites.data
    ? sites.data.map((obj) => {
        return [
          obj.name,
          obj.address,
          obj.phone,
          obj.email,

          // userRole === "admin" || userRole === vehicle.site ? (
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

          // ) : (
          //   ""
          // ),
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
          {`Сигурен ли сте, че искате да изтриете обект ${verifyDelete[1].name} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/api/sites/${verifyDelete[1]._id}`
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
          {`РЕДАКТИРАНЕ ${edit[1].name}`}
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
                  name="name"
                  label="Обект:"
                  value={edit[1].name}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес:"
                  value={edit[1].address}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  type="phone"
                  fullWidth
                  name="phone"
                  label="Tелефон:"
                  value={edit[1].phone}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </div>
              <div className="my-4">
                <TextField
                  type="email"
                  fullWidth
                  name="email"
                  label="Еmail:"
                  value={edit[1].email}
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
        <DialogTitle id="alert-dialog-title">{"Добавяне на обект"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  fullWidth
                  name="name"
                  label="Обект:"
                  value={name}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес:"
                  value={address}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  type="phone"
                  fullWidth
                  name="phone"
                  label="Tелефон:"
                  value={phone}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </div>
              <div className="my-4">
                <TextField
                  type="email"
                  fullWidth
                  name="email"
                  label="Еmail:"
                  value={email}
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
            {/* <MUIDataTable
              title={"ОБЕКТИ"}
              data={data}
              columns={columns}
              options={options}
            /> */}

            {/* {handleLoading()}
            {loading ? (
              <CircularProgress />
            ) : ( */}

            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer sx={{ borderRadius: "3px" }}>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey" }}>
                      <TableCell sx={{ fontWeight: "800", fontSize: "20px" }}>
                        ОБЕКТИ
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          sx={{
                            backgroundColor: "#bdbdbd",
                          }}
                          variant="outlined"
                          placeholder="Обект..."
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
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  {sites.data && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={sites.data.length}
                    />
                  )}

                  {sites.data && (
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
                              {row.name}
                            </TableCell>
                            <TableCell>{row.address}</TableCell>

                            <TableCell align="right">{row.phone}</TableCell>
                            <TableCell align="right">{row.email}</TableCell>
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
                count={sites.data ? sites.data.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <Button fullWidth variant="contained" onClick={handleAddModal}>
                Добави Обект
                <AddBusinessIcon />
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

export default Sites;
