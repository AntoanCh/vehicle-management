import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, ButtonGroup, MenuItem, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Services from "./Services";
import Ref from "../components/Ref";
import Fuels from "./Fuels";
import Problems from "./Problems";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import Log from "../components/Log";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import HistoryIcon from "@mui/icons-material/History";
import Fab from "@mui/material/Fab";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";

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

const ShowVehicle = () => {
  const [vehicle, setVehicle] = useState({});
  const [oldVehicle, setOldVehicle] = useState({});
  const [showLog, setShowLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("");
  const [edit, setEdit] = useState(false);
  const [services, setServices] = useState();
  const [fuels, setFuels] = useState();
  const [problems, setProblems] = useState();
  const [verDelete, setVerDelete] = useState(false);
  const [log, setLog] = useState();
  const [servLoading, setServLoading] = useState(true);
  const [fuelLoading, setFuelLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);
  const [problemLoading, setProblemLoading] = useState(true);
  const [userRole, setUserRole] = useState();
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
        axios
          .get(`http://192.168.0.147:5555/services/${res.data._id}`)
          .then((res) => {
            setServices(res.data);
            setServLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setServLoading(false);
          });
        axios
          .get(`http://192.168.0.147:5555/fuels/${res.data._id}`)
          .then((res) => {
            setFuels(res.data);
            setFuelLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setFuelLoading(false);
          });
        axios
          .get(`http://192.168.0.147:5555/problems/${res.data._id}`)
          .then((res) => {
            setProblems(res.data);
            setProblemLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setProblemLoading(false);
          });
        axios
          .get(`http://192.168.0.147:5555/logs/${res.data._id}`)
          .then((res) => {
            setLog(res.data);
            setLogLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLogLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleShowLog = () => {
    setShowLog(!showLog);
  };
  const handleClose = () => {
    setVerDelete(false);
  };
  const verifyDelete = () => {
    setVerDelete(true);
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

  const localDateTime = (dateTime) => {
    let weekday = dateTime.slice(0, 3);
    let month = dateTime.slice(4, 7);
    const date = dateTime.slice(8, 10);
    const year = dateTime.slice(11, 15);
    const time = dateTime.slice(16, 24);
    const timeZone = dateTime.slice(25, 31);
    switch (weekday) {
      case "Mon":
        weekday = "Понеделник";
        break;
      case "Tue":
        weekday = "Вторник";
        break;
      case "Wed":
        weekday = "Сряда";
        break;
      case "Thu":
        weekday = "Четвъртък";
        break;
      case "Fri":
        weekday = "Петък";
        break;
      case "Sat":
        weekday = "Събота";
        break;
      case "Sun":
        weekday = "Неделя";
        break;
    }
    switch (month) {
      case "Jan":
        month = "Януари";
        break;
      case "Feb":
        month = "Февруари";
        break;
      case "Mar":
        month = "Март";
        break;
      case "Apr":
        month = "Април";
        break;
      case "May":
        month = "Май";
        break;
      case "Jun":
        month = "Юни";
        break;
      case "Jul":
        month = "Юли";
        break;
      case "Aug":
        month = "Август";
        break;
      case "Sep":
        month = "Септември";
        break;
      case "Oct":
        month = "Октомври";
        break;
      case "Nov":
        month = "Ноември";
        break;
      case "Dev":
        month = "Декември";
        break;
    }
    return `${date} ${month} ${year} ${weekday} ${time} ${timeZone}`;
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
      .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, updated)
      .then(() => {
        axios.post(`http://192.168.0.147:5555/logs`, {
          date: dayjs(),
          user: username,
          changed: diff,
          vehicleId: vehicle._id,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        alert("Грешка, проверете конзолата");
        console.log(err);
        window.location.reload();
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
  //Function to rearrange date format to match DD/MM/YYYY
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };

  const isDue = (dueDate, type) => {
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
  };
  const handleCheck = () => {
    vehicle.checked = dayjs();
    axios
      .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, vehicle)
      .then(() => {
        axios.post(`http://192.168.0.147:5555/logs`, {
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
    <div className="p-4">
      <h1 className="text-3xl m-auto text-center my-4">
        {vehicle.type === "Truck" ? "Товарен автомобил" : "Лек Автомобил"}
      </h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Dialog
            open={verDelete}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"></DialogContentText>
              {`Сигурен ли сте, че искате да изтриете автомобил ${
                vehicle.make + " " + vehicle.model
              } с Номер ${
                vehicle.reg
              }\n Всички данни за автомобила, включително сервизната история ще бъдат премахнати завинаги`}
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
          <div className="bg-gray-400 m-auto rounded-xl flex flex-col border-2 border-gray-600 w-full 2xl:w-9/12 p-4">
            <Box sx={{ display: { sm: "flex", xs: "" } }}>
              <div>
                <Stack spacing={2}>
                  <Box>
                    <div className="w-fit input-box" style={{ width: "100%" }}>
                      <input
                        className="registration-ui"
                        autoComplete="off"
                        type="text"
                        name="numberPlate"
                        value={vehicle.reg}
                        disabled
                      />
                      <span className="unit">BG</span>
                    </div>
                  </Box>
                  <ItemInline
                    sx={{
                      width: "90%",
                      backgroundColor: "rgb(156 163 175)",
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
                          WebkitTextFillColor: "black", //Adjust text color here
                        },
                      }}
                    />
                  </ItemInline>
                  <ItemInline
                    sx={{
                      width: "70%",
                      textAlign: "center",
                      backgroundColor: "rgb(50, 50, 50)",
                      color: "white",
                    }}
                  >
                    <TextField
                      value={vehicle.km}
                      disabled={!edit}
                      id="km"
                      name="km"
                      onChange={handleChange}
                      variant="standard"
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 18,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "center",
                          color: "white",
                        },
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "white", //Adjust text color here
                        },
                      }}
                    />
                    <span>KM</span>
                  </ItemInline>
                </Stack>
                {/* <div className="my-4 flex justify-between">
                  <span className="text-3xl mr-4 text-gray-600">
                    {`${vehicle.make} ${vehicle.model}`}
                  </span>
                </div> */}

                {/* <div className="flex w-fit text-xl text-center">
                  <input
                    id="km"
                    style={{
                      borderRadius: "5px",
                      backgroundColor: "rgb(50, 50, 50)",
                      color: "white",
                      textAlign: "center",
                      width: "50%",
                    }}
                    value={vehicle.km}
                    onChange={handleChange}
                    disabled={!edit}
                  />
                  <span className=" text-3xl mr-4 text-black-500"> КМ</span>
                </div> */}
              </div>

              <Grid container spacing={2}>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Година:</Box>
                    <Box>
                      <TextField
                        value={vehicle.year}
                        disabled
                        name="km"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Гориво:</Box>
                    <Box>
                      {" "}
                      <TextField
                        value={vehicle.fuel}
                        disabled
                        name="fuel"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>№ ДВГ</Box>
                    <Box>
                      {" "}
                      <TextField
                        value={vehicle.engNum}
                        disabled={!edit}
                        name="engNum"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Гуми Размер</Box>
                    <Box>
                      {" "}
                      <TextField
                        value={vehicle.tires}
                        disabled={!edit}
                        name="tires"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Отговорник:</Box>
                    <Box>
                      {" "}
                      <TextField
                        fullWidth
                        value={vehicle.site}
                        disabled={!edit}
                        select={edit}
                        SelectProps={{ sx: { height: "25px" } }}
                        name="site"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      >
                        <MenuItem key={1} value={"ОФИС"}>
                          ОФИС
                        </MenuItem>
                        <MenuItem key={2} value={"СКЛАД"}>
                          СКЛАД
                        </MenuItem>
                      </TextField>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>№ Талон</Box>
                    <Box>
                      {" "}
                      <TextField
                        value={vehicle.talonNum}
                        disabled
                        name="talonNum"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>№ Рама</Box>
                    <Box>
                      {" "}
                      <TextField
                        value={vehicle.bodyNum}
                        disabled
                        name="bodyNum"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={3} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Собственик</Box>
                    <Box>
                      {" "}
                      <TextField
                        fullWidth
                        value={vehicle.owner}
                        disabled={!edit}
                        select={edit}
                        SelectProps={{ sx: { height: "25px" } }}
                        name="owner"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
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
                      </TextField>
                    </Box>
                  </ItemStacked>
                </Grid>
              </Grid>

              {/* <div>
                <div className="my-4 flex">
                  <div className="w-40">
                    <span className="text-xl mr-2 text-gray-500">Година:</span>

                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.year}
                    />
                  </div>

                  <div className="w-40">
                    <span className="text-xl ml-4 mr-2 text-gray-500">
                      Гориво:
                    </span>

                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.fuel}
                    />
                  </div>
                  <div className="w-56">
                    {" "}
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      № ДВГ:
                    </span>
                    {edit ? (
                      <input
                        className="bg-gray-400"
                        type="text"
                        style={{
                          borderRadius: "5px",
                          textAlign: "center",
                          maxWidth: "190px",
                          backgroundColor: "rgb(100, 100, 100)",
                          color: "white",
                        }}
                        value={vehicle.engNum}
                        id="engNum"
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        disabled
                        className="bg-gray-400"
                        type="text"
                        style={{
                          borderRadius: "5px",
                          textAlign: "center",
                          maxWidth: "190px",
                        }}
                        value={vehicle.engNum}
                      />
                    )}
                  </div>

                  <div>
                    <span className="text-xl ml-4 mr-2 text-gray-500">
                      Гуми Размер:
                    </span>
                    {edit ? (
                      <input
                        className="w-fit"
                        style={{
                          borderRadius: "5px",
                          backgroundColor: "rgb(100,100,100)",
                          color: "white",
                          textAlign: "center",
                          maxWidth: "100px",
                        }}
                        value={vehicle.tires}
                        id="tires"
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        disabled
                        className="bg-gray-400"
                        type="text"
                        style={{
                          borderRadius: "5px",
                          textAlign: "center",
                          maxWidth: "100px",
                        }}
                        value={vehicle.tires}
                      />
                    )}
                  </div>
                </div>
                <div className="my-4 flex justify-end">
                  <div className="w-40">
                    <span className="text-xl ml-4 mr-2 text-gray-500">
                      Отговорник:
                    </span>

                    {edit ? (
                      <select
                        style={{
                          borderRadius: "5px",
                          backgroundColor: "rgb(100,100,100)",
                          color: "white",
                          textAlign: "center",
                          width: "100px",
                          height: "35px",
                        }}
                        name="site"
                        value={vehicle.site}
                        id="site"
                        onChange={handleChange}
                      >
                        <option value="office">ОФИС</option>
                        <option value="warehouse">СКЛАД</option>
                      </select>
                    ) : (
                      <input
                        disabled
                        className="bg-gray-400"
                        type="text"
                        style={{
                          borderRadius: "5px",
                          textAlign: "center",
                          maxWidth: "100px",
                        }}
                        value={vehicle.site === "office" ? "ОФИС" : "СКЛАД"}
                      />
                    )}
                  </div>
                  <div className="w-40">
                    <span className="text-xl ml-4 mr-2 text-gray-500">
                      Талон №:
                    </span>
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.talonNum}
                    />
                  </div>
                  <div className="w-56">
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      № Рама:
                    </span>
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "190px",
                      }}
                      value={vehicle.bodyNum}
                    />
                  </div>
                  <div>
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      Собственик:
                    </span>
                    {edit ? (
                      <div>
                        <select
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "rgb(100,100,100)",
                            color: "white",
                            textAlign: "center",
                            width: "160px",
                            height: "35px",
                          }}
                          name="owner"
                          value={vehicle.owner}
                          id="owner"
                          onChange={handleChange}
                        >
                          <option value="НИКОН-НК">НИКОН-НК</option>
                          <option value="ЕКСПРЕС-ГАРАНТ">ЕКСПРЕС-ГАРАНТ</option>
                          <option value="НИКОЛАЙ КЪНЧЕВ">НИКОЛАЙ КЪНЧЕВ</option>
                        </select>
                      </div>
                    ) : (
                      <input
                        disabled
                        className="bg-gray-400"
                        type="text"
                        style={{
                          borderRadius: "5px",
                          textAlign: "center",
                          maxWidth: "160px",
                        }}
                        value={vehicle.owner}
                      />
                    )}
                  </div>
                </div>
              </div> */}
            </Box>

            <div className="flex justify-end">
              {userRole === "admin" || userRole === vehicle.site ? (
                <Fab
                  variant="extended"
                  onClick={handleCheck}
                  color="primary"
                  aria-label="add"
                >
                  <DoneAllIcon />
                  ПРОВЕРЕН
                </Fab>
              ) : (
                ""
              )}
            </div>
            <div className="my-4">
              <Grid container spacing={2} columns={48}>
                <Grid item sm={9} xs={48}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Масла/ф-ри:</Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        value={vehicle.oil}
                        disabled={!edit}
                        name="oil"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
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
                    <Box sx={{ color: "gray" }}>
                      Преди:
                      {isDue(vehicle.km - vehicle.oil, "oil") ? (
                        <WarningAmberIcon />
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <TextField
                        value={vehicle.km - vehicle.oil}
                        disabled
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
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
                    <Box sx={{ color: "gray" }}>
                      Остават:{" "}
                      {isDue(vehicle.km - vehicle.oil, "oil") ? (
                        <WarningAmberIcon />
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <TextField
                        value={vehicle.oilChange - (vehicle.km - vehicle.oil)}
                        disabled
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
                      />
                      <span>KM</span>
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item sm={9} xs={48}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Интервал</Box>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      {" "}
                      <TextField
                        value={vehicle.oilChange}
                        disabled={!edit}
                        name="oilChange"
                        onChange={handleChange}
                        variant="standard"
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 18,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "center",
                          },
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "black", //Adjust text color here
                          },
                        }}
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
                          ? { color: "#950e0e" }
                          : isDue(vehicle.checked, "checked") === "caution"
                          ? { color: "#95660e" }
                          : { color: "gray" }
                      }
                    >
                      Проверен на:
                      {isDue(vehicle.checked, "checked") ? (
                        <WarningAmberIcon />
                      ) : (
                        ""
                      )}
                    </Box>
                    <Box>
                      {" "}
                      <DemoContainer components={["DatePicker, DatePicker"]}>
                        <DatePicker
                          slotProps={{
                            textField: {
                              width: "20%",
                              size: "small",
                              padding: "0px",
                              margin: "0px",
                              variant: "standard",
                            },
                            inputAdornment: {
                              padding: "0px",
                              margin: "0px",
                            },
                          }}
                          sx={{
                            "& .MuiInputBase-input": {
                              padding: "0px",
                              margin: "0px",
                              width: "70%",
                              height: "15px",
                              fontWeight: 800,
                            },
                            "& .MuiInputBase-root": {
                              padding: 0,
                              margin: 0,

                              "& .MuiButtonBase-root": {
                                padding: 0,
                                margin: 0,
                              },
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "black", //Adjust text color here
                              },
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
              </Grid>
              {/* <div className="my-4 flex justify-end my-2 border-t border-gray-500">
                <div className="w-40">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Масла/ф-ри:
                  </span>
                  {edit ? (
                    <input
                      // className="w-fit"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.oil}
                      id="oil"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={`${vehicle.oil} km`}
                    />
                  )}
                </div>
                <div className="w-40">
                  <span
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl mr-2 ml-4"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl mr-2 ml-4"
                        : "text-xl mr-2 ml-4  text-gray-500"
                    }
                  >
                    Преди:{" "}
                    {isDue(vehicle.km - vehicle.oil, "oil") ? (
                      <WarningAmberIcon />
                    ) : (
                      ""
                    )}
                  </span>

                  <input
                    disabled
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl bg-gray-400"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl bg-gray-400"
                        : "text-xl  bg-gray-400"
                    }
                    type="text"
                    style={{
                      borderRadius: "5px",
                      textAlign: "center",
                      maxWidth: "100px",
                    }}
                    value={`${vehicle.km - vehicle.oil} km`}
                  />
                </div>
                <div className="w-40">
                  <span
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl"
                        : "text-xl  bg-gray-400  text-gray-500"
                    }
                  >
                    Остават:{" "}
                    {isDue(vehicle.km - vehicle.oil, "oil") ? (
                      <WarningAmberIcon />
                    ) : (
                      ""
                    )}
                  </span>

                  <input
                    disabled
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl bg-gray-400"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl bg-gray-400"
                        : "text-xl  bg-gray-400"
                    }
                    type="text"
                    style={{
                      borderRadius: "5px",
                      textAlign: "center",
                      maxWidth: "110px",
                    }}
                    value={`${
                      vehicle.oilChange - (vehicle.km - vehicle.oil)
                    } km`}
                  />
                </div>
                <div className="w-40">
                  <span className={"text-xl bg-gray-400  text-gray-500"}>
                    Интервал:{" "}
                  </span>

                  {edit ? (
                    <input
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.oilChange}
                      id="oilChange"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.oilChange}
                    />
                  )}
                </div>
                <div className="w-40">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Проверен на:
                    {isDue(vehicle.checked, "checked") ? (
                      <WarningAmberIcon />
                    ) : (
                      ""
                    )}
                  </span>
                  {edit ? (
                    <input
                      type="date"
                      className="w-fit"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                      }}
                      value={
                        vehicle.checked ? vehicle.checked.slice(0, 10) : ""
                      }
                      id="checked"
                      onChange={handleChange}
                    />
                  ) : (
                    <>
                      <input
                        disabled
                        className={
                          isDue(vehicle.checked, "checked") === "warning"
                            ? "text-red-600 text-xl bg-gray-400 w-fit"
                            : isDue(vehicle.checked, "checked") === "caution"
                            ? "text-yellow-500 text-xl bg-gray-400 w-fit"
                            : "text-xl bg-gray-400 w-fit"
                        }
                        type="text"
                        style={{
                          borderRadius: "5px",
                          textAlign: "center",
                          maxWidth: "120px",
                        }}
                        value={`${
                          vehicle.checked
                            ? bgDate(vehicle.checked.slice(0, 10))
                            : "N/A"
                        } km`}
                      />
                    </>
                  )}
                </div>
              </div> */}
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
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                        {edit ? (
                          <Checkbox
                            sx={{
                              margin: "0",
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
                          <TextField
                            disabled
                            value={"НЯМА"}
                            variant="standard"
                            sx={{
                              "& .MuiInputBase-input": {
                                fontSize: 18,
                                height: 4,
                                padding: 1,
                                fontWeight: 800,
                                textAlign: "center",
                              },
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "black", //Adjust text color here
                              },
                            }}
                          />
                        ) : (
                          <DemoContainer
                            components={["DatePicker, DatePicker"]}
                          >
                            <DatePicker
                              slotProps={{
                                textField: {
                                  width: "20%",
                                  size: "small",
                                  padding: "0px",
                                  margin: "0px",
                                  variant: "standard",
                                },
                                inputAdornment: {
                                  padding: "0px",
                                  margin: "0px",
                                },
                              }}
                              sx={{
                                "& .MuiInputBase-input": {
                                  padding: "0px",
                                  margin: "0px",
                                  width: "70%",
                                  height: "15px",
                                  fontWeight: 800,
                                },
                                "& .MuiInputBase-root": {
                                  padding: 0,
                                  margin: 0,

                                  "& .MuiButtonBase-root": {
                                    padding: 0,
                                    margin: 0,
                                  },
                                  "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "black", //Adjust text color here
                                  },
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
                        <TextField
                          fullWidth
                          value={vehicle.tax}
                          disabled={!edit}
                          select={edit}
                          SelectProps={{ sx: { height: "25px" } }}
                          name="tax"
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 18,
                              height: 4,
                              padding: 1,
                              fontWeight: 800,
                              textAlign: "center",
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "black", //Adjust text color here
                            },
                          }}
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
                        </TextField>
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
                        {isDue(vehicle.gtp, "date") ? <WarningAmberIcon /> : ""}
                      </Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <DatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0px",
                                margin: "0px",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0px",
                                margin: "0px",
                              },
                            }}
                            sx={{
                              "& .MuiInputBase-input": {
                                padding: "0px",
                                margin: "0px",
                                width: "70%",
                                height: "15px",
                                fontWeight: 800,
                              },
                              "& .MuiInputBase-root": {
                                padding: 0,
                                margin: 0,

                                "& .MuiButtonBase-root": {
                                  padding: 0,
                                  margin: 0,
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "black", //Adjust text color here
                                },
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
                        <TextField
                          fullWidth
                          value={vehicle.cat}
                          disabled={!edit}
                          select={edit}
                          SelectProps={{ sx: { height: "25px" } }}
                          name="cat"
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 18,
                              height: 4,
                              padding: 1,
                              fontWeight: 800,
                              textAlign: "center",
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "black", //Adjust text color here
                            },
                          }}
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
                        </TextField>
                      </Box>
                    </ItemStacked>
                  </Grid>
                </Grid>
                {/* <div className="w-56">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Винетка до:
                  </span>
                  {edit ? (
                    <Checkbox
                      checked={vehicle.vignette}
                      onChange={handleVignette}
                    />
                  ) : (
                    ""
                  )}
                  {edit ? (
                    <input
                      disabled={!vehicle.vignette}
                      className="bg-gray-400"
                      type="date"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: vehicle.vignette
                          ? "rgb(100,100,100)"
                          : "rgb(156 163 175)",
                        color: vehicle.vignette ? "white" : "black",
                        textAlign: "center",
                        width: "150px",
                      }}
                      value={
                        vehicle.vignetteDate
                        // vehicle.vignetteDate
                        //   ? bgDate(vehicle.vignetteDate.slice(0, 10))
                        //   : ""
                      }
                    />
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",

                        textAlign: "center",
                        width: "150px",
                      }}
                      // value={
                      //   vehicle.vignetteDate
                      //     ? !vehicle.vignette
                      //       ? "НЯМА"
                      //       : bgDate(vehicle.vignetteDate.slice(0, 10))
                      //     : "N/A"
                      // }
                    />
                  )}
                </div>
                <div className="w-40">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Данък за:
                  </span>
                  {edit ? (
                    <select
                      id="tax"
                      onChange={handleChange}
                      value={vehicle.tax}
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                        width: "100px",
                        height: "35px",
                      }}
                    >
                      <option value={dayjs().year() - 1}>
                        {dayjs().year() - 1}
                      </option>
                      <option value={dayjs().year()}>{dayjs().year()}</option>
                      <option value={dayjs().year() + 1}>
                        {dayjs().year() + 1}
                      </option>
                    </select>
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.tax + " г."}
                    />
                  )}
                </div>
                <div className="w-40">
                  <span
                    className={
                      isDue(vehicle.gtp, "date") === "warning"
                        ? "text-red-600 text-xl "
                        : isDue(vehicle.gtp, "date") === "caution"
                        ? "text-yellow-500 text-xl"
                        : "text-xl mr-2 ml-2"
                    }
                  >
                    ГТП до:
                    {isDue(vehicle.gtp, "date") ? <WarningAmberIcon /> : ""}
                  </span>
                  {edit ? (
                    <input
                      type="date"
                      className="w-fit w-22"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                      }}
                      value={vehicle.gtp.slice(0, 10)}
                      id="gtp"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className={
                        isDue(vehicle.gtp, "date") === "warning"
                          ? "text-red-600 text-xl bg-gray-400"
                          : isDue(vehicle.gtp, "date") === "caution"
                          ? "text-yellow-500 text-xl bg-gray-400"
                          : "text-xl bg-gray-400"
                      }
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "120px",
                      }}
                      value={
                        vehicle.gtp ? bgDate(vehicle.gtp.slice(0, 10)) : ""
                      }
                    />
                  )}
                </div>
                <div className="w-40">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    ЕКО Група:
                  </span>
                  {edit ? (
                    <select
                      id="cat"
                      onChange={handleChange}
                      value={vehicle.cat}
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                        width: "100px",
                        height: "35px",
                      }}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "100px",
                      }}
                      value={vehicle.cat}
                    />
                  )}
                </div> */}
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
                        {isDue(vehicle.insDate, "date") ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                      </Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <DatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0px",
                                margin: "0px",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0px",
                                margin: "0px",
                              },
                            }}
                            sx={{
                              "& .MuiInputBase-input": {
                                padding: "0px",
                                margin: "0px",
                                width: "70%",
                                height: "15px",
                                fontWeight: 800,
                              },
                              "& .MuiInputBase-root": {
                                padding: 0,
                                margin: 0,

                                "& .MuiButtonBase-root": {
                                  padding: 0,
                                  margin: 0,
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "black", //Adjust text color here
                                },
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
                        <TextField
                          value={vehicle.insNum}
                          disabled={!edit}
                          name="insNum"
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 18,
                              height: 4,
                              padding: 1,
                              fontWeight: 800,
                              textAlign: "center",
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "black", //Adjust text color here
                            },
                          }}
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
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                        {edit ? (
                          <Checkbox
                            sx={{
                              margin: "0",
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
                          <TextField
                            disabled
                            value={"НЯМА"}
                            variant="standard"
                            sx={{
                              "& .MuiInputBase-input": {
                                fontSize: 18,
                                height: 4,
                                padding: 1,
                                fontWeight: 800,
                                textAlign: "center",
                              },
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "black", //Adjust text color here
                              },
                            }}
                          />
                        ) : (
                          <DemoContainer
                            components={["DatePicker, DatePicker"]}
                          >
                            <DatePicker
                              slotProps={{
                                textField: {
                                  width: "20%",
                                  size: "small",
                                  padding: "0px",
                                  margin: "0px",
                                  variant: "standard",
                                },
                                inputAdornment: {
                                  padding: "0px",
                                  margin: "0px",
                                },
                              }}
                              sx={{
                                "& .MuiInputBase-input": {
                                  padding: "0px",
                                  margin: "0px",
                                  width: "70%",
                                  height: "15px",
                                  fontWeight: 800,
                                },
                                "& .MuiInputBase-root": {
                                  padding: 0,
                                  margin: 0,

                                  "& .MuiButtonBase-root": {
                                    padding: 0,
                                    margin: 0,
                                  },
                                  "& .MuiInputBase-input.Mui-disabled": {
                                    WebkitTextFillColor: "black", //Adjust text color here
                                  },
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
                      <Box sx={{ color: "gray" }}>Каско № Полица</Box>
                      <Box>
                        <TextField
                          value={!vehicle.kasko ? "НЯМА" : vehicle.kaskoNum}
                          disabled={
                            !edit ? true : !vehicle.kasko ? true : false
                          }
                          name="kaskoNum"
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 18,
                              height: 4,
                              padding: 1,
                              fontWeight: 800,
                              textAlign: "center",
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "black", //Adjust text color here
                            },
                          }}
                        />
                      </Box>
                    </ItemStacked>
                  </Grid>
                </Grid>
                {/* <div className="w-56">
                  <span
                    className={
                      isDue(vehicle.insDate, "date") === "warning"
                        ? "text-red-600 text-xl mr-2 ml-4"
                        : isDue(vehicle.insDate, "date") === "caution"
                        ? "text-yellow-500 text-xl mr-2 ml-4"
                        : "text-xl mr-2 ml-4"
                    }
                  >
                    ГО до:
                    {isDue(vehicle.insDate, "date") ? <WarningAmberIcon /> : ""}
                  </span>
                  {edit ? (
                    <input
                      type="date"
                      className="w-fit"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                      }}
                      value={vehicle.insDate.slice(0, 10)}
                      id="insDate"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className={
                        isDue(vehicle.insDate, "date") === "warning"
                          ? "text-red-600 text-xl bg-gray-400"
                          : isDue(vehicle.insDate, "date") === "caution"
                          ? "text-yellow-500 text-xl bg-gray-400"
                          : "text-xl bg-gray-400"
                      }
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "120px",
                      }}
                      value={
                        vehicle.insDate
                          ? bgDate(vehicle.insDate.slice(0, 10))
                          : "N/A"
                      }
                    />
                  )}
                </div>
                <div className="w-56">
                  <span
                    className={
                      isDue(vehicle.kaskoDate, "date") === "warning" &&
                      vehicle.kasko
                        ? "text-red-600 text-xl mr-2 ml-4"
                        : isDue(vehicle.kaskoDate, "date") === "caution" &&
                          vehicle.kasko
                        ? "text-yellow-500 text-xl mr-2 ml-4"
                        : "text-xl mr-2 ml-4 text-gray-500"
                    }
                  >
                    Каско до:
                    {isDue(vehicle.kaskoDate, "date") && vehicle.kasko ? (
                      <WarningAmberIcon />
                    ) : (
                      ""
                    )}
                    {edit ? (
                      <Checkbox
                        checked={vehicle.kasko}
                        onChange={handleKasko}
                      />
                    ) : (
                      ""
                    )}
                  </span>
                  {edit ? (
                    <input
                      disabled={!vehicle.kasko}
                      type="date"
                      className="w-fit"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: vehicle.kasko
                          ? "rgb(100,100,100)"
                          : "rgb(156 163 175)",
                        color: vehicle.kasko ? "white" : "black",
                        textAlign: "center",
                      }}
                      value={
                        vehicle.kaskoDate
                        // vehicle.kaskoDate
                        //   ? bgDate(vehicle.kaskoDate.slice(0, 10)) ==
                        //       "31.12.2000" ||
                        //     bgDate(vehicle.kaskoDate.slice(0, 10)) ==
                        //       "01.01.2001"
                        //     ? ""
                        //     : bgDate(vehicle.kaskoDate.slice(0, 10))
                        //   : ""
                      }
                      id="kaskoDate"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className={
                        isDue(vehicle.kaskoDate, "date") === "warning" &&
                        vehicle.kasko
                          ? "text-red-600 text-xl bg-gray-400"
                          : isDue(vehicle.kaskoDate, "date") === "caution" &&
                            vehicle.kasko
                          ? "text-yellow-500 text-xl bg-gray-400"
                          : "text-xl bg-gray-400"
                      }
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "120px",
                      }}
                      value={
                        vehicle.kaskoDate
                          ? !vehicle.kasko
                            ? "НЯМА"
                            : bgDate(vehicle.kaskoDate.slice(0, 10))
                          : "N/A"
                      }
                    />
                  )}
                </div> */}
              </div>
              <div className="my-4 flex justify-end my-2">
                {/* <div className="w-56">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    ГО № Полица:
                  </span>
                  {edit ? (
                    <input
                      className="w-fit"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: "rgb(100,100,100)",
                        color: "white",
                        textAlign: "center",
                      }}
                      value={vehicle.insNum}
                      id="insNum"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "180px",
                      }}
                      value={vehicle.insNum}
                    />
                  )}
                </div>

                <div className="w-56">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Каско Полица:
                  </span>
                  {edit ? (
                    <input
                      disabled={!vehicle.kasko}
                      className="w-fit"
                      style={{
                        borderRadius: "5px",
                        backgroundColor: vehicle.kasko
                          ? "rgb(100,100,100)"
                          : "rgb(156 163 175)",
                        color: "white",
                        textAlign: "center",
                      }}
                      value={vehicle.kaskoNum}
                      id="kaskoNum"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "180px",
                      }}
                      value={vehicle.kaskoNum ? vehicle.kaskoNum : "N/A"}
                    />
                  )}
                </div> */}
              </div>
              <div className="my-4 pt-2 flex justify-end my-2 border-t border-gray-500">
                <Grid container spacing={2}>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box>Дата на покупка:</Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <DatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0px",
                                margin: "0px",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0px",
                                margin: "0px",
                              },
                            }}
                            sx={{
                              "& .MuiInputBase-input": {
                                padding: "0px",
                                margin: "0px",
                                width: "70%",
                                height: "15px",
                                fontWeight: 800,
                              },
                              "& .MuiInputBase-root": {
                                padding: 0,
                                margin: 0,

                                "& .MuiButtonBase-root": {
                                  padding: 0,
                                  margin: 0,
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "black", //Adjust text color here
                                },
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
                      <Box>Първи ремонт:</Box>
                      <Box>
                        {" "}
                        <DemoContainer components={["DatePicker, DatePicker"]}>
                          <DatePicker
                            slotProps={{
                              textField: {
                                width: "20%",
                                size: "small",
                                padding: "0px",
                                margin: "0px",
                                variant: "standard",
                              },
                              inputAdornment: {
                                padding: "0px",
                                margin: "0px",
                              },
                            }}
                            sx={{
                              "& .MuiInputBase-input": {
                                padding: "0px",
                                margin: "0px",
                                width: "70%",
                                height: "15px",
                                fontWeight: 800,
                              },
                              "& .MuiInputBase-root": {
                                padding: 0,
                                margin: 0,

                                "& .MuiButtonBase-root": {
                                  padding: 0,
                                  margin: 0,
                                },
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor: "black", //Adjust text color here
                                },
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
                        <TextField
                          value={
                            vehicle.startKm
                              ? vehicle.startKm
                              : !edit
                              ? "НЯМА ДАННИ"
                              : ""
                          }
                          disabled={!edit}
                          name="startKm"
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 18,
                              height: 4,
                              padding: 1,
                              fontWeight: 800,
                              textAlign: "center",
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "black", //Adjust text color here
                            },
                          }}
                        />
                        <span>KM</span>
                      </Box>
                    </ItemStacked>
                  </Grid>
                  <Grid item sm={3} xs={12}>
                    <ItemStacked>
                      <Box sx={{ color: "gray" }}>Цена на покупка:</Box>
                      <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  kg
                                </InputAdornment>
                              ),
                            },
                          }}
                          value={
                            vehicle.price
                              ? vehicle.price
                              : !edit
                              ? "НЯМА ДАННИ"
                              : ""
                          }
                          disabled={!edit}
                          name="price"
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            "& .MuiInputBase-input": {
                              fontSize: 18,
                              height: 4,
                              padding: 1,
                              fontWeight: 800,
                              textAlign: "center",
                            },
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: "black", //Adjust text color here
                            },
                          }}
                        />
                        <span>ЛВ</span>
                      </Box>
                    </ItemStacked>
                  </Grid>
                </Grid>
                {/* <div className="w-56">
                  {" "}
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Дата на покупка:
                  </span>
                  <input
                    disabled
                    className="bg-gray-400"
                    type="text"
                    style={{
                      borderRadius: "5px",
                      textAlign: "center",
                      maxWidth: "180px",
                    }}
                    value={
                      vehicle.purchaseDate
                        ? bgDate(vehicle.purchaseDate.slice(0, 10))
                        : "Няма данни"
                    }
                  />
                </div>
                <div className="w-56">
                  {" "}
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Първи ремонт:
                  </span>
                  <input
                    disabled
                    className="bg-gray-400"
                    type="text"
                    style={{
                      borderRadius: "5px",
                      textAlign: "center",
                      maxWidth: "180px",
                    }}
                    value={
                      vehicle.startDate
                        ? bgDate(vehicle.startDate.slice(0, 10))
                        : "Няма данни"
                    }
                  />
                </div>
                <div className="w-56">
                  {" "}
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Начални километри:
                  </span>
                  <input
                    disabled
                    className="bg-gray-400"
                    type="text"
                    style={{
                      borderRadius: "5px",
                      textAlign: "center",
                      maxWidth: "180px",
                    }}
                    value={
                      vehicle.startKm ? vehicle.startKm + " km" : "Няма данни"
                    }
                  />
                </div>
                <div className="w-56">
                  {" "}
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Цена покупка:
                  </span>
                  {edit ? (
                    <input
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "180px",
                        backgroundColor: "rgb(100, 100, 100)",
                        color: "white",
                      }}
                      value={vehicle.price}
                      id="price"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className="bg-gray-400"
                      type="text"
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "180px",
                      }}
                      value={
                        vehicle.price ? `${vehicle.price} лв` : "Няма данни"
                      }
                    />
                  )}
                </div> */}
              </div>

              {userRole === "admin" || userRole === vehicle.site ? (
                <div className="flex justify-end">
                  {edit ? (
                    <ButtonGroup variant="contained">
                      <Button onClick={handleSave}>
                        <SaveIcon /> ЗАПИШИ
                      </Button>
                      <Button color="warning" onClick={handleCancelEdit}>
                        <CancelIcon /> ОТКАЖИ
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <Button variant="contained" onClick={handleEdit}>
                      <EditIcon /> РЕДАКТИРАНЕ
                    </Button>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <ButtonGroup sx={{ marginBottom: "10px" }} fullWidth>
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
                Сервизна История
                <CarRepairIcon />
              </Button>
              <Button
                variant="contained"
                color={tab === "fuel" ? "secondary" : "primary"}
                onClick={() => {
                  if (tab === "fuel") {
                    setTab("");
                  } else {
                    setTab("fuel");
                  }
                }}
              >
                Гориво
                <LocalGasStationIcon />
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
                <QueryStatsIcon />
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
                <HistoryIcon />
              </Button>
            </ButtonGroup>
            {/* <div>
              {problemLoading ? (
                <CircularProgress />
              ) : (
                <Problems vehicle={vehicle} problems={problems} />
              )}
            </div> */}
            {/* <div>
              {fuelLoading ? (
                <CircularProgress />
              ) : (
                <Fuels vehicle={vehicle} fuels={fuels} />
              )}
            </div> */}
            <div>
              {tab === "serv" ? (
                servLoading ? (
                  <CircularProgress />
                ) : (
                  <Services
                    username={username}
                    userRole={userRole}
                    vehicle={vehicle}
                    fuels={fuels}
                    services={services}
                  />
                )
              ) : (
                ""
              )}
              {tab === "fuel" ? (
                <Fuels
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                  fuels={fuels}
                />
              ) : (
                ""
              )}
              {tab === "ref" ? (
                <Ref
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                  fuels={fuels}
                  services={services}
                />
              ) : (
                ""
              )}
              {/* <Button
                onClick={handleShowLog}
                fullWidth
                variant="contained"
                style={{}}
              >
                {showLog ? "СКРИИ ЛОГ" : "ПОКАЖИ ЛОГ"}
              </Button> */}
              {tab === "log" ? (
                logLoading ? (
                  <CircularProgress />
                ) : (
                  <Log log={log} vehicle={vehicle} />
                )
              ) : (
                ""
              )}
            </div>

            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">
                Последна Промяна:
              </span>
              <span>
                {localDateTime(
                  new Date(vehicle.updatedAt).toString().slice(0, 31)
                )}
              </span>
            </div>
            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">Добавен:</span>
              <span>
                {localDateTime(
                  new Date(vehicle.createdAt).toString().slice(0, 31)
                )}
              </span>
            </div>

            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">ID:</span>
              <span>{vehicle._id}</span>
            </div>
            <div>
              {userRole === "admin" || userRole === vehicle.site ? (
                <Button
                  onClick={verifyDelete}
                  color="error"
                  variant="contained"
                >
                  ИзтриЙ
                  <DeleteForeverIcon />
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </LocalizationProvider>
      )}
    </div>
  );
};

export default ShowVehicle;
