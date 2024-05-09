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
    id: "desc",
    numeric: false,
    disablePadding: false,
    label: "Описание",
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
const Services = ({ vehicle, services }) => {
  const [loading, setLoading] = useState(false);

  const [newServ, setNewServ] = useState({
    desc: "",
    date: "",
    km: "",
    cost: "",
    vehicleId: vehicle,
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
      .post("http://localhost:5555/services", newServ)
      .then(() => {
        // setLoading(false);
      })
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
    const newData = { ...newServ };
    newData[e.target.id] = e.target.value;
    setNewServ({ ...newData });
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - services.length) : 0;
  setTimeout(() => {}, 1000);
  const visibleRows = React.useMemo(
    () =>
      services.data
        ? stableSort(services.data, getComparator(order, orderBy)).slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
          )
        : [],
    [order, orderBy, page, rowsPerPage]
  );
  console.log(services);
  //test

  return (
    <div>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="my-4">
          <h1 className="text-center text-2xl">Сервизна история</h1>
          {/* test */}
          <Box sx={{ width: "100%", margin: "5px" }}>
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
                              {`${row.date}`}
                            </TableCell>
                            <TableCell>{row.desc}</TableCell>

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
                              {" "}
                              <input
                                value={newServ.km ? newServ.km : vehicle.km}
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
              <div className="flex justify-end">
                {add ? (
                  <ButtonGroup fullWidth>
                    <Button fullWidth variant="contained" onClick={handleSave}>
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
            </Paper>
            {/* <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            /> */}
          </Box>
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

          <h1 className="text-center my-4 text-2xl">Справка МПС</h1>
          <h1 className="text-center text-xl">Данни за покупка</h1>
          <div className="flex justify-center">
            <TableContainer
              sx={{ maxWidth: "400px", margin: "10px" }}
              component={Paper}
            >
              <Table sx={{ minWidth: "200px" }} aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{
                      backgroundColor: "grey",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Дата
                    </TableCell>
                    <TableCell align="right">Километри</TableCell>
                    <TableCell align="right">Цена</TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {vehicle.startDate
                        ? bgDate(vehicle.startDate.slice(0, 10))
                        : ""}
                    </TableCell>
                    <TableCell align="right">{vehicle.startKm} км</TableCell>
                    <TableCell align="right">{vehicle.price} лв</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="flex justify-center">
            <TableContainer
              sx={{ maxWidth: "600px", margin: "10px" }}
              component={Paper}
            >
              <Table sx={{ minWidth: "200px" }} aria-label="simple table">
                <TableBody>
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
                      {(
                        parseFloat(
                          services.data.reduce((acc, obj) => acc + obj.cost, 0)
                        ) + parseFloat(vehicle.price)
                      ).toLocaleString()}{" "}
                      лв.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Среден месечен разход ремонти:
                    </TableCell>
                    <TableCell align="right">
                      {(
                        services.data.reduce((acc, obj) => acc + obj.cost, 0) /
                        months
                      ).toFixed(2)}{" "}
                      лв.
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      Разход на км:
                    </TableCell>
                    <TableCell align="right">
                      {(
                        services.data.reduce((acc, obj) => acc + obj.cost, 0) /
                        (vehicle.km - vehicle.startKm)
                      ).toFixed(2)}{" "}
                      лв.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
