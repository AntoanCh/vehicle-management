import React from "react";
import { useEffect, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Box } from "@mui/material";
import { darken, lighten, useTheme } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import ErrorDialog from "./ErrorDialog";
//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const Log = ({ vehicle, log }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [refetching, setRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!history.length) {
        setLoading(true);
      } else {
        setRefetching(true);
      }

      axios
        .get(`http://192.168.0.147:5555/logs/${vehicle._id}`)
        .then((res) => {
          setHistory(
            res.data.data.map((obj) => {
              return {
                date: obj.date,
                user: obj.user,
                changed: logChanges(obj.changed),
              };
            })
          );
          setRowCount(res.data.count);
        })
        .catch((err) => {
          setError([true, err]);
          console.error(err);
          return;
        });
      setError([false, ""]);
      setLoading(false);
      setRefetching(false);
    };
    fetchData();
  }, []);

  const logChanges = (string) => {
    let result = "";
    const obj = JSON.parse(string);
    for (const key in obj) {
      let bgKey;
      if (key === "gtp") {
        bgKey = "ГТП";
        result =
          result + `${bgKey}(${dayjs(obj[key][1]).format("DD.MM.YYYY")}); `;
      } else if (key === "insDate") {
        bgKey = "ГО";
        result =
          result + `${bgKey}(${dayjs(obj[key][1]).format("DD.MM.YYYY")}); `;
      } else if (key === "kaskoDate") {
        bgKey = "Каско";
        result =
          result + `${bgKey}(${dayjs(obj[key][1]).format("DD.MM.YYYY")}); `;
      } else if (key === "cat") {
        bgKey = "ЕКО Група";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "oil") {
        bgKey = "Ослужване дата";
        result = result + `${bgKey}(${obj[key][1]} km); `;
      } else if (key === "tax") {
        bgKey = "Данък";
        result = result + `${bgKey}(${obj[key][1]} г); `;
      } else if (key === "tires") {
        bgKey = "Гуми размер";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "owner") {
        bgKey = "Собственик";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "checked") {
        bgKey = "Проверка";
        result =
          result + `${bgKey}(${dayjs(obj[key][1]).format("DD.MM.YYYY")}); `;
      } else if (key === "newServ") {
        bgKey = "Нов разход";
        result = result + `${bgKey}(${obj[key][1]} - ${obj[key][0]}); `;
      } else if (key === "delServ") {
        bgKey = "Изтри разход";
        result = result + `${bgKey}(${obj[key][1]} - ${obj[key][0]}); `;
      } else if (key === "km") {
        bgKey = "Километри";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "site") {
        bgKey = "Отговорник";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "engNum") {
        bgKey = "ДВГ №";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "oilChange") {
        bgKey = "Интервал Обсл.";
        result = result + `${bgKey}(${obj[key][1]}); `;
      } else if (key === "price") {
        bgKey = "Цена пок.";
        result = result + `${bgKey}(${obj[key][1]}) лв; `;
      } else if (key === "status") {
        bgKey = "Статус";
        result = result + `${bgKey}(${obj[key][1]}); `;
      }
      // result = result + `${key} ${obj[key][0]}-${obj[key][1]}; `;
    }
    return result;
  };

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Дата",
        size: 180,
        enableGlobalFilter: false,
        filterVariant: "date",
        filterFn: "stringDateFn",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return dayjs(cell.getValue()).format("DD.MM.YYYY - HH:ss");
        },
      },
      {
        accessorKey: "user",
        header: "Потребител",
        filterVariant: "select",
        size: 160,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "changed",

        header: "Промяна",
        size: 800,
        editable: false,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: history,
    rowCount,
    filterFns: {
      stringDateFn: (row, id, filterValue) => {
        return dayjs(row.original[id])
          .format("DD.MM.YYYY")
          .includes(dayjs(filterValue).format("DD.MM.YYYY"));
      },
    },
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowActions: false,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    initialState: {
      sorting: [
        {
          id: "date",
          desc: true,
        },
      ],

      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: false,
      showColumnFilters: true,
      density: "compact",
      positionToolbarAlertBanner: "bottom",
    },
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [30, 50, 100, 200],
      shape: "rounded",
      variant: "outlined",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: lighten(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
      }),
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
  });

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
        <ErrorDialog error={error} setError={setError} />
        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ marginY: "15px" }}>
            <MaterialReactTable table={table} />
          </Box>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default Log;
