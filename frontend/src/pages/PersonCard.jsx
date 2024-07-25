import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Services from "./Services";
import Ref from "../components/Ref";
import Fuels from "./Fuels";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
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

const PersonCard = () => {
  const [person, setPerson] = useState({});
  const [oldPerson, setOldPerson] = useState({});
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
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#ccc",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    display: "flex",
    fontWeight: "800",
    justifyContent: "space-between",
    color: theme.palette.text.primary,
  }));
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
      .get(`http://192.168.0.147:5555/api/person/${id}`)
      .then((res) => {
        setPerson(res.data);
        setLoading(false);
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
      .delete(`http://192.168.0.147:5555/api/person/${person._id}`)
      .then(() => {
        navigate("/hr");
      });
  };
  const handleEdit = () => {
    setOldPerson({ ...person });
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

    let diff = {};
    for (const key in oldPerson) {
      if (person[key] && oldPerson[key] != person[key]) {
        diff[key] = [oldPerson[key], person[key]];
      }
    }
    setEdit(false);

    axios
      .put(`http://192.168.0.147:5555/api/person/${person._id}`, updated)
      .then(() => {
        axios.post(`http://192.168.0.147:5555/logs`, {
          date: dayjs(),
          user: username,
          changed: diff,
          personId: person._id,
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
  //   const handleKasko = (event) => {
  //     setPerson({
  //       ...person,
  //       kasko: event.target.checked,
  //       kaskoDate: event.target.checked ? dayjs() : dayjs("01-01-2001"),
  //     });
  //   };
  //   const handleVignette = (event) => {
  //     setVehicle({
  //       ...person,
  //       vignette: event.target.checked,
  //       vignetteDate: event.target.checked ? dayjs() : dayjs("01-01-2001"),
  //     });
  //   };
  const handleChange = (e) => {
    const newPerson = { ...person };
    newPerson[e.target.id] = e.target.value;
    setPerson({ ...newPerson });
  };
  //Function to rearrange date format to match DD/MM/YYYY
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };

  return (
    <div className="p-4">
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
              {`Сигурен ли сте, че искате да изтриете служител ${
                person.firstName + " " + person.lastName
              } на длъжност ${person.job}\n `}
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
                Добави
              </Button>
            </DialogActions>
          </Dialog>
          <div className="bg-gray-400 m-auto rounded-xl flex flex-col border-2 border-gray-600 w-9/12 p-4">
            <Box
              component="img"
              sx={{
                height: 233,
                width: 350,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2"
            />
            <Box sx={{ width: "100%" }}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex" }}>
                  <Item sx={{ width: "50%" }}>
                    <span>Име:</span>
                    <span>{person.firstName}</span>
                  </Item>
                  <Item sx={{ width: "50%", marginLeft: "5px" }}>
                    <span>Телефон:</span>
                    <span>{person.phone}</span>
                  </Item>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Item sx={{ width: "50%" }}>
                    <span>Презиме:</span>
                    <span>{person.middleName}</span>
                  </Item>
                  <Item sx={{ width: "50%", marginLeft: "5px" }}>
                    <span>Телефон Близък:</span>
                    <span>{person.phoneSecond}</span>
                  </Item>
                </Box>

                <Box sx={{ display: "flex" }}>
                  <Item sx={{ width: "50%" }}>
                    <span>Фамилия:</span>
                    <span>{person.lastName}</span>
                  </Item>
                  <Item sx={{ width: "50%", marginLeft: "5px" }}>
                    <span>Email:</span>
                    <span>{person.email}</span>
                  </Item>
                </Box>

                <Item sx={{ width: "50%" }}>
                  <span>Лк №:</span>
                  <span>{person.IDNum}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>ЕГН:</span>
                  <span>{person.EGN}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Адрес по ЛК:</span>
                  <span>{person.addressOfficial}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Адрес по местопребиваване:</span>
                  <span>{person.AddressReal}</span>
                </Item>
                <Box sx={{ display: "flex" }}>
                  <Item sx={{ width: "50%" }}>
                    <span>Обект:</span>
                    <span>{person.site}</span>
                  </Item>
                  <Item sx={{ width: "50%", marginLeft: "5px" }}>
                    <span>Постъпил на:</span>
                    <span>{person.employmentDate}</span>
                  </Item>
                </Box>

                <Item sx={{ width: "50%" }}>
                  <span>Длъжност:</span>
                  <span>{person.job}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Семейно положение:</span>
                  <span>{person.marital}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Деца:</span>
                  <span>{person.children}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>ТЕЛК:</span>
                  <span>{person.telk}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Образование:</span>
                  <span>{person.education}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Диплома:</span>
                  <span>{person.diploma}</span>
                </Item>
                <Item sx={{ width: "50%" }}>
                  <span>Специалност:</span>
                  <span>{person.major}</span>
                </Item>
              </Stack>
              {userRole === "admin" || userRole === person.site ? (
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
            </Box>

            <ButtonGroup sx={{ marginBottom: "10px", width: "20%" }} fullWidth>
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

            <div>
              {tab === "log" ? (
                logLoading ? (
                  <CircularProgress />
                ) : (
                  <Log log={log} person={person} />
                )
              ) : (
                ""
              )}
            </div>

            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">
                Последна Промяна:
              </span>
              <span>
                {localDateTime(
                  new Date(person.updatedAt).toString().slice(0, 31)
                )}
              </span>
            </div>
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Добавен:</span>
              <span>
                {localDateTime(
                  new Date(person.createdAt).toString().slice(0, 31)
                )}
              </span>
            </div>

            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">ID:</span>
              <span>{person._id}</span>
            </div>
            <div>
              {userRole === "admin" || userRole === person.site ? (
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

export default PersonCard;
