import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, ButtonGroup, MenuItem, TextField } from "@mui/material";
import {
  Edit,
  Save,
  Timeline,
  WarningAmber,
  Warning,
  Cancel,
  DeleteForever,
  LocalGasStation,
  CarRepair,
  QueryStats,
  History,
  DoneAll,
  AttachMoney,
} from "@mui/icons-material";
import Expenses from "../../components/vehicles/Expenses";
import Ref from "../../components/vehicles/Ref";
import VehicleRecords from "../../components/vehicles/VehicleRecords";
import Issues from "../../components/vehicles/Issues";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import Log from "../../components/vehicles/Log";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import { keyframes } from "@mui/system";

const ItemInline = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#ccc",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  display: "flex",
  fontWeight: "800",

  justifyContent: "space-between",
  color: theme.palette.text.primary,
}));
const ItemStacked = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#ccc",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "start",
  display: "flex",
  fontWeight: "800",
  fontSize: "18",
  flexDirection: "column",
  justifyContent: "space-between",
  color: theme.palette.text.primary,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  ...theme.typography.body2,
  "& .MuiInputBase-input": {
    fontSize: 18,
    height: "20px",
    padding: 1,
    fontWeight: 800,
    textAlign: "center",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: theme.palette.mode === "dark" ? "white" : "black",
  },
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: "0px",
    margin: "none",
    width: "70%",
    height: "15px",
    fontWeight: 800,
  },
  "& .MuiInputBase-root": {
    padding: 0,
    margin: "none",

    "& .MuiButtonBase-root": {
      padding: 0,
      margin: "none",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: theme.palette.mode === "dark" ? "white" : "black",
    },
  },
}));

const StyledInput = styled("input")(({ theme }) => ({
  ...theme.applyStyles("dark", {
    color: "black",
  }),
}));

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
const ShowVehicle = () => {
  const [vehicle, setVehicle] = useState({});
  const [oldVehicle, setOldVehicle] = useState({});
  const [showLog, setShowLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState(false);
  const [verDelete, setVerDelete] = useState(false);
  const [sell, setSell] = useState([false, 0, dayjs()]);
  const [userRole, setUserRole] = useState([]);
  const [username, setUsername] = useState();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
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
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://192.168.0.147:5555/vehicle/${id}`)
      .then((res) => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [refresh]);

  const handleShowLog = () => {
    setShowLog(!showLog);
  };
  const handleClose = () => {
    setVerDelete(false);
  };
  const handleCloseSell = () => {
    setSell([false, 0, dayjs()]);
  };
  const verifyDelete = () => {
    setVerDelete(true);
  };
  const verifySell = () => {
    setSell([true, 0, dayjs()]);
  };
  const handleDelete = () => {
    axios
      .delete(`http://192.168.0.147:5555/vehicle/${vehicle._id}`)
      .then(() => {
        navigate("/vehicles");
      });
  };
  const handleEdit = () => {
    setOldVehicle({ ...vehicle });
    setEdit(true);
  };

  const handleSave = () => {
    let updated;
    if (vehicle.km < oldVehicle.km) {
      updated = { ...vehicle, km: oldVehicle.km };
    } else {
      updated = { ...vehicle };
    }
    let diff = {};
    for (const key in oldVehicle) {
      if (vehicle[key] && oldVehicle[key] != vehicle[key]) {
        diff[key] = [oldVehicle[key], vehicle[key]];
      }
    }
    setEdit(false);

    axios
      .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
        ...updated,
      })
      .then(() => {
        axios.post(`http://192.168.0.147:5555/api/logs`, {
          date: dayjs(),
          user: username,
          changed: diff,
          vehicleId: vehicle._id,
        });
        setTimeout(() => {
          // window.location.reload();
          setRefresh(!refresh);
        }, 1000);
      })
      .catch((err) => {
        alert("Грешка, проверете конзолата");
        console.log(err);
        // window.location.reload();
        setRefresh(!refresh);
      });
  };
  const handleCancelEdit = () => {
    setEdit(false);
  };
  const handleKasko = (event) => {
    setVehicle({
      ...vehicle,
      kasko: event.target.checked,
      kaskoDate: event.target.checked ? dayjs() : dayjs("01-01-2001"),
    });
  };
  const handleVignette = (event) => {
    setVehicle({
      ...vehicle,
      vignette: event.target.checked,
      vignetteDate: event.target.checked ? dayjs() : dayjs("01-01-2001"),
    });
  };

  const handleChange = (e) => {
    if (e.target.name === "tires") {
      if (e.target.value.match(/^[0-9]{3}$/)) {
        e.target.value = e.target.value + "/";
      } else if (e.target.value.match(/[0-9]{3}\/[0-9]{2}$/)) {
        e.target.value = e.target.value + "/";
      } else if (e.target.value.match(/[0-9]{3}\/[0-9]{2}\/[0-9]{3}$/)) {
      }
    }
    if ((e.target.name === "km" || e.target.name === "oil") && e.target.value) {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    }

    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const isDue = (dueDate, type) => {
    if (vehicle.sold) {
      return "";
    } else {
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
        if (dueDate > vehicle.oilChange) {
          return "warning";
        } else if (dueDate > vehicle.oilChange - 1000) {
          return "caution";
        }
      }
    }
  };
  const handleCheck = () => {
    vehicle.checked = dayjs();
    axios
      .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
      .then(() => {
        axios.post(`http://192.168.0.147:5555/api/logs`, {
          date: dayjs(),
          user: username,
          changed: { checked: [0, dayjs()] },
          vehicleId: vehicle._id,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        // window.location.reload();
      })
      .catch((err) => {
        alert("Грешка, проверете конзолата");
        console.log(err);
        window.location.reload();
      });
  };

  return (
    <Box className="p-4">
      {loading ? (
        <CircularProgress />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
          <Dialog
            open={verDelete}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"></DialogContentText>
              {`ВНИМАНИЕ! \nСигурен ли сте, че искате да изтриете автомобил ${
                vehicle.make + " " + vehicle.model
              } с Номер ${vehicle.reg}
              }\n Всички данни за автомобила, включително сервизната история ще бъдат премахнати завинаги
              \n Ако автомобилът е продаден, моля използвайте бутонът ПРОДАДЕН
              `}
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="contained"
                onClick={handleClose}
                autoFocus
              >
                Отказ
              </Button>
              <Button variant="contained" onClick={handleDelete} autoFocus>
                ИзтриЙ
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={sell[0]}
            onClose={handleCloseSell}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">ПРОДАЖБА</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"></DialogContentText>
              {`ВНИМАНИЕ! Продажба автомобил ${
                vehicle.make + " " + vehicle.model
              } с Номер ${
                vehicle.reg
              }\n Всички данни за автомобила,  ще бъдат запазени, но няма да могат да се редактират повече
              
              `}
              <Box>
                <ItemStacked>
                  <Box sx={{ color: "gray" }}>Цена:</Box>
                  <StyledTextField
                    value={sell[1]}
                    name="sold.price"
                    onChange={(e) => {
                      const newArr = [...sell];
                      newArr[1] = e.target.value;
                      setSell([...newArr]);
                    }}
                    variant="standard"
                  />
                </ItemStacked>
                <ItemStacked>
                  <Box sx={{ color: "gray" }}>Дата:</Box>
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <StyledDatePicker
                      slotProps={{
                        textField: {
                          width: "20%",
                          size: "small",
                          padding: "0",
                          margin: "none",
                          variant: "standard",
                        },
                        inputAdornment: {
                          padding: "0",
                          margin: "none",
                        },
                      }}
                      format="DD/MM/YYYY"
                      id="sold.date"
                      value={sell[2]}
                      name="sold.date"
                      onChange={(newValue) => {
                        const newArr = [...sell];
                        newArr[2] = newValue;
                        setSell([...newArr]);
                      }}
                    />
                  </DemoContainer>
                </ItemStacked>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                color="error"
                variant="contained"
                onClick={handleCloseSell}
                autoFocus
              >
                Отказ
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  axios.put(
                    `http://192.168.0.147:5555/vehicle/${vehicle._id}`,
                    {
                      ...vehicle,
                      sold: true,
                      soldPrice: sell[1],
                      soldDate: sell[2],
                      state: "ПРОДАДЕН",
                      site: "ПРОДАДЕНИ",
                    }
                  )
                }
                autoFocus
              >
                Готово
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ width: "90%", margin: "auto" }}>
            {vehicle.issue && (
              <Alert
                sx={{
                  marginBottom: "5px",
                  color: "black",
                  fontWeight: 800,
                }}
                variant="filled"
                severity="warning"
              >
                АВТОМОБИЛЪТ ИМА НЕРАЗРЕШЕНИ ЗАБЕЛЕЖКИ
              </Alert>
            )}
            {vehicle.sold && (
              <Alert
                sx={{ marginBottom: "5px", color: "black", fontWeight: 800 }}
                variant="filled"
                severity="error"
              >
                ПРОДАДЕН!
              </Alert>
            )}
            <h1 className="text-3xl m-auto text-center my-4">
              {vehicle.type === "Truck" ? "Товарен автомобил" : "Лек Автомобил"}
            </h1>
            <Box sx={{ display: { sm: "flex", xs: "" } }}>
              <Box>
                <Stack spacing={2}>
                  <Box>
                    <Box className="input-box" sx={{ width: "100%" }}>
                      <StyledInput
                        className="registration-ui"
                        autoComplete="off"
                        type="text"
                        name="numberPlate"
                        value={vehicle.reg}
                        disabled
                      />
                      <span className="unit">BG</span>
                    </Box>
                  </Box>
                  <ItemInline
                    sx={{
                      width: "95%",
                      backgroundColor: "black",
                    }}
                  >
                    <TextField
                      value={`${vehicle.make} ${vehicle.model}`}
                      disabled
                      variant="standard"
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 19,
                          height: 4,
                          padding: 1,
                          fontWeight: 700,
                          textAlign: "center",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "white", //Adjust text color here
                        },
                      }}
                    />
                  </ItemInline>
                  <ItemInline
                    sx={{
                      width: "95%",
                      textAlign: "center",
                      backgroundColor: "rgb(50, 50, 50)",
                      color: "white",
                    }}
                  >
                    <StyledTextField
                      inputProps={{ maxLength: 7 }}
                      value={
                        !edit
                          ? vehicle.km &&
                            vehicle.km.toString().slice(0, -3) +
                              " " +
                              vehicle.km.toString().slice(-3)
                          : vehicle.km
                      }
                      disabled={!edit}
                      id="km"
                      name="km"
                      onChange={handleChange}
                      variant="standard"
                      // sx={{
                      //   "& .MuiInputBase-input": {
                      //     fontSize: 18,
                      //     height: 4,
                      //     padding: 1,
                      //     fontWeight: 800,
                      //     textAlign: "center",
                      //     color: "white",
                      //   },
                      //   "& .MuiInputBase-input.Mui-disabled": {
                      //     WebkitTextFillColor: "white", //Adjust text color here
                      //   },
                      // }}
                    />
                    <span>KM</span>
                  </ItemInline>
                </Stack>
              </Box>

              <Grid container spacing={2}>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Година:</Box>
                    <Box>
                      <StyledTextField
                        value={vehicle.year}
                        disabled
                        name="km"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Гориво:</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        value={vehicle.fuel}
                        disabled
                        name="fuel"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>№ ДВГ</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        value={vehicle.engNum}
                        disabled={!edit}
                        name="engNum"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Гуми Размер</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        inputProps={{ maxLength: 9 }}
                        value={vehicle.tires}
                        disabled={!edit}
                        name="tires"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Отговорник:</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        fullWidth
                        value={vehicle.site}
                        disabled={!edit}
                        select={edit}
                        SelectProps={{ sx: { height: "25px" } }}
                        name="site"
                        onChange={handleChange}
                        variant="standard"
                      >
                        <MenuItem key={1} value={"ОФИС"}>
                          ОФИС
                        </MenuItem>
                        <MenuItem key={2} value={"ВИТАЛИНО"}>
                          ВИТАЛИНО
                        </MenuItem>
                        <MenuItem key={3} value={"БОРСА"}>
                          БОРСА
                        </MenuItem>
                        <MenuItem key={4} value={"ДРУГИ"}>
                          ДРУГИ
                        </MenuItem>
                      </StyledTextField>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>№ Талон</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        value={vehicle.talonNum}
                        disabled
                        name="talonNum"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>№ Рама</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        value={vehicle.bodyNum}
                        disabled
                        name="bodyNum"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Собственик</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        fullWidth
                        value={vehicle.owner}
                        disabled={!edit}
                        select={edit}
                        SelectProps={{ sx: { height: "25px" } }}
                        name="owner"
                        onChange={handleChange}
                        variant="standard"
                      >
                        <MenuItem key={1} value={"НИКОН-НК"}>
                          НИКОН-НК
                        </MenuItem>
                        <MenuItem key={2} value={"ЕКСПРЕС-ГАРАНТ НК"}>
                          ЕКСПРЕС-ГАРАНТ НК
                        </MenuItem>
                        <MenuItem key={3} value={"НИКОЛАЙ КЪНЧЕВ"}>
                          НИКОЛАЙ КЪНЧЕВ
                        </MenuItem>
                        <MenuItem key={4} value={"ДАРИНКА ВУТЕВА"}>
                          ДАРИНКА ВУТЕВА
                        </MenuItem>
                      </StyledTextField>
                    </Box>
                  </ItemStacked>
                </Grid>
              </Grid>
            </Box>

            <div className="my-4">
              <Grid container spacing={2} columns={48}>
                <Grid item sm={9} xs={48}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Обслужвен на:</Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <StyledTextField
                        inputProps={{ maxLength: 7 }}
                        value={
                          vehicle.oil && !edit
                            ? vehicle.oil.toString().slice(0, -3) +
                              " " +
                              vehicle.oil.toString().slice(-3)
                            : vehicle.oil
                        }
                        disabled={!edit}
                        name="oil"
                        onChange={handleChange}
                        variant="standard"
                      />
                      <span>KM</span>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item sm={9} xs={48}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Обслужване Интервал</Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <StyledTextField
                        inputProps={{ maxLength: 5 }}
                        value={
                          !edit
                            ? vehicle.oilChange &&
                              vehicle.oilChange.toString().slice(0, -3) +
                                " " +
                                vehicle.oilChange.toString().slice(-3)
                            : vehicle.oilChange
                        }
                        disabled={!edit}
                        name="oilChange"
                        onChange={handleChange}
                        variant="standard"
                      />
                      <span>KM</span>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item sm={9} xs={48}>
                  <ItemStacked
                    sx={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? { backgroundColor: "#bb5a5a" }
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? { backgroundColor: "#ca9f3d" }
                        : {}
                    }
                  >
                    <Box
                      sx={
                        isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                          ? {
                              color: "#950e0e",
                              display: "flex",
                              justifyContent: "space-between",
                            }
                          : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                          ? { color: "#95660e", display: "flex" }
                          : { color: "gray", display: "flex" }
                      }
                    >
                      Изминати км:
                      {isDue(vehicle.km - vehicle.oil, "oil") ? (
                        <WarningAmber />
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <StyledTextField
                        inputProps={{ maxLength: 7 }}
                        value={
                          vehicle.km &&
                          (vehicle.km - vehicle.oil).toString().slice(0, -3) +
                            " " +
                            (vehicle.km - vehicle.oil).toString().slice(-3)
                        }
                        disabled
                        variant="standard"
                      />
                      <span>KM</span>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item sm={9} xs={48}>
                  <ItemStacked
                    sx={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? { backgroundColor: "#bb5a5a" }
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? { backgroundColor: "#ca9f3d" }
                        : {}
                    }
                  >
                    <Box
                      sx={
                        isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                          ? {
                              color: "#950e0e",
                              display: "flex",
                              justifyContent: "space-between",
                            }
                          : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                          ? { color: "#95660e", display: "flex" }
                          : { color: "gray", display: "flex" }
                      }
                    >
                      Обслужване след:{" "}
                      {isDue(vehicle.km - vehicle.oil, "oil") ? (
                        <WarningAmber />
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <StyledTextField
                        inputProps={{ maxLength: 7 }}
                        value={
                          vehicle.oilChange - (vehicle.km - vehicle.oil) &&
                          (vehicle.oilChange - (vehicle.km - vehicle.oil))
                            .toString()
                            .slice(0, -3) +
                            " " +
                            (vehicle.oilChange - (vehicle.km - vehicle.oil))
                              .toString()
                              .slice(-3)
                        }
                        disabled
                        variant="standard"
                      />
                      <span>KM</span>
                    </Box>
                  </ItemStacked>
                </Grid>

                <Grid item sm={12} xs={48}>
                  <ItemStacked
                    sx={
                      isDue(vehicle.checked, "checked") === "warning"
                        ? { backgroundColor: "#bb5a5a" }
                        : isDue(vehicle.checked, "checked") === "caution"
                        ? { backgroundColor: "#ca9f3d" }
                        : {}
                    }
                  >
                    <Box
                      sx={
                        isDue(vehicle.checked, "checked") === "warning"
                          ? {
                              color: "#950e0e",
                              display: "flex",
                              justifyContent: "space-between",
                            }
                          : isDue(vehicle.checked, "checked") === "caution"
                          ? { color: "#95660e", display: "flex" }
                          : { color: "gray", display: "flex" }
                      }
                    >
                      Проверен на:
                      {isDue(vehicle.checked, "checked") ? (
                        <WarningAmber />
                      ) : (
                        ""
                      )}
                      {(userRole.includes("admin") ||
                        userRole.includes(vehicle.site)) &&
                      !vehicle.sold ? (
                        <Button
                          sx={{ maxHeight: "20px", marginLeft: "10px" }}
                          variant="contained"
                          onClick={handleCheck}
                          color="primary"
                          aria-label="add"
                        >
                          <DoneAll />
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box>
                      {" "}
                      <DemoContainer components={["DatePicker, DatePicker"]}>
                        <StyledDatePicker
                          slotProps={{
                            textField: {
                              width: "20%",
                              size: "small",
                              padding: "0px",
                              margin: "none",
                              variant: "standard",
                            },
                            inputAdornment: {
                              padding: "0px",
                              margin: "none",
                            },
                          }}
                          disabled={edit ? false : true}
                          format="DD/MM/YYYY"
                          id="checked"
                          value={
                            vehicle.checked ? dayjs(vehicle.checked) : dayjs()
                          }
                          name="checked"
                          onChange={(newValue) => {
                            setVehicle({ ...vehicle, checked: newValue });
                          }}
                        />
                      </DemoContainer>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item sm={9} xs={48}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Статус</Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <StyledTextField
                        fullWidth
                        value={vehicle.status}
                        disabled={!edit}
                        select={edit}
                        SelectProps={{ sx: { height: "25px" } }}
                        name="status"
                        onChange={handleChange}
                        variant="standard"
                      >
                        <MenuItem key={1} value={"АКТИВЕН"}>
                          АКТИВЕН
                        </MenuItem>
                        <MenuItem key={2} value={"НЕАКТИВЕН"}>
                          НЕАКТИВЕН
                        </MenuItem>
                        <MenuItem key={3} value={"СЕРВИЗ"}>
                          СЕРВИЗ
                        </MenuItem>
                      </StyledTextField>
                      <span>KM</span>
                    </Box>
                  </ItemStacked>
                </Grid>
              </Grid>

              <div className="my-4 flex pt-2 justify-end my-2 border-t border-gray-500">
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked
                      sx={
                        !vehicle.vignette
                          ? { backgroundColor: "rgb(156 163 175)" }
                          : isDue(vehicle.vignetteDate, "date") === "warning"
                          ? { backgroundColor: "#bb5a5a" }
                          : isDue(vehicle.vignetteDate, "date") === "caution"
                          ? { backgroundColor: "#ca9f3d" }
                          : {}
                      }
                    >
                      <Box
                        sx={
                          !vehicle.vignette
                            ? {}
                            : isDue(vehicle.vignetteDate, "date") === "warning"
                            ? { color: "#950e0e" }
                            : isDue(vehicle.vignetteDate, "date") === "caution"
                            ? { color: "#95660e" }
                            : { color: "gray" }
                        }
                      >
                        Винетка:
                        {!vehicle.vignette ? (
                          ""
                        ) : isDue(vehicle.vignetteDate, "date") ? (
                          <WarningAmber />
                        ) : (
                          ""
                        )}
                        {edit ? (
                          <Checkbox
                            sx={{
                              margin: "none",
                              padding: "0",
                              paddingLeft: "2px",
                            }}
                            checked={vehicle.vignette}
                            onChange={handleVignette}
                          />
                        ) : (
                          ""
                        )}
                      </Box>
                      <Box>
                        {!vehicle.vignette ? (
                          <StyledTextField
                            disabled
                            value={"НЯМА"}
                            variant="standard"
                          />
                        ) : (
                          <DemoContainer
                            components={["DatePicker, DatePicker"]}
                          >
                            <StyledDatePicker
                              slotProps={{
                                textField: {
                                  width: "20%",
                                  size: "small",
                                  padding: "0",
                                  margin: "none",
                                  variant: "standard",
                                },
                                inputAdornment: {
                                  padding: "0",
                                  margin: "none",
                                },
                              }}
                              disabled={edit ? !vehicle.vignette : true}
                              format="DD/MM/YYYY"
                              id="vignetteDate"
                              value={
                                vehicle.vignetteDate
                                  ? dayjs(vehicle.vignetteDate)
                                  : dayjs()
                              }
                              name="vignetteDate"
                              onChange={(newValue) => {
                                setVehicle({
                                  ...vehicle,
                                  vignetteDate: newValue,
                                });
                              }}
                            />
                          </DemoContainer>
                        )}
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>Данък:</Box>
                      <Box>
                        {" "}
                        <StyledTextField
                          fullWidth
                          value={vehicle.tax}
                          disabled={!edit}
                          select={edit}
                          SelectProps={{ sx: { height: "25px" } }}
                          name="tax"
                          onChange={handleChange}
                          variant="standard"
                        >
                          <MenuItem key={1} value={dayjs().year() - 1}>
                            {dayjs().year() - 1}
                          </MenuItem>
                          <MenuItem key={2} value={dayjs().year()}>
                            {dayjs().year()}
                          </MenuItem>
                          <MenuItem key={3} value={dayjs().year() + 1}>
                            {dayjs().year() + 1}
                          </MenuItem>
                        </StyledTextField>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked
                      sx={
                        isDue(vehicle.gtp, "date") === "warning"
                          ? { backgroundColor: "#bb5a5a" }
                          : isDue(vehicle.gtp, "date") === "caution"
                          ? { backgroundColor: "#ca9f3d" }
                          : {}
                      }
                    >
                      <Box
                        sx={
                          isDue(vehicle.gtp, "date") === "warning"
                            ? { color: "#950e0e" }
                            : isDue(vehicle.gtp, "date") === "caution"
                            ? { color: "#95660e" }
                            : { color: "gray" }
                        }
                      >
                        ГТП:
                        {isDue(vehicle.gtp, "date") ? <WarningAmber /> : ""}
                      </Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <StyledDatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0",
                                margin: "none",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0",
                                margin: "none",
                              },
                            }}
                            disabled={edit ? false : true}
                            format="DD/MM/YYYY"
                            id="gtp"
                            value={vehicle.gtp ? dayjs(vehicle.gtp) : dayjs()}
                            name="gtp"
                            onChange={(newValue) => {
                              setVehicle({ ...vehicle, gtp: newValue });
                            }}
                          />
                        </DemoContainer>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>ЕКО Група:</Box>
                      <Box>
                        {" "}
                        <StyledTextField
                          fullWidth
                          value={vehicle.cat}
                          disabled={!edit}
                          select={edit}
                          SelectProps={{ sx: { height: "25px" } }}
                          name="cat"
                          onChange={handleChange}
                          variant="standard"
                        >
                          <MenuItem key={1} value={1}>
                            1
                          </MenuItem>
                          <MenuItem key={2} value={2}>
                            2
                          </MenuItem>
                          <MenuItem key={3} value={3}>
                            3
                          </MenuItem>
                          <MenuItem key={3} value={4}>
                            4
                          </MenuItem>
                          <MenuItem key={3} value={5}>
                            5
                          </MenuItem>
                        </StyledTextField>
                      </Box>
                    </ItemStacked>
                  </Grid>
                </Grid>
              </div>
              <div className="my-4 flex justify-end my-2">
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked
                      sx={
                        isDue(vehicle.insDate, "date") === "warning"
                          ? { backgroundColor: "#bb5a5a" }
                          : isDue(vehicle.insDate, "date") === "caution"
                          ? { backgroundColor: "#ca9f3d" }
                          : {}
                      }
                    >
                      <Box
                        sx={
                          isDue(vehicle.insDate, "date") === "warning"
                            ? { color: "#950e0e" }
                            : isDue(vehicle.insDate, "date") === "caution"
                            ? { color: "#95660e" }
                            : { color: "gray" }
                        }
                      >
                        ГО до:
                        {isDue(vehicle.insDate, "date") ? <WarningAmber /> : ""}
                      </Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <StyledDatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0",
                                margin: "none",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0",
                                margin: "none",
                              },
                            }}
                            disabled={edit ? false : true}
                            format="DD/MM/YYYY"
                            id="insDate"
                            value={
                              vehicle.insDate ? dayjs(vehicle.insDate) : dayjs()
                            }
                            name="insDate"
                            onChange={(newValue) => {
                              setVehicle({ ...vehicle, insDate: newValue });
                            }}
                          />
                        </DemoContainer>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>ГО № Полица</Box>
                      <Box>
                        {" "}
                        <StyledTextField
                          value={vehicle.insNum}
                          disabled={!edit}
                          name="insNum"
                          onChange={handleChange}
                          variant="standard"
                        />
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked
                      sx={
                        !vehicle.kasko
                          ? { backgroundColor: "rgb(156 163 175)" }
                          : isDue(vehicle.kaskoDate, "date") === "warning"
                          ? { backgroundColor: "#bb5a5a" }
                          : isDue(vehicle.kaskoDate, "date") === "caution"
                          ? { backgroundColor: "#ca9f3d" }
                          : {}
                      }
                    >
                      <Box
                        sx={
                          !vehicle.kasko
                            ? {}
                            : isDue(vehicle.kaskoDate, "date") === "warning"
                            ? { color: "#950e0e" }
                            : isDue(vehicle.kaskoDate, "date") === "caution"
                            ? { color: "#95660e" }
                            : { color: "gray" }
                        }
                      >
                        Каско до:
                        {!vehicle.kasko ? (
                          ""
                        ) : isDue(vehicle.kaskoDate, "date") ? (
                          <WarningAmber />
                        ) : (
                          ""
                        )}
                        {edit ? (
                          <Checkbox
                            sx={{
                              // margin: "0",
                              padding: "0",
                              paddingLeft: "2px",
                            }}
                            checked={vehicle.kasko}
                            onChange={handleKasko}
                          />
                        ) : (
                          ""
                        )}
                      </Box>
                      <Box>
                        {!vehicle.kasko ? (
                          <StyledTextField
                            disabled
                            value={"НЯМА"}
                            variant="standard"
                          />
                        ) : (
                          <DemoContainer
                            components={["DatePicker, DatePicker"]}
                          >
                            <StyledDatePicker
                              slotProps={{
                                textField: {
                                  width: "20%",
                                  size: "small",
                                  padding: "0px",
                                  margin: "none",
                                  variant: "standard",
                                },
                                inputAdornment: {
                                  padding: "0px",
                                  margin: "none",
                                },
                              }}
                              disabled={edit ? !vehicle.kasko : true}
                              format="DD/MM/YYYY"
                              id="kaskoDate"
                              value={
                                vehicle.kaskoDate
                                  ? dayjs(vehicle.kaskoDate)
                                  : dayjs()
                              }
                              name="kaskoDate"
                              onChange={(newValue) => {
                                setVehicle({
                                  ...vehicle,
                                  kaskoDate: newValue,
                                });
                              }}
                            />
                          </DemoContainer>
                        )}
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked
                      sx={
                        !vehicle.kasko
                          ? { backgroundColor: "rgb(156 163 175)" }
                          : {}
                      }
                    >
                      <Box>Каско № Полица</Box>
                      <Box>
                        <StyledTextField
                          value={!vehicle.kasko ? "НЯМА" : vehicle.kaskoNum}
                          disabled={
                            !edit ? true : !vehicle.kasko ? true : false
                          }
                          name="kaskoNum"
                          onChange={handleChange}
                          variant="standard"
                        />
                      </Box>
                    </ItemStacked>
                  </Grid>
                </Grid>
              </div>
              <div className="my-4 flex justify-end my-2"></div>
              <div className="my-4 pt-2 flex justify-end my-2 border-t border-gray-500">
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>Дата на покупка:</Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <StyledDatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0",
                                margin: "none",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0",
                                margin: "none",
                              },
                            }}
                            disabled={edit ? false : true}
                            format="DD/MM/YYYY"
                            id="purchaseDate"
                            value={
                              vehicle.purchaseDate
                                ? dayjs(vehicle.purchaseDate)
                                : dayjs()
                            }
                            name="purchaseDate"
                            onChange={(newValue) => {
                              setVehicle({
                                ...vehicle,
                                purchaseDate: newValue,
                              });
                            }}
                          />
                        </DemoContainer>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>Първи ремонт:</Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <StyledDatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0",
                                margin: "none",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0",
                                margin: "none",
                              },
                            }}
                            disabled={edit ? false : true}
                            format="DD/MM/YYYY"
                            id="startDate"
                            value={
                              vehicle.startDate
                                ? dayjs(vehicle.startDate)
                                : dayjs()
                            }
                            name="startDate"
                            onChange={(newValue) => {
                              setVehicle({
                                ...vehicle,
                                startDate: newValue,
                              });
                            }}
                          />
                        </DemoContainer>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>Начални километри:</Box>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <StyledTextField
                          inputProps={{ maxLength: 7 }}
                          value={
                            vehicle.startKm
                              ? !edit
                                ? vehicle.startKm.toString().slice(0, -3) +
                                  " " +
                                  vehicle.startKm.toString().slice(-3)
                                : vehicle.startKm
                              : !edit
                              ? "НЯМА ДАННИ"
                              : ""
                          }
                          disabled={!edit}
                          name="startKm"
                          onChange={handleChange}
                          variant="standard"
                        />
                        <span>KM</span>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>Цена на покупка:</Box>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <StyledTextField
                          inputProps={{ maxLength: 7 }}
                          value={
                            vehicle.price
                              ? !edit
                                ? vehicle.price.toString().slice(0, -3) +
                                  " " +
                                  vehicle.price.toString().slice(-3)
                                : vehicle.price
                              : !edit
                              ? "НЯМА ДАННИ"
                              : ""
                          }
                          disabled={!edit}
                          name="price"
                          onChange={handleChange}
                          variant="standard"
                        />
                        <span>ЛВ</span>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  {vehicle.sold && (
                    <Grid item sm={3} xs={12}>
                      <ItemStacked>
                        <Box sx={{ color: "gray" }}>Цена на продажба:</Box>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <StyledTextField
                            disabled
                            inputProps={{ maxLength: 7 }}
                            value={
                              // vehicle.soldPrice
                              //   ? vehicle.soldPrice.toString().slice(0, -3) +
                              //     " " +
                              //     vehicle.soldPrice.toString().slice(-3)
                              //   : ""
                              vehicle.soldPrice
                            }
                            variant="standard"
                          />
                          <span>ЛВ</span>
                        </Box>
                      </ItemStacked>
                    </Grid>
                  )}
                  {vehicle.sold && (
                    <Grid item sm={3} xs={12}>
                      <ItemStacked>
                        <Box sx={{ color: "gray" }}>Дата на продажба:</Box>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <StyledTextField
                            disabled
                            value={dayjs(vehicle.soldDate).format("DD/MM/YYYY")}
                            variant="standard"
                          />
                        </Box>
                      </ItemStacked>
                    </Grid>
                  )}
                </Grid>
              </div>

              {(userRole.includes("admin") ||
                userRole.includes(vehicle.site)) &&
              !vehicle.sold ? (
                <Box className="flex justify-end">
                  {edit ? (
                    <ButtonGroup variant="contained">
                      <Button onClick={handleSave}>
                        <Save /> ЗАПИШИ
                      </Button>
                      <Button color="warning" onClick={handleCancelEdit}>
                        <Cancel /> ОТКАЖИ
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Button variant="contained" onClick={handleEdit}>
                      <Edit /> РЕДАКТИРАНЕ
                    </Button>
                  )}
                </Box>
              ) : (
                ""
              )}
            </div>
            <ButtonGroup sx={{ marginBottom: "10px" }} fullWidth>
              <Button
                variant="contained"
                color={tab === "record" ? "secondary" : "primary"}
                onClick={() => {
                  if (tab === "record") {
                    setTab("");
                  } else {
                    setTab("record");
                  }
                }}
              >
                Движение
                <Timeline />
              </Button>
              <Button
                variant="contained"
                color={tab === "issues" ? "secondary" : "primary"}
                onClick={() => {
                  if (tab === "issues") {
                    setTab("");
                  } else {
                    setTab("issues");
                  }
                }}
              >
                {vehicle.issue ? (
                  <BlinkedBox>
                    Забележки
                    <Warning />
                  </BlinkedBox>
                ) : (
                  <Box>
                    Забележки
                    <Warning />
                  </Box>
                )}
              </Button>
              <Button
                variant="contained"
                color={tab === "serv" ? "secondary" : "primary"}
                onClick={() => {
                  if (tab === "serv") {
                    setTab("");
                  } else {
                    setTab("serv");
                  }
                }}
              >
                РАЗХОДИ
                <CarRepair />
              </Button>

              <Button
                variant="contained"
                color={tab === "ref" ? "secondary" : "primary"}
                onClick={() => {
                  if (tab === "ref") {
                    setTab("");
                  } else {
                    setTab("ref");
                  }
                }}
              >
                Справки
                <QueryStats />
              </Button>
              <Button
                variant="contained"
                color={tab === "log" ? "secondary" : "primary"}
                onClick={() => {
                  if (tab === "log") {
                    setTab("");
                  } else {
                    setTab("log");
                  }
                }}
              >
                Лог
                <History />
              </Button>
            </ButtonGroup>

            <div>
              {tab === "record" ? (
                <VehicleRecords
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                />
              ) : (
                ""
              )}
              {tab === "issues" ? (
                <Issues
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                />
              ) : (
                ""
              )}
              {tab === "serv" ? (
                <Expenses
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              ) : (
                ""
              )}

              {tab === "ref" ? (
                <Ref
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                />
              ) : (
                ""
              )}

              {tab === "log" ? <Log vehicle={vehicle} /> : ""}
            </div>

            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">
                Последна Промяна:
              </span>
              <span>
                {dayjs(vehicle.updatedAt).format("DD/MM/YYYY ddd HH:mm:ss")}
              </span>
            </div>
            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">Добавен:</span>
              <span>
                {dayjs(vehicle.createdAt).format("DD/MM/YYYY ddd HH:mm:ss")}
              </span>
            </div>

            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">ID:</span>
              <span>{vehicle._id}</span>
            </div>
            <Box>
              <ButtonGroup>
                {userRole.includes("admin") ? (
                  <Button
                    onClick={verifyDelete}
                    color="error"
                    variant="contained"
                  >
                    ИзтриЙ
                    <DeleteForever />
                  </Button>
                ) : (
                  ""
                )}
                {(userRole.includes("admin") ||
                  userRole.includes(vehicle.site)) &&
                !vehicle.sold ? (
                  <Button
                    onClick={verifySell}
                    color="warning"
                    variant="contained"
                  >
                    ПРОДАДЕН
                    <AttachMoney />
                  </Button>
                ) : (
                  ""
                )}
              </ButtonGroup>
            </Box>
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default ShowVehicle;
