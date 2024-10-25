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
            sx={{ fontWeight: 800 }}
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
      } else if (key === "newFuel") {
        bgKey = "Добави гориво";
        result = result + `${bgKey}(${obj[key][1]} - ${obj[key][0]}) `;
      } else if (key === "delFuel") {
        bgKey = "Изтри гориво";
        result = result + `${bgKey}(${obj[key][1]} - ${obj[key][0]}) `;
      }
      // result = result + `${key} ${obj[key][0]}-${obj[key][1]}; `;
    }
    return result;
  };

  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let hh = dd.slice(3, 11).split(":");
    hh[0] = (parseInt(hh[0]) + 3).toString();
    hh = hh.join(":");
    dd = dd.slice(0, 2);
    let newDate = `${dd}.${mm}.${yyyy} - ${hh}`;
    return newDate;
  };
  const columns = [
    {
      name: "Дата - Час",
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

  return (
    <div>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="my-4 ">
          <MUIDataTable
            title={`ЛОГ за ${vehicle.reg} (${vehicle.make} ${vehicle.model})`}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </div>
  );
};

export default Log;
