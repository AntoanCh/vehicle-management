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
import { Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import dayjs from "dayjs";
//test
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import ButtonGroup from "@mui/material/ButtonGroup";
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
    label: "Вид гориво",
  },

  {
    id: "station",
    numeric: false,
    disablePadding: false,
    label: "Бензиностанция",
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
              headCell.id === "cost" || headCell.id === "km" ? "right" : "left"
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
const Fuels = ({ vehicle, fuels }) => {
  const [loading, setLoading] = useState(false);

  const [newFuel, setNewFuel] = useState({
    date: "",
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
      .then(() => {})
      .catch((err) => {
        // setLoading(false);
        alert("Грешка, проверете конзолата");
        console.log(err);
      });

    window.location.reload();
  };
  const handleCancel = () => {
    setAdd(false);
  };
  const handleChange = (e) => {
    const newData = { ...newFuel };
    newData[e.target.id] = e.target.value;
    setNewFuel({ ...newData });
  };
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };
  const months = dayjs().diff(vehicle.startDate, "month");
  //test
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
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fuels.length) : 0;
  setTimeout(() => {}, 1000);
  const visibleRows = React.useMemo(
    () =>
      fuels.data
        ? stableSort(fuels.data, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
        : [],
    [order, orderBy, page, rowsPerPage]
  );
  //test

  return (
    <div>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="my-4">
          <h1 className="text-center text-2xl">Гориво</h1>
          {/* test */}
          <Box sx={{ width: "100%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  {fuels.data && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={fuels.data.length}
                    />
                  )}

                  {fuels.data && (
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
                            <TableCell>{row.station}</TableCell>
                            <TableCell>{row.invoice}</TableCell>
                            <TableCell align="right">{row.km} км.</TableCell>
                            <TableCell align="right">{row.cost} лв.</TableCell>
                          </TableRow>
                        );
                      })}
                      {add ? (
                        <TableRow>
                          <TableCell component="th" scope="row" align="left">
                            {" "}
                            <div className="flex justify-start">
                              <input
                                value={newFuel.date}
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
                                  width: "200px",
                                  borderRadius: "5px",
                                  color: "white",
                                  backgroundColor: "rgb(100, 100, 100)",
                                  textAlign: "center",
                                }}
                                onChange={handleChange}
                                value={newFuel.type}
                                id="type"
                              >
                                <option value="DIESEL">DIESEL</option>
                                <option value="A95">A95</option>
                                <option value="A98">A98</option>
                                <option value="A100">A100</option>
                                <option value="AdBlue">AdBlue</option>
                                <option value=""></option>
                                <option value=""></option>
                              </select>
                            </div>
                          </TableCell>

                          <TableCell align="left">
                            <div>
                              <select
                                style={{
                                  height: "30px",
                                  width: "200px",
                                  borderRadius: "5px",
                                  color: "white",
                                  backgroundColor: "rgb(100, 100, 100)",
                                  textAlign: "center",
                                }}
                                onChange={handleChange}
                                value={newFuel.station}
                                id="station"
                              >
                                <option value="OMV">OMV</option>
                                <option value="Lukoil">Lukoil</option>
                                <option value=""></option>
                                <option value=""></option>
                              </select>
                            </div>
                          </TableCell>
                          <TableCell align="left">
                            <div>
                              <input
                                value={newFuel.invoice}
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
                                value={newFuel.km}
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
                                value={newFuel.cost}
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
                count={fuels.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <div className="flex justify-end">
                {add ? (
                  <ButtonGroup fullWidth>
                    <Button fullWidth variant="contained" onClick={handleSave}>
                      Запиши
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
                    Добави Зареждане
                    <AddCircleOutlineIcon />
                  </Button>
                )}
              </div>
            </Paper>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Fuels;
