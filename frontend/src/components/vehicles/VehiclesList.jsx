import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import VehicleRecords from "./VehicleRecords";
import Issues from "./Issues";
import Expenses from "./expenses/Expenses";
import Log from "./Log";
import Tooltip from "@mui/material/Tooltip";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import ErrorDialog from "../utils/ErrorDialog";
import {
  Button,
  TextField,
  MenuItem,
  Menu,
  ButtonGroup,
  IconButton,
  setRef,
} from "@mui/material";
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
import CreateVehicle from "./CreateVehicle";
import { keyframes } from "@mui/system";
import { styled } from "@mui/material/styles";
import AddExpense from "./expenses/AddExpense";
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
  Refresh,
  AccountCircle,
  ArrowBackIosNew,
  Send,
  FileDownload,
  Menu as MenuIcon,
  WarningAmber,
  AltRouteTwoTone,
} from "@mui/icons-material";
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
  filter,
  setFilter,
  customFilter,
  setCustomFilter,
  showExpense,
  setShowExpense,
  expenseWithTax,
  setExpenseWithTax,
  expenseDate,
  setExpenseDate,
}) {
  const [expenses, setExpenses] = useState({});
  const [refresh, setRefresh] = useState(false);
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
  const [vehicles, setVehicles] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState([null, {}]);
  const openActionMenu = Boolean(anchorEl[0]);
  const [add, setAdd] = useState(false);
  const [action, setAction] = useState({ show: false, type: "", vehicle: {} });
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [expenseVehicle, setExpenseVehicle] = useState({});
  const [addExpense, setAddExpense] = useState(false);
  const [groupedColumnMode, setGroupedColumnMode] = useState("reorder");
  const [columnVisibility, setColumnVisibility] = useState({
    price: false,
    purchaseDate: false,
    months: false,
    totalExpense: false,
    expensePerMonth: false,
    totalsFilter: false,
    expensePerMonthFilter: false,
    issue: false,
    soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
  });

  const navigate = useNavigate();

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#212121" : "#fff";

  useEffect(() => {
    const fetchData = async () => {
      if (!vehicles.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/vehicle/`);
        setVehicles(res.data.data);
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

  useEffect(() => {
    if (showExpense) {
      setColumnVisibility({
        kaskoDate: false,
        issue: false,
        soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
      });
    } else {
      setColumnVisibility({
        price: false,
        purchaseDate: false,
        months: false,
        totalExpense: false,
        expensePerMonth: false,
        totalsFilter: false,
        expensePerMonthFilter: false,
        issue: false,
        soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
      });
    }
  }, []);

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
    return vehicles.filter((obj) =>
      filter === "all" ? obj.site !== "ПРОДАДЕНИ" : obj.site === filter
    );
  }, [filter, customFilter, isLoading, isRefetching]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "reg",
        header: "Номер",
        size: 170,
        enableColumnFilter: false,
        enableEditing: false,
        Cell: ({ cell, row }) => {
          return (
            <Box sx={{ display: "flex" }}>
              {userRole.includes("admin") && (
                <Tooltip title="Добави нов разход" disableInteractive>
                  <IconButton
                    sx={{ padding: "0", margin: "0", marginLeft: "5px" }}
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();

                      axios
                        .get(
                          `http://192.168.0.147:5555/api/services/${row.original._id}`
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
                </Tooltip>
              )}
              <Tooltip title="Детайли" disableInteractive>
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
                    <Tooltip
                      title="Автомобилът има неразрешени забележки"
                      disableInteractive
                    >
                      <BlinkedBox>
                        <WarningAmber />
                      </BlinkedBox>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                  {/* {row.original.issue ? (
                    <BlinkedBoxOneTime>
                      <WarningAmber />
                    </BlinkedBoxOneTime>
                  ) : (
                    ""
                  )} */}
                </Link>
              </Tooltip>
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
        accessorFn: (row) => `${row.make} ${row.model}`,
        id: "model",
        header: "Марка/модел",
        size: 160,
        filterVariant: "select",
        enableEditing: false,
        editable: false,
      },
      {
        accessorKey: "site",
        header: "Отговорник",
        size: 110,
        enableGlobalFilter: false,
        editVariant: "select",
        muiEditTextFieldProps: {
          // type: 'email',
          select: true,
          required: true,
          // error: !!validationErrors?.email,
          // helperText: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          // onFocus: () =>
          //   setValidationErrors({
          //     ...validationErrors,
          //     email: undefined,
          //   }),
        },
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
              size="small"
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
        accessorKey: "soldPrice",
        header: "Прод. Цена",
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
          cell.getValue()
            ? parseFloat(cell.getValue()).toLocaleString("bg-BG", {
                style: "currency",
                currency: "BGN",
              })
            : 0,
        Footer: ({ table }) => {
          const total = table
            .getFilteredRowModel()
            .rows.reduce(
              (total, row) =>
                total + row.getValue("soldPrice")
                  ? parseFloat(row.getValue("soldPrice"))
                  : 0,
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
        // accessorFn: (row) => dayjs().diff(row.purchaseDate, "month"),
        accessorKey: "purchaseDate",
        // id: "purchaseDate",
        header: "Притежание",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        enableEditing: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) =>
          `${dayjs(cell.getValue()).format("MM.YY")} (${
            Math.floor(dayjs().diff(cell.getValue(), "month") / 12)
              ? Math.floor(dayjs().diff(cell.getValue(), "month") / 12) + "г. "
              : ""
          } ${dayjs().diff(cell.getValue(), "month") % 12}м.)`,
        // Footer: ({ table }) => {
        //   const total = table
        //     .getFilteredRowModel()
        //     .rows.reduce(
        //       (total, row) =>
        //         total + (row.getValue("own") ? row.getValue("own") : 0),
        //       0
        //     );
        //   const length = table.getFilteredRowModel().rows.length;
        //   return (
        //     <Box sx={{ margin: "auto" }}>
        //       {"Средно:"}
        //       <Box color="warning.main">
        //         {Math.floor(total / length / 12) + "г. " + (total % 12) + "м."}
        //       </Box>
        //     </Box>
        //   );
        // },
      },
      // {
      //   accessorFn: (row) => dayjs().diff(row.startDate, "month"),
      //   id: "months",
      //   header: "1ви р-т време",
      //   size: 110,
      //   enableGlobalFilter: false,
      //   enableColumnFilter: false,
      //   enableEditing: false,
      //   muiTableBodyCellProps: {
      //     align: "center",
      //   },
      //   Cell: ({ cell }) =>
      //     `${
      //       Math.floor(cell.getValue() / 12)
      //         ? Math.floor(cell.getValue() / 12) + "г. "
      //         : ""
      //     } ${cell.getValue() % 12}м.`,
      // },
      {
        accessorFn: (row) =>
          row.totalExpenseCost
            ? parseFloat(row.totalExpenseCost.toFixed(2))
            : 0,
        id: "totalExpense",
        header: "Разходи",
        size: 120,
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
        enableEditing: false,
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
          row.totalExpenseCost
            ? (
                row.totalExpenseCost / dayjs().diff(row.startDate, "month")
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
        enableEditing: false,
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
        enableEditing: false,
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
        enableEditing: false,
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
        enableEditing: false,
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
        // THIS FOOTER BREAKS THE LOADING MECHANISM WITH ERROR: INVALID DATE

        // Footer: ({ table }) => {
        //   const warning = table
        //     .getFilteredRowModel()
        //     .rows.reduce(
        //       (count, row) =>
        //         count +
        //         (isDue(row.getValue("checked"), "checked") === "warning"
        //           ? 1
        //           : 0),
        //       0
        //     );
        //   const caution = table
        //     .getFilteredRowModel()
        //     .rows.reduce(
        //       (count, row) =>
        //         count +
        //         (isDue(row.getValue("checked"), "checked") === "caution"
        //           ? 1
        //           : 0),
        //       0
        //     );
        //   return (
        //     <Box sx={{ margin: "auto" }}>
        //       <Badge color="error" variant="dot" />: {warning}
        //       <Box>
        //         <Badge color="warning" variant="dot" />: {caution}
        //       </Box>
        //     </Box>
        //   );
        // },
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
        Cell: ({ cell }) =>
          parseInt(cell.getValue()).toLocaleString("bg-BG") + " км",
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
        Cell: ({ cell }) =>
          parseInt(cell.getValue()).toLocaleString("bg-BG") + " км",
      },

      {
        accessorKey: "issue",
        header: "Забележки",
        size: 20,
        enableGlobalFilter: false,
        enableColumnFilter: false,
      },
    ],
    [customFilter, refresh, userRole]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    // enableRowVirtualization: true,
    enableExpandAll: false,
    localization: { ...MRT_Localization_BG },
    enableStickyHeader: true,
    editDisplayMode: "row",
    enableEditing: true,
    // enableGrouping: true,
    // groupedColumnMode,
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
    muiTableContainerProps: { sx: { maxHeight: "60vh" } },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 100,
      },
    },
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
      columnVisibility: {
        ...columnVisibility,
        edit: userRole.includes("admin") ? true : false,
      },
    },
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      // expanded: false,
      // grouping: ["site"],
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

      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-actions", "reg"],
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
      rowsPerPageOptions: [10, 30, 50, 100],
      shape: "rounded",
      variant: "outlined",
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        //stripe the rows, make odd rows a darker color
        "& tr:nth-of-type(odd) > td": {
          backgroundColor: "#fff",
        },
      },
    }),
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
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        {userRole.includes("admin") && (
          <Box>
            {" "}
            <Tooltip title="Редактиране" disableInteractive>
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Tooltip title="Покажи допълнителни действия" disableInteractive>
          <IconButton
            onClick={(event) =>
              setAnchorEl([event.currentTarget, row.original])
            }
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl[0]}
          open={openActionMenu}
          onClose={() => setAnchorEl([null, {}])}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {anchorEl[1].reg}
          <MenuItem
            key={0}
            onClick={() => {
              setAction({
                show: true,
                type: "records",
                vehicle: { ...anchorEl[1] },
              });
              setAnchorEl([null, {}]);
            }}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <Timeline />
            </ListItemIcon>
            Движение
          </MenuItem>

          <MenuItem
            key={1}
            onClick={() => {
              setAction({
                show: true,
                type: "issues",
                vehicle: { ...anchorEl[1] },
              });
              setAnchorEl([null, {}]);
            }}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <WarningAmber />
            </ListItemIcon>
            Забележки
          </MenuItem>

          <MenuItem
            key={2}
            onClick={() => {
              setAction({
                show: true,
                type: "expenses",
                vehicle: { ...anchorEl[1] },
              });
              setAnchorEl([null, {}]);
            }}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <CarRepair />
            </ListItemIcon>
            Разходи
          </MenuItem>

          <MenuItem
            key={3}
            onClick={() => {
              setAction({
                show: true,
                type: "history",
                vehicle: { ...anchorEl[1] },
              });
              setAnchorEl([null, {}]);
            }}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <History />
            </ListItemIcon>
            История
          </MenuItem>
        </Menu>
      </Box>
    ),
    // renderRowActionMenuItems: ({ row, table, closeMenu }) => [
    //   <MenuItem
    //     key={0}
    //     onClick={() => {
    //       setAction({
    //         show: true,
    //         type: "records",
    //         vehicle: { ...row.original },
    //       });
    //       closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //   >
    //     <ListItemIcon>
    //       <Timeline />
    //     </ListItemIcon>
    //     Движение
    //   </MenuItem>,

    //   <MenuItem
    //     key={1}
    //     onClick={() => {
    //       setAction({
    //         show: true,
    //         type: "issues",
    //         vehicle: { ...row.original },
    //       });
    //       closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //   >
    //     <ListItemIcon>
    //       <WarningAmber />
    //     </ListItemIcon>
    //     Забележки
    //   </MenuItem>,
    //   <MenuItem
    //     key={2}
    //     onClick={() => {
    //       setAction({
    //         show: true,
    //         type: "expenses",
    //         vehicle: { ...row.original },
    //       });
    //       closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //   >
    //     <ListItemIcon>
    //       <CarRepair />
    //     </ListItemIcon>
    //     Разходи
    //   </MenuItem>,
    //   <MenuItem
    //     key={3}
    //     onClick={() => {
    //       setAction({
    //         show: true,
    //         type: "history",
    //         vehicle: { ...row.original },
    //       });
    //       closeMenu();
    //     }}
    //     sx={{ m: 0 }}
    //   >
    //     <ListItemIcon>
    //       <History />
    //     </ListItemIcon>
    //     История
    //   </MenuItem>,
    // ],

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Slide
          direction="down"
          in={alert.show}
          sx={{
            position: "absolute",
            left: "40%",
            zIndex: 2,
            width: "30%",
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
        <Tooltip
          placement="bottom"
          title="Презареди таблицата"
          disableInteractive
        >
          <IconButton color="primary" onClick={() => setRefresh(!refresh)}>
            <Refresh />
          </IconButton>
        </Tooltip>

        <Tooltip
          placement="bottom"
          title={
            !showExpense
              ? "Покажи колоните за разходите"
              : "Скрий колоните за разходите"
          }
          disableInteractive
        >
          <Button
            // color={showExpense ? "secondary" : "primary"}
            color="primary"
            onClick={() => {
              setShowExpense(!showExpense);
              if (!showExpense) {
                setColumnVisibility({
                  kaskoDate: false,
                  issue: false,
                  soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
                });
              } else {
                setColumnVisibility({
                  price: false,
                  purchaseDate: false,
                  months: false,
                  totalExpense: false,
                  expensePerMonth: false,
                  totalsFilter: false,
                  expensePerMonthFilter: false,
                  issue: false,
                  soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
                });
              }
            }}
            variant={showExpense ? "contained" : "outlined"}
          >
            {showExpense ? "Скрий разходите" : "Покажи разходите"}
          </Button>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title={!expenseWithTax ? "без ДДС" : "с ДДС"}
          disableInteractive
        >
          <Button
            disabled={showExpense ? false : true}
            color="primary"
            onClick={() => {
              setExpenseWithTax(!expenseWithTax);
            }}
            variant={expenseWithTax ? "contained" : "outlined"}
          >
            {expenseWithTax ? "с ДДС" : "без ДДС"}
          </Button>
        </Tooltip>
      </Box>
    ),
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
            vehicle={expenseVehicle}
            refresh={refresh}
            setRefresh={setRefresh}
            username={username}
            services={expenses}
            setError={setError}
            setIsLoading={setIsLoading}
            add={addExpense}
            setAdd={setAddExpense}
            date={expenseDate}
            setDate={setExpenseDate}
            alert={alert}
            setAlert={setAlert}
            setIsRefetching={setIsRefetching}
            setErrorBanner={setErrorBanner}
          />
        )}
        <CreateVehicle add={add} setAdd={setAdd} />
        <Dialog
          // PaperComponent={DraggablePaper}
          // maxWidth={"xl"}
          fullScreen
          open={action.show}
          onClose={() => setAction({ show: false, type: "", vehicle: {} })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            style={{
              // cursor: "move",
              backgroundColor: "#42a5f5",
            }}
            id="draggable-dialog-title"
          >
            <Button
              size="large"
              variant="contained"
              fontSize="inherit"
              sx={{
                margin: 0,
                marginRight: "15px",
                padding: "2px",
                paddingX: "15px",
                float: "left",
              }}
              color="error"
              onClick={() => setAction({ show: false, type: "", vehicle: {} })}
            >
              <ArrowBackIosNew />
              {"НАЗАД"}
            </Button>
            {`${action.vehicle.reg} ${action.vehicle.make} ${action.vehicle.model}`}
            <IconButton
              size="large"
              fontSize="inherit"
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
                refresh={refresh}
                setRefresh={setRefresh}
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
                  <Tooltip title="Филтрирай всички" disableInteractive>
                    <Button
                      sx={{ width: "40%" }}
                      color="primary"
                      variant={filter === "all" ? "contained" : "outlined"}
                      onClick={() => handleFilter("all")}
                    >
                      {"Всички"}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Филтрирай офис" disableInteractive>
                    <Button
                      sx={{ width: "40%" }}
                      color="primary"
                      variant={filter === "ОФИС" ? "contained" : "outlined"}
                      onClick={() => handleFilter("ОФИС")}
                    >
                      {"ОФИС"}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Филтрирай виталино" disableInteractive>
                    <Button
                      sx={{ width: "40%" }}
                      color="primary"
                      variant={filter === "ВИТАЛИНО" ? "contained" : "outlined"}
                      onClick={() => handleFilter("ВИТАЛИНО")}
                    >
                      {"ВИТАЛИНО"}
                    </Button>
                  </Tooltip>

                  <Tooltip title="Филтрирай борса" disableInteractive>
                    <Button
                      sx={{ width: "40%" }}
                      color="primary"
                      variant={filter === "БОРСА" ? "contained" : "outlined"}
                      onClick={() => handleFilter("БОРСА")}
                    >
                      {"БОРСА"}
                    </Button>
                  </Tooltip>

                  <Tooltip title="Филтрирай други" disableInteractive>
                    <Button
                      sx={{ width: "40%" }}
                      color="primary"
                      variant={filter === "ДРУГИ" ? "contained" : "outlined"}
                      onClick={() => handleFilter("ДРУГИ")}
                    >
                      {"ДРУГИ"}
                    </Button>
                  </Tooltip>

                  <Tooltip title="Филтрирай продадени" disableInteractive>
                    <Button
                      sx={{ width: "40%" }}
                      color="primary"
                      variant={
                        filter === "ПРОДАДЕНИ" ? "contained" : "outlined"
                      }
                      onClick={() => {
                        setShowExpense(true);
                        setColumnVisibility({
                          kaskoDate: false,
                          issue: false,
                          soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
                        });
                        handleFilter("ПРОДАДЕНИ");
                      }}
                    >
                      {"ПРОДАДЕНИ"}
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
              {/* <MRT_GlobalFilterTextField table={table} /> */}
            </Box>

            <Box>
              {/* <Tooltip
                title={
                  !showExpense
                    ? "Покажи колоните за разходите"
                    : "Скрий колоните за разходите"
                }
                disableInteractive
              >
                <Button
                  color={showExpense ? "secondary" : "primary"}
                  onClick={() => {
                    setShowExpense(!showExpense);
                    if (!showExpense) {
                      setColumnVisibility({
                        kaskoDate: false,
                        issue: false,
                        soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
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
                        soldPrice: filter === "ПРОДАДЕНИ" ? true : false,
                      });
                    }
                  }}
                  variant="contained"
                >
                  {showExpense ? "Скрий разходите" : "Покажи разходите"}
                </Button>
              </Tooltip> */}
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

                <Tooltip title="Добави нов автомобил" disableInteractive>
                  <Button
                    disabled={userRole.length === 0 || !userRole ? true : false}
                    variant={"contained"}
                    onClick={() => setAdd(true)}
                  >
                    {"ДОБАВИ"}
                    <AddCircleOutlineIcon />
                  </Button>
                </Tooltip>
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
