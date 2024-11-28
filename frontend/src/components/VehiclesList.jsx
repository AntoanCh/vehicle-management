import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import VehicleRecords from "./VehicleRecords";
import Issues from "./Issues";
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
import {
  History,
  QueryStats,
  CarRepair,
  DeleteForever,
  Cancel,
  Timeline,
  Close,
  Save,
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

export default function VehiclesList({ data, filter, setFilter }) {
  const [expenseDate, setExpenseDate] = useState(dayjs());
  const [userRole, setUserRole] = useState([]);
  const [username, setUsername] = useState();
  const [expenses, setExpenses] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [add, setAdd] = useState(false);
  const [action, setAction] = useState({ show: false, type: "", vehicle: {} });
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [addExpense, setAddExpense] = useState(false);
  const [expenseVehicle, setExpenseVehicle] = useState({});
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

  React.useEffect(() => {
    setFilter(filter.slice());
  }, [filter]);
  setTimeout(() => setRefresh(false), 1500);

  const handleFilter = (val) => {
    setFilter(val);
  };

  const handleClick = (id) => {
    navigate(`/vehicles/details/${id}`);
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

  const tableData = useMemo(() => {
    return data.filter((obj) =>
      filter === "all" ? obj.site !== "ПРОДАДЕНИ" : obj.site === filter
    );
  }, [filter]);

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
              {
                <IconButton
                  sx={{ padding: "0", margin: "0", marginLeft: "5px" }}
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (userRole.includes("admin")) {
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
                    } else {
                    }
                  }}
                >
                  <AttachMoneyIcon />
                </IconButton>
              }
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
          row.totalServiceCost
            ? parseFloat(row.totalServiceCost.toFixed(2))
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
      },
      {
        accessorKey: "oil",
        header: "Масло-км",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "oilChange",
        header: "Масло интервал",
        size: 110,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorFn: (row) => row.km - row.oil,
        id: "oilPast",
        header: "Масло на",
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
              {cell.getValue() + " км"}
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
    [refresh]
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
    enableColumnResizing: true,
    enableRowSelection: true,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    enableRowNumbers: true,
    enableRowActions: true,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
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
      columnVisibility: {
        kaskoDate: false,
        oil: false,
        issue: false,
        oilChange: false,
        km: false,
      },
      pagination: { pageSize: 30, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-actions", "reg"],
        right: ["mrt-row-select"],
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
            <Issues
              username={username}
              userRole={userRole}
              vehicle={action.vehicle}
            />
          )}
          {action.type === "history" && (
            <Issues
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

      <Box sx={{ maxHeight: "100px" }}>
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
  );
}
