import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import ErrorDialog from "./ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const VehicleRecords = ({ vehicle, userRole, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [records, setRecords] = useState([]);
  const [refetching, setRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!records.length) {
        setLoading(true);
      } else {
        setRefetching(true);
      }

      axios
        .get(`http://192.168.0.147:5555/api/records/vehicle/${vehicle._id}`)
        .then((res) => {
          setRecords(res.data.data);
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

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleCloseError = () => {
    setError([false, ""]);
  };
  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";
  // "rgba(244, 255, 233, 1)"
  // const tableData = useMemo(() => {
  //   return records.map((obj, index) => {
  //     return {
  //       driver: obj.driverName,
  //       pickupTime: obj.pickupTime,
  //       dropoffTime: obj.dropoffTime,
  //       pickupKm:
  //         obj.pickupKm.toString().slice(0, -3) +
  //         " " +
  //         obj.pickupKm.toString().slice(-3),
  //       dropoffKm: obj.dropoffKm
  //         ? obj.dropoffKm.toString().slice(0, -3) +
  //           " " +
  //           obj.dropoffKm.toString().slice(-3)
  //         : "в движение",
  //       destination: obj.destination ? obj.destination : "в движение",
  //       problem: obj.problem,
  //     };
  //   });
  // }, [records]);

  //
  const columns = useMemo(
    () => [
      {
        accessorKey: "driverName",
        header: "Водач",
        size: 200,
        editable: false,
        filterVariant: "multi-select",
      },
      {
        accessorFn: (row) => dayjs(row.pickupTime).format("DD.MM.YYYY - HH:ss"),
        id: "pickupTime",
        header: "Тръгване",
        size: 180,
        enableGlobalFilter: false,
        filterVariant: "date",
        filterFn: "stringDateFn",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorFn: (row) =>
          row.dropoffTime
            ? dayjs(row.dropoffTime).format("DD.MM.YYYY - HH:ss")
            : "в движение",
        id: "dropoffTime",
        header: "Връщане",
        filterVariant: "datetime",
        filterFn: "stringDateFn",
        size: 180,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "pickupKm",
        header: "Тръгване(км)",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => cell.getValue().toLocaleString() + " км",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "dropoffKm",
        header: "Връщане(км)",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          cell.getValue()
            ? cell.getValue().toLocaleString() + " км"
            : "в движение",
        muiTableBodyCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "destination",
        header: "Маршрут",
        size: 350,
        enableColumnFilter: false,
        Cell: ({ cell }) => (cell.getValue() ? cell.getValue() : "в движение"),
      },
      {
        accessorKey: "problem",
        header: "Забележки",
        size: 450,
        enableColumnFilter: false,
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: records,
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
    enableRowPinning: true,
    initialState: {
      sorting: [
        {
          id: "pickupTime",
          desc: true,
        },
        {
          id: "dropoffTime",
          desc: true,
        },
      ],
      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      paginationDisplayMode: "pages",
      positionToolbarAlertBanner: "bottom",
      muiSearchTextFieldProps: {
        size: "small",
        variant: "outlined",
      },
      muiPaginationProps: {
        color: "secondary",
        rowsPerPageOptions: [30, 50, 100, 200],
        shape: "rounded",
        variant: "outlined",
      },
      enableColumnResizing: true,
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
    <Box sx={{ maxHeight: "100px" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
        <ErrorDialog error={error} setError={setError} />

        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ backgroundColor: "white" }}>
            <MaterialReactTable table={table} />
          </Box>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default VehicleRecords;
