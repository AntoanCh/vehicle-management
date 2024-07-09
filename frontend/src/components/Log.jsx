import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { TextField } from "@mui/material";
import MUIDataTable from "mui-datatables";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((b, a) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

const headCells = [
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Дата",
  },
  {
    id: "user",
    numeric: false,
    disablePadding: false,
    label: "Потребител",
  },
  {
    id: "changed",
    numeric: true,
    disablePadding: false,
    label: "Промяна",
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
            align={headCell.id === "changed" ? "right" : "left"}
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "desc"}
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
const Log = ({ vehicle, log }) => {
  const logChanges = (string) => {
    let result = "";
    const obj = JSON.parse(string);
    for (const key in obj) {
      let bgKey;
      if (key === "gtp") {
        bgKey = "ГТП";
        result = result + `${bgKey}(${bgDate(obj[key][1])}); `;
      } else if (key === "insDate") {
        bgKey = "ГО";
        result = result + `${bgKey}(${bgDate(obj[key][1])}); `;
      } else if (key === "kaskoDate") {
        bgKey = "Каско";
        result = result + `${bgKey}(${bgDate(obj[key][1])}); `;
      } else if (key === "insNum") {
        bgKey = "ГО№";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "kaskoNum") {
        bgKey = "каско№";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "cat") {
        bgKey = "ЕКО";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "oil") {
        bgKey = "Масло";
        result = result + `${bgKey}(${obj[key][1]} km); `;
      } else if (key === "tax") {
        bgKey = "Данък";
        result = result + `${bgKey}(${obj[key][1]} г); `;
      } else if (key === "tires") {
        bgKey = "Гуми";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "owner") {
        bgKey = "Собств";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "checked") {
        bgKey = "Проверка";
        result = result + `${bgKey}(${bgDate(obj[key][1])}); `;
      } else if (key === "newServ") {
        bgKey = "Нов ремонт";
        result = result + `${bgKey}(${obj[key][1]} - ${obj[key][0]}); `;
      } else if (key === "delServ") {
        bgKey = "Изтри ремонт";
        result = result + `${bgKey}(${obj[key][1]} - ${obj[key][0]}); `;
      } else if (key === "km") {
        bgKey = "КМ";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "site") {
        bgKey = "Отговорник";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "engNum") {
        bgKey = "ДВГ №";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "oilChange") {
        bgKey = "Интервал";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "price") {
        bgKey = "Цена пок.";
        result = result + `${bgKey}(${obj[key][1]}) лв; `;
      }
      // result = result + `${key} ${obj[key][0]}-${obj[key][1]}; `;
    }
    return result;
  };
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    dd = dd.slice(0, 2);
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };
  const columns = [
    {
      name: "Дата",
      options: {
        sortDirection: "desc",
      },
    },
    { name: "Потребител" },
    { name: "Промяна" },
  ];

  const data = log.data.map((obj) => {
    return [bgDate(obj.date), obj.user, logChanges(obj.changed)];
  });

  const options = {
    filterType: "checkbox",
    selectableRows: false,
    download: false,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
    // expandableRowsOnClick: true,
    // expandableRows: true,
    textLabels: {
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
        viewColumns: "View Columns",
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
  const [loading, setLoading] = useState(false);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("model");
  // const [page, setPage] = React.useState(0);
  // const [dense, setDense] = React.useState(false);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleRequestSort = (event, property) => {
  //   const isAsc = orderBy === property && order === "desc";
  //   setOrder(isAsc ? "desc" : "asc");
  //   setOrderBy(property);
  // };
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - log.length) : 0;
  // setTimeout(() => {}, 1000);
  // const visibleRows = React.useMemo(
  //   () =>
  //     log.data
  //       ? stableSort(log.data, getComparator(order, orderBy)).slice(
  //           page * rowsPerPage,
  //           page * rowsPerPage + rowsPerPage
  //         )
  //       : [],
  //   [order, orderBy, page, rowsPerPage]
  // );

  return (
    <div>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="my-4 ">
          {/* <h1 className="text-center text-2xl">ЛОГ</h1> */}
          <MUIDataTable
            title={"ЛОГ"}
            data={data}
            columns={columns}
            options={options}
          />

          {/* <Box sx={{ width: "80%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  {log.data && (
                    <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={log.data.length}
                    />
                  )}

                  {log.data && (
                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow hover key={row._id}>
                            <TableCell component="th" id={labelId} scope="row">
                              {`${bgDate(row.date)}`}
                            </TableCell>
                            <TableCell>{row.user}</TableCell>

                            <TableCell align="right">
                              {logChanges(row.changed)}
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
                count={log.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box> */}
        </div>
      )}
    </div>
  );
};

export default Log;
