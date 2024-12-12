import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import VehicleRecords from "./VehicleRecords";
import Issues from "./Issues";
import Expenses from "./Expenses";
import Log from "./Log";
import {
  Button,
  TextField,
  MenuItem,
  ButtonGroup,
  IconButton,
  setRef,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CreateVehicle from "../pages/CreateVehicle";
import { keyframes } from "@mui/system";
import { styled } from "@mui/material/styles";
import AddExpense from "./AddExpense";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import {
  darken,
  lighten,
  useTheme,
  Typography,
  ListItemIcon,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Link from "@mui/material/Link";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Badge from "@mui/material/Badge";
import {
  History,
  QueryStats,
  CarRepair,
  DeleteForever,
  Cancel,
  Timeline,
  Close,
  Save,
  Edit,
  Delete,
  AccountCircle,
  Send,
  WarningAmber,
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import DraggablePaper from "../components/DraggablePaper";
import Chip from "@mui/material/Chip";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import VehicleDetails from "./VehicleDetails";

const blink = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const BlinkedBox = styled("div")({
  // backgroundColor: "pink",
  color: "#f6685e",
  display: "flex",

  animation: `${blink} 1s ease infinite`,
});

export default function VehiclesList({
  username,
  userRole,
  setUserRole,
  setUsername,
  data,
  filter,
  setFilter,
  customFilter,
  setCustomFilter,
}) {
  const [expenseDate, setExpenseDate] = useState(dayjs());
  const [expenses, setExpenses] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [add, setAdd] = useState(false);
  const [action, setAction] = useState({ show: false, type: "", vehicle: {} });
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [addExpense, setAddExpense] = useState(false);
  const [expenseVehicle, setExpenseVehicle] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    price: false,
    own: false,
    months: false,
    totalExpense: false,
    expensePerMonth: false,
    totalsFilter: false,
    expensePerMonthFilter: false,
    issue: false,
  });
  const [showExpense, setShowExpense] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";
  // "rgba(244, 255, 233, 1)"
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
      const { status, user, role } = data;
      setUsername(user);
      setUserRole(role);
    };
    verifyUser();
  }, [token, navigate]);

  const handleCloseAdd = () => {
    setAdd(false);
  };

  // React.useEffect(() => {
  //   setFilter(filter.slice());
  // }, [filter]);

  // React.useEffect(() => {
  //   setCustomFilter(customFilter.slice());
  // }, [customFilter]);

  setTimeout(() => setRefresh(false), 1500);

  const handleFilter = (val) => {
    setFilter(val);
  };

  const handleClick = (id) => {
    navigate(`/vehicles/details/${id}`);
  };

  const handleChangeCustomFilter = (e) => {
    setCustomFilter(e.target.value);
  };

  const isDue = (dueDate, type, oilChange) => {
    if (type === "date") {
      if (dueDate <= dayjs().add(1, "week").toISOString()) {
        return "warning";
      } else if (dueDate <= dayjs().add(1, "month").toISOString()) {
        return "caution";
      }
    } else if (type === "checked") {
      if (
        dayjs(dueDate).add(1, "month").toISOString() <= dayjs().toISOString()
      ) {
        return "warning";
      } else if (
        dayjs(dueDate).add(3, "week").toISOString() < dayjs().toISOString()
      ) {
        return "caution";
      }
    } else if (type === "oil") {
      if (dueDate > oilChange) {
        return "warning";
      } else if (dueDate > oilChange - 1000) {
        return "caution";
      }
    }
  };

  //To rerender the table pass variables to dependencies arrayin this variable
  const tableData = useMemo(() => {
    return data.filter((obj) =>
      filter === "all" ? obj.site !== "ПРОДАДЕНИ" : obj.site === filter
    );
  }, [filter, customFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "reg",
        header: "Номер",
        size: 170,
        enableColumnFilter: false,
        Cell: ({ cell, row }) => {
          return (
            <Box sx={{ display: "flex" }}>
              {userRole.includes("admin") && (
                <IconButton
                  sx={{ padding: "0", margin: "0", marginLeft: "5px" }}
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();

                    axios
                      .get(
                        `http://192.168.0.147:5555/services/${row.original._id}`
                      )
                      .then((res) => {
                        setExpenses(res.data);
                        setExpenseVehicle({ ...row.original });
                        setAddExpense(true);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  <AttachMoneyIcon color="success" />
                </IconButton>
              )}
              <Link
                href={`/vehicles/details/${row.original._id}`}
                sx={{ display: "flex" }}
              >
                {cell
                  .getValue()
                  .split(/(\d{4})/)
                  .join(" ")
                  .trim()}

                {row.original.issue ? (
                  <BlinkedBox>
                    <WarningAmber />
                  </BlinkedBox>
                ) : (
                  ""
                )}
              </Link>
            </Box>
          );
        },
        sortingFn: (rowA, rowB, columnId) => {
          let val1 = rowA.original.reg.replace(/\D/g, "");
          let val2 = rowB.original.reg.replace(/\D/g, "");
          return val1 - val2;
        },
      },
      {
        accessorFn: (row) => row._id,
        id: "edit",
        header: "",
        size: 55,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        enableSorting: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell, row }) => {
          return (
            <Box>
              {userRole.includes("admin") && (
                <Box>
                  <IconButton
                    sx={{ padding: "0", margin: "0", marginLeft: "5px" }}
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      axios
                        .get(
                          `http://192.168.0.147:5555/services/${row.original._id}`
                        )
                        .then((res) => {
                          setExpenses(res.data);
                          setExpenseVehicle({ ...row.original });
                          setAddExpense(true);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    sx={{ padding: "0", margin: "0", marginLeft: "5px" }}
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      axios
                        .get(
                          `http://192.168.0.147:5555/services/${row.original._id}`
                        )
                        .then((res) => {
                          setExpenses(res.data);
                          setExpenseVehicle({ ...row.original });
                          setAddExpense(true);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    <Cancel />
                  </IconButton>
                </Box>
              )}
            </Box>
          );
        },
      },
      {
        accessorFn: (row) => `${row.make} ${row.model}`,
        id: "model",
        header: "Марка/модел",
        size: 160,
        filterVariant: "select",
        editable: false,
      },
      {
        accessorKey: "site",
        header: "Отговорник",
        size: 110,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        filterVariant: "multi-select",
      },
      {
        accessorKey: "status",
        header: "Статус",
        size: 120,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        filterVariant: "select",
        Cell: ({ cell }) => {
          return (
            <Chip
              sx={{ fontWeight: 800, fontSize: 12 }}
              label={cell.getValue()}
              color={
                cell.getValue() === "АКТИВЕН"
                  ? "success"
                  : cell.getValue() === "НЕАКТИВЕН"
                  ? "error"
                  : "warning"
              }
            />
          );
        },
      },
      {
        accessorKey: "price",
        header: "Цена",
        size: 130,
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: {
          //no need to specify min/max/step if using faceted values
          marks: true,
          step: 5_000,
          valueLabelFormat: (value) =>
            value.toLocaleString("bg-BG", {
              style: "currency",
              currency: "BGN",
            }),
        },
        enableGlobalFilter: false,
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
              (total, row) => total + parseFloat(row.getValue("price")),
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
        accessorFn: (row) => dayjs().diff(row.purchaseDate, "month"),
        id: "own",
        header: "Притежание",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) =>
          `${
            Math.floor(cell.getValue() / 12)
              ? Math.floor(cell.getValue() / 12) + "г. "
              : ""
          } ${cell.getValue() % 12}м.`,
        Footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (total, row) =>
                total + (row.getValue("own") ? row.getValue("own") : 0),
              0
            );
          const length = table.getFilteredRowModel().rows.length;
          return (
            <Box sx={{ margin: "auto" }}>
              {"Средно:"}
              <Box color="warning.main">
                {Math.floor(total / length / 12) + "г. " + (total % 12) + "м."}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorFn: (row) => dayjs().diff(row.startDate, "month"),
        id: "months",
        header: "1ви р-т време",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) =>
          `${
            Math.floor(cell.getValue() / 12)
              ? Math.floor(cell.getValue() / 12) + "г. "
              : ""
          } ${cell.getValue() % 12}м.`,
      },
      {
        accessorFn: (row) =>
          row.totalExpenseCost
            ? parseFloat(row.totalExpenseCost.toFixed(2))
            : 0,
        id: "totalExpense",
        header: "Разходи",
        size: 130,
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: {
          //no need to specify min/max/step if using faceted values
          marks: true,
          step: 2_000,
          valueLabelFormat: (value) =>
            value.toLocaleString("bg-BG", {
              style: "currency",
              currency: "BGN",
            }),
        },
        enableGlobalFilter: false,
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
                total +
                (row.getValue("totalExpense")
                  ? row.getValue("totalExpense")
                  : 0),
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
        accessorFn: (row) =>
          row.totalServiceCost
            ? (
                row.totalServiceCost / dayjs().diff(row.startDate, "month")
              ).toFixed(2)
            : "0",
        id: "expensePerMonth",
        header: "Р-д/Мес",
        size: 130,
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        muiFilterSliderProps: {
          //no need to specify min/max/step if using faceted values
          marks: true,
          step: 1_00,
          valueLabelFormat: (value) =>
            value.toLocaleString("bg-BG", {
              style: "currency",
              currency: "BGN",
            }),
        },
        enableGlobalFilter: false,
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
                total +
                (row.getValue("totalExpense")
                  ? row.getValue("totalExpense") /
                    dayjs().diff(row.original.startDate, "month")
                  : 0),
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
        accessorFn: (row) => {
          if (customFilter === "РЕМОНТ") {
            return row.totalRepairCost
              ? parseFloat(row.totalRepairCost.toFixed(2))
              : 0;
          }
          if (customFilter === "ГУМИ") {
            return row.totalTireCost
              ? parseFloat(row.totalTireCost.toFixed(2))
              : 0;
          }
          if (customFilter === "ОБСЛУЖВАНЕ") {
            return row.totalServiceCost
              ? parseFloat(row.totalServiceCost.toFixed(2))
              : 0;
          }
        },

        id: "totalsFilter",
        header: "Разходи по вид",
        size: 150,
        filterVariant: "select",
        filterSelectOptions: [
          "РЕМОНТ",
          "ОБСЛУЖВАНЕ",
          "ГУМИ",
          "КОНСУМАТИВ",
          "ДРУГИ",
        ],

        Filter: ({ column, header, table }) => {
          return (
            <TextField
              size="small"
              variant="standard"
              select
              defaultValue={customFilter}
              fullWidth
              onChange={handleChangeCustomFilter}
            >
              <MenuItem value="РЕМОНТ">РЕМОНТ</MenuItem>
              <MenuItem value="ОБСЛУЖВАНЕ">ОБСЛУЖВАНЕ</MenuItem>
              <MenuItem value="ГУМИ">ГУМИ</MenuItem>
            </TextField>
          );

          // table.getState().columnFilters[0];
        },
        enableGlobalFilter: false,
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
                total +
                (row.getValue("totalsFilter")
                  ? row.getValue("totalsFilter")
                  : 0),
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
        accessorFn: (row) => {
          if (customFilter === "РЕМОНТ") {
            return row.totalRepairCost
              ? (
                  row.totalRepairCost / dayjs().diff(row.startDate, "month")
                ).toFixed(2)
              : 0;
          }
          if (customFilter === "ГУМИ") {
            return row.totalTireCost
              ? (
                  row.totalTireCost / dayjs().diff(row.startDate, "month")
                ).toFixed(2)
              : 0;
          }
          if (customFilter === "ОБСЛУЖВАНЕ") {
            return row.totalServiceCost
              ? (
                  row.totalServiceCost / dayjs().diff(row.startDate, "month")
                ).toFixed(2)
              : 0;
          }
        },

        id: "expensePerMonthFilter",
        header: "Р-д/Мес по вид",
        size: 130,

        enableGlobalFilter: false,
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
                total +
                (row.getValue("totalsFilter")
                  ? row.getValue("totalsFilter") /
                    dayjs().diff(row.original.startDate, "month")
                  : 0),
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
        accessorKey: "insDate",
        header: "ГО",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return (
            <Box
              style={
                isDue(cell.getValue(), "date") === "warning"
                  ? { color: "red" }
                  : isDue(cell.getValue(), "date") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(cell.getValue()).format("DD/MM/YYYY")}
              {isDue(cell.getValue(), "date") ? <WarningAmber /> : ""}
            </Box>
          );
        },
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("insDate"), "date") === "warning" ? 1 : 0),
              0
            );
          const caution = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("insDate"), "date") === "caution" ? 1 : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
              <Box>
                <Badge color="warning" variant="dot" />: {caution}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "kaskoDate",
        header: "Каско",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return (
            <Box
              style={
                isDue(cell.getValue(), "date") === "warning"
                  ? { color: "red" }
                  : isDue(cell.getValue(), "date") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {cell.getValue() === null ||
              cell.getValue() === "2000-12-31T22:00:00.000Z"
                ? "Няма"
                : dayjs(cell.getValue()).format("DD/MM/YYYY")}
              {isDue(cell.getValue(), "date") ? <WarningAmber /> : ""}
            </Box>
          );
        },
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("kaskoDate"), "date") === "warning"
                  ? 1
                  : 0),
              0
            );
          const caution = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("kaskoDate"), "date") === "caution"
                  ? 1
                  : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
              <Box>
                <Badge color="warning" variant="dot" />: {caution}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "gtp",
        header: "ГТП",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return (
            <Box
              style={
                isDue(cell.getValue(), "date") === "warning"
                  ? { color: "red" }
                  : isDue(cell.getValue(), "date") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(cell.getValue()).format("DD/MM/YYYY")}
              {isDue(cell.getValue(), "date") ? <WarningAmber /> : ""}
            </Box>
          );
        },
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("gtp"), "date") === "warning" ? 1 : 0),
              0
            );
          const caution = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("gtp"), "date") === "caution" ? 1 : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
              <Box>
                <Badge color="warning" variant="dot" />: {caution}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "cat",
        header: "Група",
        enableGlobalFilter: false,
        filterVariant: "multi-select",
        muiTableBodyCellProps: {
          align: "center",
        },
        size: 60,
        Cell: ({ cell }) => {
          return (
            <Box
              sx={
                cell.getValue() === "1" || cell.getValue() === "2"
                  ? { fontWeight: 800, color: "red" }
                  : cell.getValue() === "3"
                  ? { fontWeight: 800, color: "orange" }
                  : theme.palette.mode === "dark"
                  ? { fontWeight: 800, color: theme.palette.success.light }
                  : { fontWeight: 800, color: theme.palette.success.dark }
              }
            >
              {cell.getValue()}
            </Box>
          );
        },
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (row.getValue("cat") === "1" || row.getValue("cat") === "2"
                  ? 1
                  : 0),
              0
            );
          const caution = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) => count + (row.getValue("cat") === "3" ? 1 : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
              <Box>
                <Badge color="warning" variant="dot" />: {caution}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "tax",
        header: "Данък",
        size: 100,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        filterVariant: "select",
        Cell: ({ cell, row }) => (
          <Box
            sx={
              isDue(row.original.gtp, "date") &&
              parseInt(cell.getValue()) < dayjs().$y
                ? { color: "red" }
                : {}
            }
          >
            {cell.getValue()}
            {isDue(row.original.gtp, "date") &&
            parseInt(cell.getValue()) < dayjs().$y ? (
              <WarningAmber />
            ) : (
              ""
            )}
          </Box>
        ),
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("gtp"), "date") &&
                parseInt(row.getValue("tax")) < dayjs().$y
                  ? 1
                  : 0),
              0
            );

          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
            </Box>
          );
        },
      },

      {
        accessorKey: "serviceDue",
        header: "Обсл след",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell, row }) => {
          return (
            <Box
              style={
                isDue(
                  row.original.km - row.original.oil,
                  "oil",
                  row.original.oilChange
                ) === "warning"
                  ? { color: "red" }
                  : isDue(
                      row.original.km - row.original.oil,
                      "oil",
                      row.original.oilChange
                    ) === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {row.original.oilChange -
                (row.original.km - row.original.oil) +
                " км"}
              {isDue(
                row.original.km - row.original.oil,
                "oil",
                row.original.oilChange
              ) ? (
                <WarningAmber />
              ) : (
                ""
              )}
            </Box>
          );
        },
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(
                  row.getValue("km") - row.original.oil,
                  "oil",
                  row.getValue("oilChange")
                ) === "warning"
                  ? 1
                  : 0),
              0
            );
          const caution = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(
                  row.getValue("km") - row.original.oil,
                  "oil",
                  row.getValue("oilChange")
                ) === "caution"
                  ? 1
                  : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
              <Box>
                <Badge color="warning" variant="dot" />: {caution}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "checked",
        header: "Проверен",
        size: 110,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return (
            <Box
              style={
                isDue(cell.getValue(), "checked") === "warning"
                  ? { color: "red" }
                  : isDue(cell.getValue(), "checked") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(cell.getValue()).format("DD/MM/YYYY")}
              {isDue(cell.getValue(), "checked") ? <WarningAmber /> : ""}
            </Box>
          );
        },
        Footer: ({ table }) => {
          const warning = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("checked"), "checked") === "warning"
                  ? 1
                  : 0),
              0
            );
          const caution = table
            .getFilteredRowModel()
            .rows.reduce(
              (count, row) =>
                count +
                (isDue(row.getValue("checked"), "checked") === "caution"
                  ? 1
                  : 0),
              0
            );
          return (
            <Box sx={{ margin: "auto" }}>
              <Badge color="error" variant="dot" />: {warning}
              <Box>
                <Badge color="warning" variant="dot" />: {caution}
              </Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "oilChange",
        header: "Интервал обсл",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "km",
        header: "Километри",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "issue",
        header: "Забележки",
        size: 20,
        enableGlobalFilter: false,
        enableColumnFilter: false,
      },
    ],
    [refresh, customFilter]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    // enableRowVirtualization: true,
    enableExpandAll: false,
    localization: { ...MRT_Localization_BG },
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableFacetedValues: true,
    enableColumnActions: false,
    enableColumnResizing: true,
    enableDensityToggle: false,
    enableRowSelection: false,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    enableRowNumbers: true,
    enableRowActions: true,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 100,
      },
    },
    state: {
      columnVisibility: {
        ...columnVisibility,
        edit: userRole.includes("admin") ? true : false,
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      sorting: [
        {
          id: "reg",
          desc: false,
        },
        {
          id: "model",
          desc: false,
        },
      ],

      pagination: { pageSize: 30, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-actions", "edit", "reg"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30, 50],
      shape: "rounded",
      variant: "outlined",
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-around",
          left: "30px",
          maxWidth: "1000px",
          position: "sticky",
          width: "100%",
        }}
      >
        <VehicleDetails id={row.original._id} />
      </Box>
    ),
    // renderRowActions: ({ row, table }) => (
    //   <Box>
    //     <IconButton onClick={() => console.info("Edit")}>
    //       <Edit />
    //     </IconButton>
    //     <IconButton onClick={() => console.info("Delete")}>
    //       <Delete />
    //     </IconButton>
    //   </Box>
    // ),
    renderRowActionMenuItems: ({ row, table, closeMenu }) => [
      <MenuItem
        key={0}
        onClick={() => {
          setAction({
            show: true,
            type: "records",
            vehicle: { ...row.original },
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <Timeline />
        </ListItemIcon>
        Движение
      </MenuItem>,

      <MenuItem
        key={1}
        onClick={() => {
          setAction({
            show: true,
            type: "issues",
            vehicle: { ...row.original },
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <WarningAmber />
        </ListItemIcon>
        Забележки
      </MenuItem>,
      <MenuItem
        key={2}
        onClick={() => {
          setAction({
            show: true,
            type: "expenses",
            vehicle: { ...row.original },
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <CarRepair />
        </ListItemIcon>
        Разходи
      </MenuItem>,
      <MenuItem
        key={3}
        onClick={() => {
          setAction({
            show: true,
            type: "history",
            vehicle: { ...row.original },
          });
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <History />
        </ListItemIcon>
        История
      </MenuItem>,
    ],

    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("deactivating " + row.getValue("name"));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("contact " + row.getValue("name"));
        });
      };
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
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <Box
        sx={{
          width: "96%",
          // "calc(100% - 260px)"
        }}
      >
        {addExpense && (
          <AddExpense
            add={addExpense}
            setAdd={setAddExpense}
            vehicle={expenseVehicle}
            services={expenses}
            username={username}
            refresh={refresh}
            setRefresh={setRefresh}
            date={expenseDate}
            setDate={setExpenseDate}
          />
        )}
        <CreateVehicle add={add} setAdd={setAdd} />
        <Dialog
          PaperComponent={DraggablePaper}
          // maxWidth={"xl"}
          fullScreen
          open={action.show}
          onClose={() => setAction({ show: false, type: "", vehicle: {} })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            style={{ cursor: "move", backgroundColor: "#42a5f5" }}
            id="draggable-dialog-title"
          >
            {`${action.vehicle.reg} ${action.vehicle.make} ${action.vehicle.model}`}
            <IconButton
              sx={{
                margin: 0,
                padding: 0,
                float: "right",
              }}
              color="error"
              onClick={() => setAction({ show: false, type: "", vehicle: {} })}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {action.type === "records" && (
              <VehicleRecords
                username={username}
                userRole={userRole}
                vehicle={action.vehicle}
              />
            )}
            {action.type === "issues" && (
              <Issues
                username={username}
                userRole={userRole}
                vehicle={action.vehicle}
              />
            )}
            {action.type === "expenses" && (
              <Expenses
                username={username}
                userRole={userRole}
                vehicle={action.vehicle}
              />
            )}
            {action.type === "history" && (
              <Log
                username={username}
                userRole={userRole}
                vehicle={action.vehicle}
              />
            )}
          </DialogContent>
        </Dialog>
        {refresh ? (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        ) : (
          ""
        )}

        <Box sx={{ minWidth: "100%" }}>
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
            <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {/* import MRT sub-components */}

              <Box>
                <ButtonGroup>
                  <Button
                    sx={{ width: "40%" }}
                    color={filter === "all" ? "secondary" : "primary"}
                    variant={"contained"}
                    onClick={() => handleFilter("all")}
                  >
                    {"Всички"}
                  </Button>
                  <Button
                    sx={{ width: "40%" }}
                    color={filter === "ОФИС" ? "secondary" : "primary"}
                    variant={"contained"}
                    onClick={() => handleFilter("ОФИС")}
                  >
                    {"ОФИС"}
                  </Button>
                  <Button
                    sx={{ width: "40%" }}
                    color={filter === "ВИТАЛИНО" ? "secondary" : "primary"}
                    variant={"contained"}
                    onClick={() => handleFilter("ВИТАЛИНО")}
                  >
                    {"ВИТАЛИНО"}
                  </Button>
                  <Button
                    sx={{ width: "40%" }}
                    color={filter === "БОРСА" ? "secondary" : "primary"}
                    variant={"contained"}
                    onClick={() => handleFilter("БОРСА")}
                  >
                    {"БОРСА"}
                  </Button>
                  <Button
                    sx={{ width: "40%" }}
                    color={filter === "ДРУГИ" ? "secondary" : "primary"}
                    variant={"contained"}
                    onClick={() => handleFilter("ДРУГИ")}
                  >
                    {"ДРУГИ"}
                  </Button>
                  <Button
                    sx={{ width: "40%" }}
                    color={filter === "ПРОДАДЕНИ" ? "secondary" : "primary"}
                    variant={"contained"}
                    onClick={() => handleFilter("ПРОДАДЕНИ")}
                  >
                    {"ПРОДАДЕНИ"}
                  </Button>
                </ButtonGroup>
              </Box>
              <MRT_GlobalFilterTextField table={table} />
            </Box>

            <Box>
              <Button
                color={showExpense ? "secondary" : "primary"}
                onClick={() => {
                  setShowExpense(!showExpense);
                  if (!showExpense) {
                    setColumnVisibility({
                      kaskoDate: false,
                      issue: false,
                    });
                  } else {
                    setColumnVisibility({
                      price: false,
                      own: false,
                      months: false,
                      totalExpense: false,
                      expensePerMonth: false,
                      totalsFilter: false,
                      expensePerMonthFilter: false,
                      issue: false,
                    });
                  }
                }}
                variant="contained"
              >
                {showExpense ? "Скрий разходите" : "Покажи разходите"}
              </Button>
            </Box>
            <Box>
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <Button
                  color="error"
                  disabled={!table.getIsSomeRowsSelected()}
                  // onClick={handleDeactivate}
                  variant="contained"
                >
                  ИЗТРИЙ
                </Button>

                <Button
                  color="success"
                  disabled={!table.getIsSomeRowsSelected()}
                  // onClick={handleActivate}
                  variant="contained"
                >
                  ПРОДАДЕНА
                </Button>

                <Button
                  disabled={userRole.length === 0 || !userRole ? true : false}
                  variant={"contained"}
                  onClick={() => setAdd(true)}
                >
                  {"ДОБАВИ"}
                  <AddCircleOutlineIcon />
                </Button>
              </Box>
            </Box>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MaterialReactTable table={table} />
          </LocalizationProvider>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
