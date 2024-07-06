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
import Register from "../pages/Register";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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

// test
const Users = ({ users }) => {
  const [loading, setLoading] = useState(false);

  const [add, setAdd] = useState(false);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleClick = () => {
    setAdd(true);
  };

  const handleDelete = () => {
    // axios.delete(`http://192.168.0.145/users/${e}`)
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  //test

  return (
    <div>
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
                            <TableCell>{row.role}</TableCell>
                            <TableCell align="right">{row._id}</TableCell>
                            <TableCell align="right">
                              <Button
                                onClick={() => {
                                  axios
                                    .delete(
                                      `http://192.168.0.145:5555/users/${row._id}`
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
                  <Button fullWidth variant="contained" onClick={handleClick}>
                    Добави
                    <AddCircleOutlineIcon />
                  </Button>
                )}
              </div>
              {add ? <Register /> : ""}
            </Paper>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Users;
