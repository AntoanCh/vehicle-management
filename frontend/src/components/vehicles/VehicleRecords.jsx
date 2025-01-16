import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import ErrorDialog from "../utils/ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Chip from "@mui/material/Chip";

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
  const [error, setError] = useState({ show: false, message: "" });
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
          setError({ show: true, message: err });

          return;
        });
      setError({ show: false, message: "" });
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
    setError({ show: false, message: "" });
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
        accessorKey: "pickupTime",
        header: "Тръгване",
        size: 180,
        enableGlobalFilter: false,
        filterVariant: "date",
        filterFn: "stringDateFn",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm");
        },
      },
      {
        accessorKey: "dropoffTime",
        header: "Връщане",
        filterVariant: "datetime",
        filterFn: "stringDateFn",
        size: 180,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return cell.getValue() ? (
            dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm")
          ) : (
            <Chip
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 10,
              }}
              label={"В ДВИЖЕНИЕ"}
              color="success"
            />
          );
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
        Footer: ({ table }) => {
          const kmArray = table
            .getFilteredRowModel()
            .rows.map((row) => row.getValue("pickupKm"));
          const max = Math.max(...kmArray);
          const min = Math.min(...kmArray);
          return (
            <Box sx={{ margin: "auto" }}>
              {"Изминати км:"}
              <Box color="warning.main">{`${max - min} км.`}</Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "dropoffKm",
        header: "Връщане(км)",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            cell.getValue().toLocaleString() + " км"
          ) : (
            <Chip
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 10,
              }}
              label={"В ДВИЖЕНИЕ"}
              color="success"
            />
          ),
        muiTableBodyCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "destination",
        header: "Маршрут",
        size: 350,
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            cell.getValue()
          ) : (
            <Chip
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 10,
              }}
              label={"В ДВИЖЕНИЕ"}
              color="success"
            />
          ),
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
    enableStickyFooter: true,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableRowPinning: true,
    muiTableContainerProps: { sx: { maxHeight: "75vh" } },
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
    },
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
    paginationDisplayMode: "pages",
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
          <Box sx={{ backgroundColor: "white" }}>
            <MaterialReactTable table={table} />
          </Box>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default VehicleRecords;
