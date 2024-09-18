import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button, TextField, MenuItem } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CreateVehicle from "../pages/CreateVehicle";

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
    id: "model",
    numeric: false,
    disablePadding: false,
    label: "Марка/Модел",
  },
  {
    id: "reg",
    numeric: false,
    disablePadding: false,
    label: "Рег. №",
  },

  {
    id: "insDate",
    numeric: true,
    disablePadding: false,
    label: "ГО до:",
  },
  {
    id: "kaskoDate",
    numeric: false,
    disablePadding: false,
    label: "Каско до:",
  },
  {
    id: "gtp",
    numeric: true,
    disablePadding: false,
    label: "ГТП до:",
  },
  {
    id: "tax",
    numeric: true,
    disablePadding: false,
    label: "Данък за:",
  },
  {
    id: "oil",
    numeric: false,
    disablePadding: false,
    label: "Масло преди:",
  },
  {
    id: "checked",
    numeric: true,
    disablePadding: false,
    label: "Проверен на:",
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function VehiclesList({ data }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("model");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [filter, setFilter] = React.useState("all");
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState(data);
  const [copyList, setCopyList] = useState();
  const [userRole, setUserRole] = useState();
  const [username, setUsername] = useState();
  const [add, setAdd] = useState(false);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  // Search

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
      const { status, user, role } = data;
      setUsername(user);
      setUserRole(role);
    };
    verifyUser();
  }, [token, navigate]);
  const bgToLatin = {
    А: "A",
    В: "B",
    Н: "H",
    Р: "P",
    Т: "T",
    Е: "E",
    К: "K",
    М: "M",
    О: "O",
    С: "C",
    Х: "X",
    У: "Y",
  };
  const requestSearch = (searched) => {
    if (!searched.match(/[a-z,A-Z,0-9]{1,2}[0-9]{0,4}[a-z,A-Z]{0,2}$/)) {
      searched = searched
        .toUpperCase()
        .split("")
        .map((char) => bgToLatin[char])
        .join("");
    }
    if (searched) {
      setCopyList(
        data.filter((item) =>
          // item.make.toUpperCase().includes(searched.toUpperCase()) ||
          // item.model.toUpperCase().includes(searched.toUpperCase()) ||
          item.reg.toUpperCase().includes(searched.toUpperCase())
        )
      );
    } else {
      setCopyList();
    }
  };
  const handleCloseAdd = () => {
    setAdd(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  React.useEffect(() => {
    setFilter(filter.slice());
  }, [filter]);
  const location = useLocation();

  const handleFilter = (e) => {
    setFilter(e.target.value);
    if (!e.target.value || e.target.value === "all") {
      setCopyList();
    } else {
      setCopyList(data.filter((item) => item.site === e.target.value));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    navigate(`/vehicles/details/${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () => {
      if (copyList) {
        return stableSort(copyList, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        );
      } else {
        return stableSort(data, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        );
      }
    },
    // stableSort(data, getComparator(order, orderBy)).slice(
    //   page * rowsPerPage,
    //   page * rowsPerPage + rowsPerPage
    // ),

    [order, orderBy, page, rowsPerPage]
  );

  //Function to rearrange date format to match DD/MM/YYYY
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };

  const isDue = (dueDate, type, oilChange) => {
    if (type === "date") {
      if (dueDate <= dayjs().add(1, "week").toISOString()) {
        return "warning";
      } else if (dueDate <= dayjs().add(1, "month").toISOString()) {
        return "caution";
      }
    } else if (type === "checked") {
      if (
        dayjs(dueDate).add(1, "month").toISOString() <= dayjs().toISOString()
      ) {
        return "warning";
      } else if (
        dayjs(dueDate).add(3, "week").toISOString() < dayjs().toISOString()
      ) {
        return "caution";
      }
    } else if (type === "oil") {
      if (dueDate > oilChange) {
        return "warning";
      } else if (dueDate > oilChange - 1000) {
        return "caution";
      }
    }
  };
  // const tableData = data.map((obj) => {
  //   return [
  //     obj.make + " " + obj.model,
  //     obj.reg,
  //     bgDate(obj.insDate.slice(0, 10)),
  //     bgDate(obj.kaskoDate.slice(0, 10)),
  //     bgDate(obj.gtp.slice(0, 10)),
  //     obj.tax,
  //     obj.km - obj.oil + "km",
  //     bgDate(obj.checked.slice(0, 10)),
  //     obj._id,
  //   ];
  // });

  // const columns = [
  //   {
  //     name: "Марка/Модел",
  //     options: {
  //       sortDirection: "desc",
  //     },
  //   },
  //   { name: "Рег №" },
  //   {
  //     name: "ГО:",
  //     options: {
  //       customBodyRender: (value, tableMeta, updateValue) => {
  //         return (
  //           <Box
  //             style={
  //               isDue(value, "date") === "warning"
  //                 ? { color: "red" }
  //                 : isDue(value, "date") === "caution"
  //                 ? { color: "orange" }
  //                 : {}
  //             }
  //           >
  //             {isDue(value, "date") ? <WarningAmberIcon /> : ""}
  //             {value}
  //           </Box>
  //         );
  //       },
  //     },
  //   },
  //   {
  //     name: "Каско:",
  //     options: {
  //       customBodyRender: (value, tableMeta, updateValue) => {
  //         return (
  //           <Box
  //             style={
  //               isDue(value, "date") === "warning"
  //                 ? // && row.kasko
  //                   { color: "red" }
  //                 : isDue(value, "date") === "caution"
  //                 ? // && row.kasko
  //                   { color: "orange" }
  //                 : {}
  //             }
  //           >
  //             {isDue(value, "date") ? (
  //               // && row.kasko
  //               <WarningAmberIcon />
  //             ) : (
  //               ""
  //             )}
  //             {value == "2001-01-01T00:00:00.000Z" ||
  //             value == null ||
  //             value == "31.12.2000"
  //               ? "Няма"
  //               : value}
  //           </Box>
  //         );
  //       },
  //     },
  //   },
  //   {
  //     name: "ГТП:",
  //     options: {
  //       customBodyRender: (value, tableMeta, updateValue) => {
  //         return (
  //           <Box
  //             style={
  //               isDue(value, "date") === "warning"
  //                 ? { color: "red" }
  //                 : isDue(value, "date") === "caution"
  //                 ? { color: "orange" }
  //                 : {}
  //             }
  //           >
  //             {isDue(value, "date") ? <WarningAmberIcon /> : ""}
  //             {value}
  //           </Box>
  //         );
  //       },
  //     },
  //   },
  //   { name: "Данък:" },
  //   { name: "Масло преди:" },
  //   { name: "Проверен:" },
  //   {
  //     name: "ID",
  //     options: {
  //       display: false,
  //     },
  //   },
  // ];
  // const getMuiTheme = () =>
  //   createTheme({
  //     overrides: {
  //       MuiChip: {
  //         root: {
  //           backgroundColor: "lightgrey",
  //         },
  //       },
  //     },
  //     component: {
  //       MuiTableCell: {
  //         root: {
  //           backgroundColor: "green !important",
  //         },
  //       },
  //     },
  //   });
  // const options = {
  //   filterType: "checkbox",

  //   selectableRows: false,
  //   download: false,
  //   onRowClick: (rowData, rowMeta) => handleClick(rowData[8]),
  //   rowsPerPage: 20,
  //   rowsPerPageOptions: [20, 50, 100],
  //   // expandableRowsOnClick: true,
  //   // expandableRows: true,
  //   textLabels: {
  //     body: {
  //       noMatch: "Нищо не е намерено",
  //     },
  //     pagination: {
  //       next: "Следваща страница",
  //       previous: "Предишна страница",
  //       rowsPerPage: "Покажи по:",
  //       displayRows: "от", // 1-10 of 30
  //     },
  //     toolbar: {
  //       search: "Търсене",
  //       downloadCsv: "Изтегли CSV",
  //       print: "Принтирай",
  //       viewColumns: "Показване на колони",
  //       filterTable: "Филтри",
  //     },
  //     filter: {
  //       title: "ФИЛТРИ",
  //       reset: "изчисти",
  //     },
  //     viewColumns: {
  //       title: "Покажи колони",
  //     },
  //     selectedRows: {
  //       text: "rows(s) deleted",
  //       delete: "Delete",
  //     },
  //   },
  // };

  return (
    <div className="flex justify-center">
      <Dialog
        maxWidth={"xl"}
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Добавяне на нов автомобил`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <CreateVehicle />
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
      <Box sx={{ width: "95%", margin: "25px" }}>
        {/* <ThemeProvider theme={getMuiTheme()}> */}
        {/* <MUIDataTable
            title={""}
            data={tableData}
            columns={columns}
            options={options}
          /> */}
        {/* <TextField
          placeholder="search..."
          value={searchedVal}
          onChange={handleSearch}
        ></TextField> */}

        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer
            sx={{ backgroundColor: "rgb(180, 180, 180)", borderRadius: "5px" }}
          >
            <div className="flex">
              <TextField
                select
                size="small"
                // fullWidth
                sx={{ width: "46%" }}
                variant="outlined"
                placeholder="Регистрационен номер ..."
                type="search"
                value={filter}
                onChange={handleFilter}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem key={1} value="all">
                  ВСИЧКИ
                </MenuItem>
                <MenuItem key={2} value="ОФИС">
                  ОФИС
                </MenuItem>
                <MenuItem key={3} value="СКЛАД">
                  СКЛАД
                </MenuItem>
              </TextField>
              <TextField
                size="small"
                // fullWidth
                sx={{ width: "46%" }}
                variant="outlined"
                placeholder="Регистрационен номер ..."
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

              <Button
                disabled={userRole === "user" || !userRole ? true : false}
                sx={{ width: "8%" }}
                variant={"contained"}
                // component={Link}
                // to="/vehicles/create"
                onClick={() => setAdd(true)}
              >
                {"ДОБАВИ"}
                <AddCircleOutlineIcon />

                {/* <AddIcon /> */}
              </Button>
            </div>

            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />

              <TableBody>
                {(copyList ? copyList : visibleRows).map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row._id)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: "#ccc",
                        "&:hover": {
                          backgroundColor: "#000000",
                          boxShadow: "none",
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        // padding="5px"
                      >
                        {`${row.make} ${row.model}`}
                      </TableCell>
                      <TableCell>{row.reg}</TableCell>

                      <TableCell
                        style={
                          isDue(row.insDate, "date") === "warning"
                            ? { color: "red" }
                            : isDue(row.insDate, "date") === "caution"
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {isDue(row.insDate, "date") ? <WarningAmberIcon /> : ""}
                        {bgDate(row.insDate.slice(0, 10))}
                      </TableCell>
                      <TableCell
                        style={
                          isDue(row.kaskoDate, "date") === "warning" &&
                          row.kasko
                            ? { color: "red" }
                            : isDue(row.kaskoDate, "date") === "caution" &&
                              row.kasko
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {isDue(row.kaskoDate, "date") && row.kasko ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                        {row.kaskoDate == "2001-01-01T00:00:00.000Z" ||
                        row.kaskoDate == null ||
                        bgDate(row.kaskoDate.slice(0, 10)) == "31.12.2000"
                          ? "Няма"
                          : bgDate(row.kaskoDate.slice(0, 10))}
                      </TableCell>
                      <TableCell
                        style={
                          isDue(row.gtp, "date") === "warning"
                            ? { color: "red" }
                            : isDue(row.gtp, "date") === "caution"
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {isDue(row.gtp, "date") ? <WarningAmberIcon /> : ""}
                        {bgDate(row.gtp.slice(0, 10))}
                      </TableCell>
                      <TableCell
                        style={
                          isDue(row.gtp, "date") && row.tax < dayjs().year()
                            ? { color: "red" }
                            : {}
                        }
                      >
                        {isDue(row.gtp, "date") && row.tax < dayjs().year() ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                        {row.tax}
                      </TableCell>
                      <TableCell
                        style={
                          isDue(row.km - row.oil, "oil", row.oilChange) ===
                          "warning"
                            ? { color: "red" }
                            : isDue(row.km - row.oil, "oil", row.oilChange) ===
                              "caution"
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {row.km - row.oil + " km"}
                        {isDue(row.km - row.oil, "oil", row.oilChange) ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                      </TableCell>
                      <TableCell
                        style={
                          isDue(row.checked, "checked") === "warning"
                            ? { color: "red" }
                            : isDue(row.checked, "checked") === "caution"
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {row.checked ? bgDate(row.checked.slice(0, 10)) : ""}
                        {isDue(row.checked, "checked") ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
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
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage={"Покажи по:"}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} от ${count !== -1 ? count : `MORE THAN ${to}`}`
            }
            rowsPerPageOptions={[10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Смали таблицата"
        />
        {/* </ThemeProvider> */}
      </Box>
    </div>
  );
}
