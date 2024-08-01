import React, { useCallback } from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
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
import PrintIcon from "@mui/icons-material/Print";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import HistoryIcon from "@mui/icons-material/History";
import Fab from "@mui/material/Fab";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import TextField from "@mui/material/TextField";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useReactToPrint } from "react-to-print";

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
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const PersonCard = () => {
  const [person, setPerson] = useState({});
  const [sites, setSites] = useState([]);
  const [oldPerson, setOldPerson] = useState({});
  const [showLog, setShowLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFeedback, setImageFeedback] = useState(false);
  const [edit, setEdit] = useState(false);
  const [services, setServices] = useState();
  const [sitesList, setSitesList] = useState();
  const [problems, setProblems] = useState();
  const [verDelete, setVerDelete] = useState(false);
  const [log, setLog] = useState();
  const [servLoading, setServLoading] = useState(true);
  const [fuelLoading, setFuelLoading] = useState(true);
  const [logLoading, setLogLoading] = useState(true);
  const [problemLoading, setProblemLoading] = useState(true);
  const [userRole, setUserRole] = useState();
  const [username, setUsername] = useState();
  const [firstNameError, setFirstNameError] = useState(false);
  const [middleNameError, setMiddleNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [jobError, setJobError] = useState(false);
  const [employmentDateError, setEmploymentDateError] = useState(false);
  const [EGNError, setEGNError] = useState(false);
  const [error, setError] = useState([false, ""]);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
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
        axios
          .get("http://192.168.0.147:5555/api/sites")
          .then((res) => {
            setSites(res.data.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
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
  const handleCloseDel = () => {
    setVerDelete(false);
  };
  const handleClose = () => {
    setError([false, ""]);
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
  const handleSave = (e) => {
    if (firstNameError || middleNameError || lastNameError) {
      e.preventDefault();
      setLoading(false);

      setError([
        true,
        "Има неправилно въведени данни. Проверете за червени полета и поправете грешките",
      ]);
    } else if (
      !person.firstName ||
      !person.middleName ||
      !person.lastName ||
      !person.EGN ||
      !person.job ||
      !person.employmentDate
    ) {
      e.preventDefault();
      setLoading(false);
      if (!person.firstName) {
        setFirstNameError(true);
      }
      if (!person.middleName) {
        setMiddleNameError(true);
      }
      if (!person.lastName) {
        setLastNameError(true);
      }
      if (!person.job) {
        setJobError(true);
      }
      if (!person.employmentDate) {
        setEmploymentDateError(true);
      }

      if (!person.EGN) {
        setEGNError(true);
      }
      setError([
        true,
        "Има невъведени данни. Въведете всички задължителни данни, отбелязани със ' * '",
      ]);
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("firstName", person.firstName);
      formData.append("middleName", person.middleName);
      formData.append("lastName", person.lastName);
      formData.append("EGN", person.EGN);
      formData.append("job", person.job);
      formData.append("employmentDate", person.employmentDate);
      formData.append("addressOfficial", person.addressOfficial);
      formData.append("addressReal", person.addressReal);
      formData.append("marital", person.marital);
      formData.append("telk", person.telk);
      formData.append("education", person.education);
      formData.append("major", person.major);
      formData.append("email", person.email);
      formData.append("phone", person.phone);
      formData.append("phoneSecond", person.phoneSecond);
      formData.append("children", person.children);
      formData.append("photo", person.photo);
      formData.append("site", person.site);
      formData.append("siteId", person.siteId);

      axios
        .put(`http://192.168.0.147:5555/api/person/${person._id}`, formData)
        .then(() => {
          // axios.post(`http://192.168.0.147:5555/logs`, {
          //   date: dayjs(),
          //   user: username,
          //   changed: diff,
          //   personId: person._id,
          // });

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          alert("Грешка, проверете конзолата");
          console.log(err);
          window.location.reload();
        });
    }
    let updated;

    let diff = {};
    for (const key in oldPerson) {
      if (person[key] && oldPerson[key] != person[key]) {
        diff[key] = [oldPerson[key], person[key]];
      }
    }
    setEdit(false);
  };
  const handleCancelEdit = () => {
    setEdit(false);
  };
  // useEffect(() => {
  //   const unloadCallback = (event) => {
  //     event.preventDefault();
  //     event.returnValue = "";
  //     return "";
  //   };

  //   window.addEventListener("beforeunload", unloadCallback);
  //   return () => window.removeEventListener("beforeunload", unloadCallback);
  // }, [edit]);

  const handleChange = (e) => {
    if (e.target.name === "firstName") {
      if (e.target.value.match(/^[A-Za-z0-9 \s]*$/) && e.target.value) {
        setFirstNameError(true);
      } else {
        setFirstNameError(false);
      }
    }
    if (e.target.name === "middleName") {
      if (e.target.value.match(/^[A-Za-z0-9 \s]*$/) && e.target.value) {
        setMiddleNameError(true);
      } else {
        setMiddleNameError(false);
      }
    }
    if (e.target.name === "lastName") {
      if (e.target.value.match(/^[A-Za-z0-9 \s]*$/) && e.target.value) {
        setLastNameError(true);
      } else {
        setLastNameError(false);
      }
    }

    if (e.target.name === "phone" || e.target.name === "phoneSecond") {
      e.target.value = parseInt(e.target.value).toString();
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    }
    if (e.target.name === "EGN" && e.target.value) {
      if (e.target.value.startsWith("0") && e.target.value !== "0") {
        if (e.target.value.startsWith("00") && e.target.value !== "00") {
          e.target.value = `00${parseInt(e.target.value).toString()}`;
        } else {
          e.target.value = `0${parseInt(e.target.value).toString()}`;
        }
      } else {
        e.target.value = parseInt(e.target.value).toString();
      }

      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    }
    if (e.target.name === "site") {
      const siteSelected = sites.filter((obj) => obj.name === e.target.value);

      setPerson({
        ...person,
        siteId: siteSelected[0]._id,
        site: e.target.value,
      });
    } else {
      setPerson({ ...person, [e.target.name]: e.target.value });
    }
  };
  const handleTelk = (event) => {
    setPerson({
      ...person,
      telk: event.target.checked,
    });
  };
  const handlePhoto = (e) => {
    setPerson({ ...person, photo: e.target.files[0] });
    setImageFeedback(true);
  };
  //Function to rearrange date format to match DD/MM/YYYY
  const bgDate = (date) => {
    let [yyyy, mm, dd] = date.split("-");
    let newDate = `${dd}.${mm}.${yyyy}`;
    return newDate;
  };
  //Sites name list
  const siteNames = () =>
    sites.map((obj, index) => {
      return (
        <MenuItem key={index} value={obj.name}>
          {obj.name}
        </MenuItem>
      );
    });
  const jobs = [
    "УПРАВИТЕЛ",
    "СУПЕРВАЙЗЕР МАГАЗИН",
    "ОПЕРАТОР ВЪВЕЖДАНЕ НА ДАННИ",
    "МЪРЧАНДАЙЗЕР",
    "МЪРЧАНДАЙЗЕР КАСИ",
    "ПРОДАВАЧ КОНСУЛТАНТ",
    "КАСИЕР",
    "МЪРЧАНДАЙЗЕР КУЛИНАРЕН ЩАНД",
    "МЪРЧАНДАЙЗЕР КУЛИНАРЕН ЩАНД ПОМОЩНИК",
    "ТРАНЖОР СТАРШИ",
  ];
  const jobsList = () =>
    jobs.map((job, index) => (
      <MenuItem key={index} value={job}>
        {job}
      </MenuItem>
    ));

  return (
    <div className="p-4">
      <Dialog
        open={error[0]}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Грешка"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error[1]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} autoFocus>
            Добре
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <CircularProgress />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
          <Dialog
            open={verDelete}
            onClose={handleCloseDel}
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
                onClick={handleCloseDel}
                autoFocus
              >
                Отказ
              </Button>
              <Button variant="contained" onClick={handleDelete} autoFocus>
                ИзтриЙ
              </Button>
            </DialogActions>
          </Dialog>
          <div className="bg-gray-400 m-auto rounded-xl flex flex-col border-2 border-gray-600 w-9/12 p-4">
            <Box ref={componentRef}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  {imageFeedback && (
                    <Box>
                      <span style={{ color: "green" }}>Снимката е качена</span>
                      <Button
                        color="error"
                        onClick={() => {
                          setPerson({ ...person, photo: "" });
                          setImageFeedback(false);
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </Box>
                  )}
                  <Box
                    component="img"
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    onerror="Снимка"
                    src={
                      person.photo
                        ? `http://192.168.0.147:5555/images/${person.photo}`
                        : `http://192.168.0.147:5555/images/user.png`
                    }
                  />

                  {edit && (
                    <Button
                      sx={{ width: 250 }}
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      КАЧИ СНИМКА
                      <VisuallyHiddenInput
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={handlePhoto}
                      />
                    </Button>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    // alignItems: "end",
                  }}
                >
                  <Box>
                    {edit && (
                      <Item sx={{ width: "80%", backgroundColor: "#f50057" }}>
                        <span>
                          За да се запазят промените, трябва да натиснете бутона
                          "ЗАПИШИ"
                        </span>
                      </Item>
                    )}
                  </Box>
                  <Box>
                    <Fab
                      //   variant="extended"
                      onClick={() => {
                        setEdit(false);
                        setTimeout(() => {
                          handlePrint();
                        }, 20);
                      }}
                      color="primary"
                      aria-label="add"
                    >
                      <PrintIcon />
                    </Fab>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ width: "100%" }}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex" }}>
                    <Item sx={{ width: "50%" }}>
                      <span>Име:</span>
                      <TextField
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "end",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.firstName}
                        id="standard-basic"
                        variant="standard"
                        name="firstName"
                        onChange={handleChange}
                        error={firstNameError}
                        helperText={
                          firstNameError
                            ? "Имената се изписват на кирилица  \n "
                            : ""
                        }
                      />
                    </Item>
                    <Item sx={{ width: "50%", marginLeft: "5px" }}>
                      <span>Телефон:</span>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              +359
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "start",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.phone ? person.phone : ""}
                        id="standard-basic"
                        variant="standard"
                        name="phone"
                        onChange={handleChange}
                      />
                    </Item>
                  </Box>
                  <Box sx={{ display: "flex" }}>
                    <Item sx={{ width: "50%" }}>
                      <span>Презиме:</span>
                      <TextField
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "end",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.middleName}
                        id="standard-basic"
                        variant="standard"
                        name="middleName"
                        onChange={handleChange}
                        error={middleNameError}
                        helperText={
                          middleNameError
                            ? "Имената се изписват на кирилица  \n "
                            : ""
                        }
                      />
                    </Item>
                    <Item sx={{ width: "50%", marginLeft: "5px" }}>
                      <span>Телефон Близък:</span>
                      <TextField
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              +359
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "start",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.phoneSecond ? person.phoneSecond : ""}
                        id="standard-basic"
                        variant="standard"
                        name="phoneSecond"
                        onChange={handleChange}
                      />
                    </Item>
                  </Box>

                  <Box sx={{ display: "flex" }}>
                    <Item sx={{ width: "50%" }}>
                      <span>Фамилия:</span>
                      <TextField
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "end",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.lastName}
                        id="standard-basic"
                        variant="standard"
                        name="lastName"
                        onChange={handleChange}
                        error={lastNameError}
                        helperText={
                          lastNameError
                            ? "Имената се изписват на кирилица  \n "
                            : ""
                        }
                      />
                    </Item>
                    <Item sx={{ width: "50%", marginLeft: "5px" }}>
                      <span>Email:</span>
                      <TextField
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "start",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.email}
                        id="standard-basic"
                        variant="standard"
                        name="email"
                        onChange={handleChange}
                      />
                    </Item>
                  </Box>

                  <Item sx={{ width: "50%" }}>
                    <span>ЕГН:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                        },
                      }}
                      disabled={edit ? false : true}
                      value={person.EGN}
                      id="standard-basic"
                      variant="standard"
                      name="EGN"
                      onChange={handleChange}
                      error={EGNError}
                    />
                  </Item>
                  <Item sx={{ width: "50%", alignmentBaseline: "center" }}>
                    <span style={{ alignContent: "center" }}>Адрес по ЛК:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                        },
                      }}
                      multiline
                      disabled={edit ? false : true}
                      value={
                        person.addressOfficial ? person.addressOfficial : ""
                      }
                      id="standard-basic"
                      variant="standard"
                      name="addressOfficial"
                      onChange={handleChange}
                    />
                  </Item>
                  <Item sx={{ width: "50%" }}>
                    <span style={{ alignContent: "center" }}>
                      Адрес по местопребиваване:
                    </span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                        },
                      }}
                      multiline
                      disabled={edit ? false : true}
                      value={person.addressReal ? person.addressReal : ""}
                      id="standard-basic"
                      variant="standard"
                      name="addressReal"
                      onChange={handleChange}
                    />
                  </Item>
                  <Box sx={{ display: "flex" }}>
                    <Item sx={{ width: "50%" }}>
                      <span>Обект:</span>
                      {/* <span
                        style={{ color: "gray" }}
                      >{`(${person.siteId})`}</span> */}
                      <TextField
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: 16,
                            height: 4,
                            padding: 1,
                            fontWeight: 800,
                            textAlign: "end",
                            padding: edit ? "0px" : "8px",
                          },
                        }}
                        disabled={edit ? false : true}
                        value={person.site}
                        id="standard-basic"
                        variant="standard"
                        select={edit ? true : false}
                        name="site"
                        onChange={handleChange}
                      >
                        {siteNames()}
                      </TextField>
                    </Item>
                    <Item sx={{ width: "50%", marginLeft: "5px" }}>
                      <span>Постъпил на:</span>

                      <DemoContainer components={["DatePicker, DatePicker"]}>
                        <DatePicker
                          slotProps={{
                            textField: {
                              width: "20%",
                              size: "small",
                              padding: "0px",
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

                              "& .MuiButtonBase-root": {
                                padding: 0,
                              },
                            },
                          }}
                          disabled={edit ? false : true}
                          format="DD/MM/YYYY"
                          id="employmentDate"
                          value={
                            person.employmentDate
                              ? dayjs(person.employmentDate)
                              : dayjs()
                          }
                          name="employmentDate"
                          onChange={(newValue) => {
                            setPerson({ ...person, employmentDate: newValue });
                          }}
                        />
                      </DemoContainer>
                    </Item>
                  </Box>

                  <Item sx={{ width: "50%" }}>
                    <span>Длъжност:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                          padding: edit ? "0px" : "8px",
                        },
                      }}
                      disabled={edit ? false : true}
                      value={person.job ? person.job : ""}
                      id="standard-basic"
                      variant="standard"
                      select={edit ? true : false}
                      name="job"
                      onChange={handleChange}
                      error={jobError}
                    >
                      {jobsList()}
                    </TextField>
                  </Item>
                  <Item sx={{ width: "50%" }}>
                    <span>Семейно положение:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                          padding: edit ? "0px" : "8px",
                        },
                      }}
                      disabled={edit ? false : true}
                      value={person.marital ? person.marital : ""}
                      id="standard-basic"
                      variant="standard"
                      select={edit ? true : false}
                      name="marital"
                      onChange={handleChange}
                    >
                      <MenuItem key={1} value={"НЕЖЕНЕН/А"}>
                        НЕЖЕНЕН/А
                      </MenuItem>
                      <MenuItem key={2} value={"ЖЕНЕН/А"}>
                        ЖЕНЕН/А
                      </MenuItem>
                      <MenuItem key={3} value={"РАЗВЕДЕН/А"}>
                        РАЗВЕДЕН/А
                      </MenuItem>
                      <MenuItem key={4} value={"ВДОВЕЦ/А"}>
                        ВДОВЕЦ/А
                      </MenuItem>
                    </TextField>
                  </Item>
                  <Item sx={{ width: "50%" }}>
                    <span>Деца:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                          padding: edit ? "0px" : "8px",
                        },
                      }}
                      disabled={edit ? false : true}
                      value={person.children ? person.children : ""}
                      id="standard-basic"
                      variant="standard"
                      select={edit ? true : false}
                      name="children"
                      onChange={handleChange}
                    >
                      <MenuItem key={1} value={"1"}>
                        1
                      </MenuItem>
                      <MenuItem key={2} value={"2"}>
                        2
                      </MenuItem>
                      <MenuItem key={3} value={"3"}>
                        3
                      </MenuItem>
                      <MenuItem key={4} value={"4"}>
                        4
                      </MenuItem>
                    </TextField>
                  </Item>
                  <Item sx={{ width: "50%" }}>
                    <span>ТЕЛК:</span>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="telk"
                            onChange={handleTelk}
                            value={person.telk}
                            sx={
                              edit
                                ? { padding: "0px" }
                                : { padding: "0px", display: "none" }
                            }
                            checked={person.telk}
                          />
                        }
                        label={
                          <Typography
                            style={
                              edit
                                ? { fontWeight: 800 }
                                : {
                                    color: "rgba(0, 0, 0, 0.38)",
                                    fontWeight: 800,
                                  }
                            }
                          >
                            {person.telk ? "ДА" : "НЕ"}
                          </Typography>
                        }
                      />
                    </FormGroup>
                  </Item>
                  <Item sx={{ width: "50%" }}>
                    <span>Образование:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                          padding: edit ? "0px" : "8px",
                        },
                      }}
                      disabled={edit ? false : true}
                      value={person.education ? person.education : ""}
                      id="standard-basic"
                      variant="standard"
                      select={edit ? true : false}
                      name="education"
                      onChange={handleChange}
                    >
                      <MenuItem key={1} value={"НАЧАЛНО"}>
                        НАЧАЛНО
                      </MenuItem>
                      <MenuItem key={2} value={"ОСНОВНО"}>
                        ОСНОВНО
                      </MenuItem>
                      <MenuItem key={3} value={"СРЕДНО"}>
                        СРЕДНО
                      </MenuItem>
                      <MenuItem key={4} value={"ВИСШЕ"}>
                        ВИСШЕ
                      </MenuItem>
                    </TextField>
                  </Item>

                  <Item sx={{ width: "50%" }}>
                    <span>Специалност:</span>
                    <TextField
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: 16,
                          height: 4,
                          padding: 1,
                          fontWeight: 800,
                          textAlign: "end",
                        },
                      }}
                      disabled={edit ? false : true}
                      value={person.major}
                      id="standard-basic"
                      variant="standard"
                      name="major"
                      onChange={handleChange}
                    />
                  </Item>
                </Stack>
                {userRole === "admin" || userRole === "hr" ? (
                  <div className="flex justify-end">
                    {edit ? (
                      <ButtonGroup variant="contained">
                        <form
                          method="post"
                          action=""
                          encType="multipart/form-data"
                          onSubmit={handleSave}
                        >
                          <Button type="submit" variant="contained" fullWidth>
                            <SaveIcon /> ЗАПИШИ
                          </Button>
                        </form>
                        <Button color="error" onClick={handleCancelEdit}>
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
            </Box>

            <Accordion>
              <AccordionSummary
                sx={{
                  backgroundColor: "gray",
                }}
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                ЛОГ
              </AccordionSummary>
              <AccordionDetails>
                {logLoading ? (
                  <CircularProgress />
                ) : (
                  <Log log={log} person={person} />
                )}
              </AccordionDetails>
            </Accordion>

            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">
                Последна Промяна:
              </span>
              <span>
                {localDateTime(
                  new Date(person.updatedAt).toString().slice(0, 31)
                )}
              </span>
            </div>
            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">Добавен:</span>
              <span>
                {localDateTime(
                  new Date(person.createdAt).toString().slice(0, 31)
                )}
              </span>
            </div>

            <div className="my-2">
              <span className="text-xl mr-4 text-gray-500">ID:</span>
              <span>{`${person._id} / ${person.siteId}`}</span>
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
