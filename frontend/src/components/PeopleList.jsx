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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link } from "react-router-dom";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CreatePerson from "../pages/CreatePerson";
import { styled } from "@mui/system";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const TableCellNarrow = styled(TableCell)`
  :last-of-type {
    width: 80;
    max-width: 80;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
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
    id: "site",
    numeric: false,
    disablePadding: false,
    label: "Обект",
  },
  {
    id: "job",
    numeric: false,
    disablePadding: false,
    label: "Длъжност",
  },
  {
    id: "employmentDate",
    numeric: false,
    disablePadding: false,
    label: "Дата на постъпване:",
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
    id: "address",
    numeric: true,
    disablePadding: false,
    label: "Адрес",
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
            style={
              headCell.id === "site"
                ? {
                    width: 100,
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    borderStyle: "border-box",
                  }
                : {}
            }
            align={headCell.id === "actions" ? "right" : "left"}
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

const PeopleList = ({ sites, people, siteName, siteId }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, {}]);
  const [transfer, setTransfer] = useState([false, {}]);
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
        people.data.filter(
          (item) =>
            item.firstName.toUpperCase().includes(searched.toUpperCase()) ||
            item.middleName.toUpperCase().includes(searched.toUpperCase()) ||
            item.lastName.toUpperCase().includes(searched.toUpperCase())
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
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (people ? people.data.length : 0)
        )
      : 0;
  setTimeout(() => {}, 1000);
  const visibleRows = React.useMemo(() => {
    if (copyList) {
      return stableSort(copyList, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return stableSort(people.data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
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

  const handleChangeTransfer = (e) => {
    const { value } = e.target;
    const siteSelected = sites.filter((obj) => obj.name === value);
    setTransfer([
      true,
      { ...transfer[1], site: value, siteId: siteSelected[0]._id },
    ]);
  };

  const handleCloseTransfer = () => {
    setTransfer([false, {}]);
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

  const handleSubmit = () => {};
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
        `http://192.168.0.147:5555/api/person/${transfer[1]._id}`,
        {
          ...transfer[1],
        }
      );
      const { status, message } = data;

      setTransfer([false, {}]);
    } catch (error) {
      console.log(error);
    }
    setEdit([false, {}]);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClick = (event, id) => {
    navigate(`/people/details/${id}`);
  };
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
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
          {`Сигурен ли сте, че искате да изтриете ${verifyDelete[1].firstName} ${verifyDelete[1].middleName} ${verifyDelete[1].lastName} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/api/person/${verifyDelete[1]._id}`
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
        open={transfer[0]}
        onClose={handleCloseTransfer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`ПРЕХВЪРЛЯНЕ В ДРУГ ОБЕКТ`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <span
              style={{ fontWeight: 800 }}
            >{`${transfer[1].firstName} ${transfer[1].middleName} ${transfer[1].lastName}`}</span>
          </div>

          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  type="text"
                  fullWidth
                  name="site"
                  select
                  label="Обект:"
                  value={transfer[1].site}
                  onChange={handleChangeTransfer}
                  variant="filled"
                >
                  {sites.map((obj, index) => (
                    <MenuItem key={index} value={obj.name}>
                      {obj.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <span>{`siteId: ${transfer[1].siteId}`}</span>
            </div>
          </div>
          <Box>
            <span>ID: </span>
            <span>{transfer ? transfer[1]._id : ""}</span>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseTransfer}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Запиши
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth={"xl"}
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Добавяне на нов служител към ${siteName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <CreatePerson siteId={siteId} siteName={siteName} />
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
        </DialogActions>
      </Dialog>{" "}
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className="my-4 flex flex-col items-center">
          <Box sx={{ width: "100%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer sx={{ borderRadius: "3px" }}>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey" }}>
                      <TableCell sx={{ fontWeight: "800", fontSize: "20px" }}>
                        {`ПЕРСОНАЛ НА ${siteName}`}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
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
                      <TableCell>
                        {" "}
                        <Button
                          onClick={() => setAdd(true)}
                          // onClick={() =>
                          //   navigate("/hr/create", {
                          //     state: { siteName, siteId },
                          //   })
                          // }
                          variant="contained"
                        >
                          ДОБАВИ <AddCircleOutlineIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {people && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={people.data.length}
                    />
                  )}

                  {people && (
                    <TableBody>
                      {(copyList ? copyList : visibleRows).map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#ccc",
                              "&:hover": {
                                backgroundColor: "#000000",
                                boxShadow: "none",
                              },
                            }}
                            hover
                            onClick={(event) => handleClick(event, row._id)}
                            key={row._id}
                          >
                            <TableCell
                              sx={{ fontWeight: "800" }}
                              component="th"
                              id={labelId}
                              scope="row"
                            >
                              {`${row.firstName} ${row.middleName} ${row.lastName}`}
                            </TableCell>
                            <TableCell>{row.site}</TableCell>
                            <TableCell>{row.job}</TableCell>
                            <TableCell align="left">
                              {
                                bgDate(row.employmentDate.slice(0, 10))
                                // row.employmentDate
                              }
                            </TableCell>
                            <TableCell align="left">{`+359 ${row.phone}`}</TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                            <TableCell align="left">
                              {row.addressReal}
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTransfer([true, row]);
                                }}
                                color="success"
                                variant="contained"
                              >
                                <TransferWithinAStationIcon />
                              </IconButton>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
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
                count={people ? people.data.length : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>

            {/* )}
             */}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PeopleList;
