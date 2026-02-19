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

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
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
  const [variables, setVariables] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState(false);
  const [verDelete, setVerDelete] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [sites, setSites] = useState([]);
  const [username, setUsername] = useState();
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/sites/`);
        const mapped = res.data.data.map((i) => i.name);
        setSites(mapped);
        console.log(mapped);
      } catch (error) {
        // setError({
        //   show: true,
        //   message: `Грешка при комуникация: ${error}`,
        // });

        return;
      }
      // setError({ show: false, message: "" });
    };
    fetchSites();
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
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/api/variables/")
      .then((res) => {
        setVariables(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [refresh]);

  const handleClose = () => {
    setVerDelete(false);
  };

  const verifyDelete = () => {
    setVerDelete(true);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = () => {
    let updated;

    let diff = {};

    setEdit(false);

    axios
      .put("http://192.168.0.147:5555/api/variables/", {
        ...updated,
      })
      .then(() => {
        axios.post(`http://192.168.0.147:5555/api/logs`, {
          date: dayjs(),
          user: username,
          changed: diff,
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

    setVariables({ ...variables, [e.target.name]: e.target.value });
  };

  return (
    <Box className="p-4">
      {loading ? (
        <CircularProgress />
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
          {/* <Dialog
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
          </Dialog> */}
          <Box sx={{ width: "90%", margin: "auto" }}>
            <h1 className="text-3xl m-auto text-center my-4">{"НАСТРОЙКИ"}</h1>
            <Box sx={{ display: { sm: "flex", xs: "" } }}>
              <Grid container spacing={2}>
                <Grid item lg={12} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Собственици:</Box>
                    <Box>
                      <StyledTextField
                        value="asd"
                        disabled
                        fullWidth
                        name="km"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={12} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "gray" }}>Гориво:</Box>
                    <Box>
                      {" "}
                      <StyledTextField
                        value={"asd"}
                        disabled
                        name="fuel"
                        onChange={handleChange}
                        variant="standard"
                      />
                    </Box>
                  </ItemStacked>
                </Grid>
                <Grid item lg={12} sm={6} xs={12}>
                  <ItemStacked>
                    <Box sx={{ color: "white" }}>
                      Локации/Отговорници: {`${sites}`}
                    </Box>

                    <Box>
                      {" "}
                      {/* <StyledTextField
                        value={"asd"}
                        disabled
                        name="fuel"
                        onChange={handleChange}
                        variant="standard"
                      /> */}
                    </Box>
                  </ItemStacked>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default ShowVehicle;
