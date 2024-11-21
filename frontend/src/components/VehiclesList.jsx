import * as React from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Button, TextField, MenuItem, ButtonGroup } from "@mui/material";
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
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [addExpense, setAddExpense] = useState(false);
  const [expenseVehicle, setExpenseVehicle] = useState({});
  const navigate = useNavigate();
  // Search

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
  const tableData = data
    .filter((obj) =>
      filter === "all" ? obj.site !== "ПРОДАДЕНИ" : obj.site === filter
    )
    .sort((a, b) => a.reg.replace(/\D/g, "") - b.reg.replace(/\D/g, ""))
    .map((obj) => {
      return [
        obj.make + " " + obj.model,
        obj.reg,
        parseInt(obj.price),
        dayjs().diff(obj.startDate, "month"),
        obj.totalServiceCost ? obj.totalServiceCost : 0,
        parseFloat(
          obj.totalServiceCost
            ? (
                obj.totalServiceCost / dayjs().diff(obj.startDate, "month")
              ).toFixed(2)
            : 0
        ),
        obj.insDate,
        obj.kaskoDate,
        obj.gtp,
        obj.km,
        obj.oil,
        obj.oilChange,
        obj.km - obj.oil,
        obj.checked,
        obj._id,
        obj.site,
        obj.issue,
        obj,
      ];
    });

  const columns = [
    {
      name: "Марка/Модел",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {value}
              {tableMeta.rowData[16] ? (
                <BlinkedBox>
                  <WarningAmberIcon />
                </BlinkedBox>
              ) : (
                ""
              )}
            </Box>
          );
        },
      },
    },
    {
      name: "Рег №",
      options: {
        sortCompare: (order) => {
          return (obj1, obj2) => {
            let val1 = obj1.data.replace(/\D/g, "");
            let val2 = obj2.data.replace(/\D/g, "");

            return (val1 - val2) * (order === "asc" ? 1 : -1);
          };
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box>
              {value
                .split(/(\d{4})/)
                .join(" ")
                .trim()}
            </Box>
          );
        },
      },
    },
    {
      name: "Цена",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return value + " лв";
        },
      },
    },
    {
      name: "Време от 1ви р-т",
      options: {
        customBodyRender: (value, tableMeta, updateValue) =>
          `${Math.floor(value / 12) ? Math.floor(value / 12) + "г. " : ""} ${
            value % 12
          }м.`,
        setCellProps: () => {
          return { align: "center" };
        },
      },
    },
    {
      name: "Разходи Общо",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return value + " лв";
        },
      },
    },
    {
      name: "Ср Р-д на мес",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return value + " лв";
        },
      },
    },

    {
      name: "ГО",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box
              style={
                isDue(value, "date") === "warning"
                  ? { color: "red" }
                  : isDue(value, "date") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(value).format("DD/MM/YYYY")}
              {isDue(value, "date") ? <WarningAmberIcon /> : ""}
            </Box>
          );
        },
        setCellProps: () => {
          // return { align: "center" };
        },
        filter: false,
      },
    },
    {
      name: "Каско",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box
              style={
                isDue(value, "date") === "warning"
                  ? { color: "red" }
                  : isDue(value, "date") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(value).format("DD/MM/YYYY") === "01/01/2001" ||
              value === null ||
              value === "31/12/2000"
                ? "Няма"
                : dayjs(value).format("DD/MM/YYYY")}
              {isDue(value, "date") ? <WarningAmberIcon /> : ""}
            </Box>
          );
        },
        setCellProps: () => {
          // return { align: "center" };
        },
        display: false,
        filter: false,
      },
    },
    {
      name: "ГТП",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box
              style={
                isDue(value, "date") === "warning"
                  ? { color: "red" }
                  : isDue(value, "date") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(value).format("DD/MM/YYYY")}
              {isDue(value, "date") ? <WarningAmberIcon /> : ""}
            </Box>
          );
        },
        setCellProps: () => {
          // return { align: "center" };
        },
        filter: false,
      },
    },

    {
      name: "Километри",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "Масло км",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "Масло интервал",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "Масло преди",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box
              style={
                isDue(
                  tableMeta.rowData[9] - tableMeta.rowData[7],
                  "oil",
                  tableMeta.rowData[11]
                ) === "warning"
                  ? { color: "red" }
                  : isDue(
                      tableMeta.rowData[9] - tableMeta.rowData[7],
                      "oil",
                      tableMeta.rowData[11]
                    ) === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {value + " км"}
              {isDue(
                tableMeta.rowData[9] - tableMeta.rowData[7],
                "oil",
                tableMeta.rowData[11]
              ) ? (
                <WarningAmberIcon />
              ) : (
                ""
              )}
            </Box>
          );
        },

        filter: false,
      },
    },
    {
      name: "Проверен",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Box
              style={
                isDue(value, "checked") === "warning"
                  ? { color: "red" }
                  : isDue(value, "checked") === "caution"
                  ? { color: "orange" }
                  : {}
              }
            >
              {dayjs(value).format("DD/MM/YYYY")}
              {isDue(value, "checked") ? <WarningAmberIcon /> : ""}
            </Box>
          );
        },
        setCellProps: () => {
          // return { align: "center" };
        },
        filter: false,
      },
    },
    {
      name: "ID",
      options: {
        display: false,
        filter: false,
      },
    },
    {
      name: "Локация",
      options: {
        display: false,
      },
    },
    {
      name: "Забалежки",
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "Разход",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          if (userRole.includes("admin")) {
            return (
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();

                  axios
                    .get(
                      `http://192.168.0.147:5555/services/${tableMeta.rowData[14]}`
                    )
                    .then((res) => {
                      setExpenses(res.data);
                      setExpenseVehicle({ ...tableMeta.rowData[17] });
                      setAddExpense(true);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                ДОбави
              </Button>
            );
          }
        },
        filter: false,
        display: userRole.includes("admin") ? true : false,
      },
    },
  ];

  const getMuiTheme = () =>
    createTheme({
      components: {
        // MUIDataTableBodyCell: {
        //   styleOverrides: {
        //     root: {
        //       backgroundColor: "#ccc",
        //       "&:hover": {
        //         backgroundColor: "#fff",
        //       },
        //     },
        //   },
        // },
        MUIDataTableBodyRow: {
          styleOverrides: {
            root: {
              backgroundColor: "#ddd",
              cursor: "pointer",
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              // backgroundColor: "#fff",
            },
          },
        },
        MUIDataTableToolbar: {
          styleOverrides: {
            root: {
              // backgroundColor: "#fff",
              // fontWeight: "800",
            },
          },
        },
      },
    });
  const options = {
    resizableColumns: true,
    filterType: "dropdown",
    rowHover: true,
    print: false,

    selectableRows: false,
    download: false,
    onRowClick: (rowData, rowMeta) => {
      handleClick(rowData[14]);
    },
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 100],
    // expandableRowsOnClick: true,
    // expandableRows: true,
    textLabels: {
      body: {
        noMatch: "Нищо не е намерено",
      },
      pagination: {
        next: "Следваща страница",
        previous: "Предишна страница",
        rowsPerPage: "Покажи по:",
        displayRows: "от", // 1-10 of 30
      },
      toolbar: {
        search: "Търсене",
        downloadCsv: "Изтегли CSV",
        print: "Принтирай",
        viewColumns: "Показване на колони",
        filterTable: "Филтри",
      },
      filter: {
        title: "ФИЛТРИ",
        reset: "изчисти",
      },
      viewColumns: {
        title: "Покажи колони",
      },
      selectedRows: {
        text: "rows(s) deleted",
        delete: "Delete",
      },
    },
  };

  return (
    <div className="flex justify-center">
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
      {/* <Dialog
        maxWidth={"xl"}
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Добавяне на нов автомобил`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText> */}
      <CreateVehicle add={add} setAdd={setAdd} />
      {/* </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => setAdd(false)}
            autoFocus
          >
            Отказ
          </Button>
        </DialogActions>
      </Dialog>{" "} */}
      <Box sx={{ width: "95%", margin: "25px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            borderRadius: "10px",
          }}
        >
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
                color={filter === "СКЛАД" ? "secondary" : "primary"}
                variant={"contained"}
                onClick={() => handleFilter("СКЛАД")}
              >
                {"СКЛАД"}
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
          <Button
            disabled={userRole.length === 0 || !userRole ? true : false}
            sx={{ width: "10%" }}
            variant={"contained"}
            onClick={() => setAdd(true)}
          >
            {"ДОБАВИ"}
            <AddCircleOutlineIcon />
          </Button>
        </Box>
        {/* <ThemeProvider theme={getMuiTheme()}> */}
        <MUIDataTable
          title={"АВТОМОБИЛИ"}
          data={tableData}
          columns={columns}
          options={options}
        />
        {/* </ThemeProvider> */}

        {/* </ThemeProvider> */}
      </Box>
    </div>
  );
}
