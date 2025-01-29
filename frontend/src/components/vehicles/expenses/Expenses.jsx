import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, IconButton, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import DeleteExpense from "./DeleteExpense";
import ErrorDialog from "../../utils/ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import { Edit, Delete, DoneOutline, Add } from "@mui/icons-material";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const Expenses = ({ vehicle, services, fuels, userRole, username }) => {
  const [expenseDate, setExpenseDate] = useState(dayjs());
  const [error, setError] = useState({ show: false, message: "" });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [verifyDelete, setVerifyDelete] = useState({
    show: false,
    expense: {},
  });
  const [edit, setEdit] = useState({ show: false, expense: {} });
  const [add, setAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [expenses, setExpenses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });

  const handleClick = () => {
    setAdd(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!expenses.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(
          `http://192.168.0.147:5555/api/services/${vehicle._id}`
        );
        setExpenses(res.data.data);
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
  }, [refresh]);

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
        size: 120,
        grow: false,
        enableGlobalFilter: false,
        filterVariant: "date",
        filterFn: "stringDateFn",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return dayjs(cell.getValue()).format("DD.MM.YYYY");
        },
      },
      {
        accessorKey: "type",
        header: "Вид",
        size: 100,
        grow: false,
        enableGlobalFilter: false,
        filterVariant: "select",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "cost",
        header: "Стойност",
        size: 150,
        grow: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) =>
          parseFloat(cell.getValue()).toLocaleString("bg-BG", {
            style: "currency",
            currency: "BGN",
          }),
        Footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (total, row) =>
                total + (row.getValue("cost") ? row.getValue("cost") : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              {"Тотал:"}
              <Box color="warning.main">
                {total.toLocaleString("bg-BG", {
                  style: "currency",
                  currency: "BGN",
                })}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "desc",
        header: "Описание",
        size: 750,
        grow: true,
        editable: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "invoice",
        header: "Фактура",
        size: 150,
        grow: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "compName",
        header: "Ан. Наименование",
        size: 150,
        grow: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "km",
        header: "Километри",
        size: 150,
        grow: false,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [refresh]
  );

  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: expenses,
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
    enableColumnActions: false,
    enableStickyFooter: true,
    // layoutMode: "grid",
    enableDensityToggle: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton
          onClick={() => {
            setEdit({
              show: true,
              expense: { ...row.original, cost: row.original.cost.toString() },
            });
          }}
          color="warning"
          variant="contained"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setVerifyDelete({ show: true, expense: row.original });
          }}
          color="error"
          variant="contained"
        >
          <DeleteForeverIcon />
        </IconButton>
      </Box>
    ),
    muiTableContainerProps: { sx: { maxHeight: "70vh" } },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 120,
      },
    },
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
      columnVisibility: {
        km: false,
      },
    },
    initialState: {
      sorting: [
        {
          id: "date",
          desc: true,
        },
      ],

      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",

      columnPinning: {
        left: [],
        right: ["mrt-row-actions"],
      },
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
        <Slide
          direction="down"
          in={alert.show}
          // in={true}
          sx={{
            position: "absolute",
            // left: "50%",
            zIndex: 2,
            width: "40%",
          }}
        >
          <Alert
            severity={alert.severity}
            variant="filled"
            sx={{ margin: 0 }}
            onClick={() => {
              setAlert(false);
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alert.message}
          </Alert>
        </Slide>
        <DeleteExpense
          verifyDelete={verifyDelete}
          setVerifyDelete={setVerifyDelete}
          username={username}
          refresh={refresh}
          setRefresh={setRefresh}
          vehicle={vehicle}
          setError={setError}
          setAlert={setAlert}
        />
        <EditExpense
          vehicle={vehicle}
          refresh={refresh}
          setRefresh={setRefresh}
          username={username}
          services={expenses}
          setError={setError}
          setIsLoading={setIsLoading}
          edit={edit}
          setEdit={setEdit}
          date={expenseDate}
          setDate={setExpenseDate}
          alert={alert}
          setAlert={setAlert}
        />
        {Object.keys(expenses).length !== 0 && (
          <AddExpense
            vehicle={vehicle}
            refresh={refresh}
            setRefresh={setRefresh}
            username={username}
            services={expenses}
            setError={setError}
            setIsLoading={setIsLoading}
            add={add}
            setAdd={setAdd}
            date={expenseDate}
            setDate={setExpenseDate}
            alert={alert}
            setAlert={setAlert}
            setIsRefetching={setIsRefetching}
            setErrorBanner={setErrorBanner}
          />
        )}

        <Box sx={{ marginY: "15px" }}>
          <Box
            sx={(theme) => ({
              backgroundColor: lighten(
                theme.palette.mode === "dark" ? "#212121" : "#fff",
                0.05
              ),
              display: "flex",
              gap: "0.5rem",
              p: "8px",
              justifyContent: "space-between",
            })}
          >
            <Box
              sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            ></Box>
            <Box>
              {(userRole.includes("admin") ||
                userRole.includes(vehicle.site)) &&
              !vehicle.sold ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  startIcon={<Add />}
                >
                  ДОБАВИ
                </Button>
              ) : (
                ""
              )}
            </Box>
          </Box>
          <MaterialReactTable table={table} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default Expenses;
