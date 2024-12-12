import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const Records = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState({});
  const [error, setError] = useState([false, ""]);
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
        .get(`http://192.168.0.147:5555/api/records/`)
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
        accessorKey: "dropoffTime",
        header: "Връщане",
        filterVariant: "datetime",
        filterFn: "stringDateFn",
        size: 180,
        enableGlobalFilter: false,
        Cell: ({ cell }) => {
          return cell.getValue()
            ? dayjs(cell.getValue()).format("DD.MM.YYYY - HH:ss")
            : "в движение";
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
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
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
    <Box sx={{ margin: "5px", maxHeight: "100px", maxWidth: "95%" }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default Records;
