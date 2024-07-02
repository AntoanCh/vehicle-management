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
import { Button } from "@mui/material";

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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [filter, setFilter] = React.useState("all");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  React.useEffect(() => {
    setFilter(filter.slice());
  }, [filter]);
  const location = useLocation();
  if (location.pathname === "/office") {
    data = data.filter((e) => e.site === "office");
  } else if (location.pathname === "/warehouse") {
    data = data.filter((e) => e.site === "warehouse");
  }

  // if (filters === "cars") {
  //   console.log("carsss");
  //   data = data.filter((e) => e.type === "Car");
  //   console.log(data);
  // } else if (filters === "trucks") {
  //   console.log("tracksss");
  //   data = data.filter((e) => e.type === "Truck");
  //   console.log(data);
  // }
  React.useEffect(() => {
    // window.location.reload();
  }, [filter]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const navigate = useNavigate();
  const handleClick = (event, id) => {
    navigate(`/vehicle/details/${id}`);
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
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  //Function to rearrange date format to match DD/MM/YYYY
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };

  const isDue = (dueDate, type) => {
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
      if (dueDate > 10000) {
        return "warning";
      } else if (dueDate > 9000) {
        return "caution";
      }
    }
  };
  return (
    <div className="flex justify-center">
      <Box sx={{ width: "95%", margin: "5px" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
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
                {visibleRows.map((row, index) => {
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
                          isDue(row.kaskoDate, "date") === "warning"
                            ? { color: "red" }
                            : isDue(row.kaskoDate, "date") === "caution"
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {isDue(row.kaskoDate, "date") ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                        {row.kaskoDate == "0000-01-01T00:00:00.000Z" ||
                        row.kaskoDate == null
                          ? "N/A"
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
                          isDue(row.km - row.oil, "oil") === "warning"
                            ? { color: "red" }
                            : isDue(row.km - row.oil, "oil") === "caution"
                            ? { color: "orange" }
                            : {}
                        }
                      >
                        {row.km - row.oil + " km"}
                        {isDue(row.km - row.oil, "oil") ? (
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
          label=""
        />
      </Box>
    </div>
  );
}
