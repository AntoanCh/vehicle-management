import React, { useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const Records = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [error, setError] = useState({ show: false, message: "" });
  const [records, setRecords] = useState({});
  const [rowCount, setRowCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      if (!records.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/records/`);
        setRecords(res.data.data);
        setRowCount(res.data.count);
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, []);

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";

  const columns = useMemo(
    () => [
      {
        accessorKey: "pickupTime",
        header: "Тръгване",
        size: 280,
        enableGlobalFilter: false,
        filterVariant: "date-range",
        filterFn: "stringDateRangeFn",
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
        filterVariant: "date",
        filterFn: "stringDateFn",
        size: 180,
        enableGlobalFilter: false,
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
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "driverName",
        header: "Водач",
        size: 200,
        editable: false,
        enableGlobalFilter: false,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "vehicleModel",
        header: "Автомобил",
        size: 200,
        editable: false,
        enableGlobalFilter: false,
        filterVariant: "select",
      },
      {
        accessorKey: "vehicleReg",
        header: "Номер",
        size: 200,
        editable: false,
        filterVariant: "select",
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
      stringDateRangeFn: (row, columnId, value) => {
        const date = row.getValue(columnId);
        const [start, end] = value;
        //If one filter defined and date is null filter it
        if ((start || end) && !date) return false;
        if (start && !end) {
          return dayjs(date).isAfter(dayjs(start));
        } else if (!start && end) {
          return dayjs(date).isBefore(dayjs(end).add(1, "day"));
        } else if (start && end) {
          return (
            dayjs(date).isAfter(dayjs(start)) &&
            dayjs(date).isBefore(dayjs(end).add(1, "day"))
          );
        } else return true;
      },
    },
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableRowPinning: true,
    muiTableContainerProps: { sx: { maxHeight: "70vh" } },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [50, 100, 200, 300],
      shape: "rounded",
      variant: "outlined",
    },
    enableColumnResizing: true,
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
    },
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
    <Box sx={{ margin: "5px", maxHeight: "100px", maxWidth: "95%" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default Records;
