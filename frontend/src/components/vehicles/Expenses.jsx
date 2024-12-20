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
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import AddExpense from "./AddExpense";
import ErrorDialog from "../utils/ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import { Edit, Delete, DoneOutline, Add } from "@mui/icons-material";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
const Expenses = ({
  vehicle,
  services,
  fuels,
  userRole,
  username,
  refresh,
  setRefresh,
}) => {
  const [expenseDate, setExpenseDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
  const [edit, setEdit] = useState([false, {}]);
  const [add, setAdd] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [expenses, setExpenses] = useState({});

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleClick = () => {
    setAdd(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!expenses.length) {
        setLoading(true);
      } else {
        setRefetching(true);
      }

      axios
        .get(`http://192.168.0.147:5555/services/${vehicle._id}`)
        .then((res) => {
          setExpenses(res.data.data);
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

  const handleSaveEdit = () => {
    if (!edit[1].date || !edit[1].type || !edit[1].desc || !edit[1].cost) {
      setError([true, "Дата, описание, вид и стойност са задължителни полета"]);
    } else {
      setAdd(false);

      axios
        .put(`http://192.168.0.147:5555/services/${edit[1]._id}`, edit[1])
        .then(() => {
          axios.post(`http://192.168.0.147:5555/api/logs`, {
            date: dayjs(),
            user: username,
            changed: { newServ: [edit[1].invoice, edit[1].desc] },
            vehicleId: vehicle._id,
          });
        })
        .catch((err) => {
          setLoading(false);
          alert("Грешка, проверете конзолата 1");
          console.log(err);
        });
      if (
        !vehicle.startKm ||
        vehicle.startKm === "0" ||
        parseInt(vehicle.startKm) > parseInt(edit[1].km)
      ) {
        vehicle.startKm = edit[1].km.toString();
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 2");
            console.log(err);
          });
      }
      if (
        !vehicle.startDate ||
        dayjs(vehicle.startDate).diff(dayjs(edit[1].date)) > 1
      ) {
        vehicle.startDate = edit[1].date;
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
          .then(() => {})
          .catch((err) => {
            alert("Грешка, проверете конзолата 3");
            console.log(err);
          });
      }

      setTimeout(() => {
        // window.location.reload();
        setRefresh(!refresh);
        setEdit([false, {}]);
      }, 100);
    }
  };

  const handleClose = () => {
    setAdd(false);
  };
  const handleChangeEdit = (e) => {
    const newData = { ...edit[1] };
    if (e.target.id === "km") {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    } else if (e.target.id === "cost") {
      if (e.target.value.endsWith(",")) {
        e.target.value = parseFloat(e.target.value).toString() + ".";
      } else if (e.target.value.endsWith(".")) {
        e.target.value = parseFloat(e.target.value).toString() + ".";
      } else if (e.target.value.endsWith(".0")) {
        e.target.value = parseFloat(e.target.value).toString() + ".0";
      } else if (/^[0-9]*\.[0-9]{2,3}$/.test(e.target.value)) {
        e.target.value = Number(parseFloat(e.target.value).toFixed(2));
      } else if (e.nativeEvent.inputType === "insertFromPaste") {
        e.target.value = Number(parseFloat(e.target.value).toFixed(2));
      } else {
        e.target.value = parseFloat(e.target.value);
        if (e.target.value === "NaN") {
          e.target.value = "";
        } //.toString();
      }
    }
    if (e.target.name === "type") {
      newData[e.target.name] = e.target.value;
    } else {
      newData[e.target.id] = e.target.value;
    }

    setEdit([true, { ...newData }]);
  };

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };
  const handleCloseEdit = () => {
    setEdit([false, {}]);
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
        size: 120,
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
        enableGlobalFilter: false,
        filterVariant: "select",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "desc",
        header: "Описание",
        size: 950,
        editable: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "invoice",
        header: "Фактура",
        size: 150,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "km",
        header: "Километри",
        size: 150,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "cost",
        header: "Стойност",
        size: 150,
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
    ],
    []
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
            setEdit([true, row.original]);
          }}
          color="warning"
          variant="contained"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            setVerifyDelete([true, row.original]);
          }}
          color="error"
          variant="contained"
        >
          <DeleteForeverIcon />
        </IconButton>
      </Box>
    ),
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 120,
      },
    },
    initialState: {
      sorting: [
        {
          id: "date",
          desc: true,
        },
        // {
        //   id: "dropoffTime",
        //   desc: true,
        // },
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
        <Dialog
          open={verifyDelete[0]}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
            {`Сигурен ли сте, че искате да изтриете записът ${
              verifyDelete[1].type +
              " " +
              verifyDelete[1].desc +
              " \n с № на фактура: " +
              verifyDelete[1].invoice +
              " на стойност: " +
              verifyDelete[1].cost +
              " лв."
            } Тази операция е необратима`}
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="contained"
              onClick={handleCloseDelete}
              autoFocus
            >
              ОТКАЗ
            </Button>
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                axios
                  .delete(
                    `http://192.168.0.147:5555/services/${verifyDelete[1]._id}`
                  )
                  .then(() => {
                    axios.post(`http://192.168.0.147:5555/api/logs`, {
                      date: dayjs(),
                      user: username,
                      changed: {
                        delServ: [
                          verifyDelete[1].invoice,
                          verifyDelete[1].desc,
                        ],
                      },
                      vehicleId: vehicle._id,
                    });
                    setTimeout(() => {
                      // window.location.reload();
                      setRefresh(!refresh);
                    }, 1000);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              autoFocus
            >
              ИЗТРИЙ
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={edit[0]}
          onClose={handleCloseEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">РЕДАКТИРАНЕ</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>

            <Box className="my-4">
              <DemoContainer components={["DatePicker, DatePicker"]}>
                <DatePicker
                  fullWidth
                  id="date"
                  label="Дата:"
                  value={
                    dayjs(edit[1].date)
                    // .add(3, "hour")
                  }
                  onChange={(newValue) => {
                    // const newData = { ...newServ };
                    // newData.date = newValue;
                    // setNewServ({ ...newData });
                    setEdit([true, { ...edit[1], date: newValue }]);
                  }}
                />
              </DemoContainer>
            </Box>
            <Box className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].type}
                name="type"
                id="type"
                select
                label="Вид:"
              >
                <MenuItem key={1} value="РЕМОНТ">
                  РЕМОНТ
                </MenuItem>
                <MenuItem key={2} value="КОНСУМАТИВ">
                  КОНСУМАТИВ
                </MenuItem>
                <MenuItem key={3} value="ГУМИ">
                  ГУМИ
                </MenuItem>
                <MenuItem key={4} value="ДРУГИ">
                  ДРУГИ
                </MenuItem>
              </TextField>
            </Box>
            <Box className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].desc}
                name="desc"
                id="desc"
                label="Описание:"
              />
            </Box>
            <Box className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].invoice}
                name="invoice"
                id="invoice"
                label="Фактура №:"
              />
            </Box>
            <Box className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].km}
                name="km"
                id="km"
                label="Километри:"
              />
            </Box>
            <Box className="my-4">
              <TextField
                fullWidth
                onChange={handleChangeEdit}
                value={edit[1].cost}
                name="cost"
                id="cost"
                label="Стойност:"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="contained"
              onClick={handleCloseEdit}
              autoFocus
            >
              Отказ
            </Button>
            <Button variant="contained" onClick={handleSaveEdit} autoFocus>
              Запази
            </Button>
          </DialogActions>
        </Dialog>
        <ErrorDialog error={error} setError={setError} />
        {Object.keys(expenses).length !== 0 && (
          <AddExpense
            vehicle={vehicle}
            refresh={refresh}
            setRefresh={setRefresh}
            username={username}
            services={expenses}
            setError={setError}
            setLoading={setLoading}
            add={add}
            setAdd={setAdd}
            date={expenseDate}
            setDate={setExpenseDate}
          />
        )}

        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
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
            {/* <MUIDataTable
              title={"РАЗХОДИ"}
              data={data}
              columns={columns}
              options={options}
            /> */}
          </Box>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default Expenses;
