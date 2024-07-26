import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import { ToastContainer, toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#ccc",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
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

const CreatePerson = () => {
  const location = useLocation();
  const { siteId, siteName } = location.state;
  const [data, setData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    IDNum: "",
    EGN: "",
    addressOfficial: "",
    addressReal: "",
    job: "",
    marital: "",
    telk: false,
    education: "",
    diploma: "",
    major: "",
    email: "",
    phone: "",
    phoneSecond: "",
    employmentDate: dayjs(),
    children: "",
    photo: "",
    siteId: siteId,
  });
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState(false);
  const [makeError, setMakeError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [error, setError] = useState([false, ""]);

  const navigate = useNavigate();

  const handleClose = () => {
    setError([false, ""]);
  };
  const handleSavePerson = (e) => {
    setLoading(true);

    if (regError || makeError || modelError) {
      setLoading(false);
      toast.error("Има непоправени грешки", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setError([
        true,
        "Има неправилно въведени данни. Проверете за червени полета и поправете грешките",
      ]);
    } else if (
      !data.firstName ||
      !data.middleName ||
      !data.lastName ||
      !data.EGN ||
      !data.IDNum ||
      !data.job ||
      !data.employmentDate
    ) {
      setLoading(false);
      setError([
        true,
        "Има невъведени данни. Въведете всички задължителни данни, обелязани със ' * '",
      ]);
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("middleName", data.middleName);
      formData.append("lastName", data.lastName);
      formData.append("EGN", data.EGN);
      formData.append("IDNum", data.IDNum);
      formData.append("job", data.job);
      formData.append("employmentDate", data.employmentDate);
      formData.append("addressOfficial", data.addressOfficial);
      formData.append("addressReal", data.addressReal);
      formData.append("marital", data.marital);
      formData.append("telk", data.telk);
      formData.append("education", data.education);
      formData.append("diploma", data.diploma);
      formData.append("major", data.major);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("phoneSecond", data.phoneSecond);
      formData.append("children", data.children);
      formData.append("photo", data.photo);
      formData.append("siteId", data.siteId);
      console.log(formData);
      axios
        .post("http://192.168.0.147:5555/api/person", formData)
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.message) {
            setError([true, err.response.data.message]);
          } else {
            alert("Грешка, проверете конзолата");
            setError([true, "Грешка, проверете конзолата"]);
            console.log(err);
          }
        });
    }
  };
  const handlePhoto = (e) => {
    setData({ ...data, photo: e.target.files[0] });
    // console.log(e.target.files);
    // console.log(data.photo);
  };
  const handleChange = (e) => {
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }

    if (e.target.id === "make") {
      if (
        (!e.target.value.match(/^[A-Za-z0-9]*$/) && e.target.value) ||
        !e.target.value
      ) {
        setMakeError(true);
      } else {
        setMakeError(false);
      }
    }
    if (e.target.id === "model") {
      if (
        (!e.target.value.match(/^[A-Za-z0-9]*$/) && e.target.value) ||
        !e.target.value
      ) {
        setModelError(true);
      } else {
        setModelError(false);
      }
    }

    if (
      (e.target.id === "km" ||
        e.target.id === "startKm" ||
        e.target.id === "price" ||
        e.target.id === "talonNum" ||
        e.target.id === "oil") &&
      e.target.value
    ) {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    }
    if (e.target.name) {
      const newData = { ...data };
      newData[e.target.name] = e.target.value;
      setData({ ...newData });
    } else {
      const newData = { ...data };
      newData[e.target.id] = e.target.value;
      setData({ ...newData });
    }
  };

  const handleTelk = (event) => {
    setData({
      ...data,
      telk: event.target.checked,
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-3xl my-4">{`НОВ СЛУЖИТЕЛ ЗА ${siteName}`}</h1>
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
      ;{loading ? <CircularProgress /> : ""}
      <Box className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[1200px] p-4 mx-auto">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      required
                      id="firstName"
                      label="Име:"
                      value={data.firstName}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  {" "}
                  <div>
                    <TextField
                      required
                      error={modelError}
                      select
                      name="job"
                      label="Длъжност:"
                      variant="filled"
                      value={data.job}
                      onChange={handleChange}
                      helperText={
                        modelError
                          ? "Марката/моделът се изписват на ангийски език \n и могат да съдържат само букви и цифри"
                          : ""
                      }
                    >
                      <MenuItem key={1} value={"асд"}>
                        асд
                      </MenuItem>
                    </TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      name="education"
                      select
                      label="Образование:"
                      variant="filled"
                      value={data.education}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="phone"
                      label="Телефон:"
                      value={data.phone}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      required
                      id="middleName"
                      label="Презиме:"
                      value={data.middleName}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <DemoContainer components={["DatePicker, DatePicker"]}>
                      <DatePicker
                        required
                        format="DD/MM/YYYY"
                        id="employmentDate"
                        label="Дата на постъпване:"
                        value={data.employmentDate}
                        onChange={(newValue) => {
                          const newData = { ...data };
                          newData.employmentDate = newValue;
                          setData({ ...newData });
                        }}
                      />
                    </DemoContainer>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="diploma"
                      label="Диплома:"
                      variant="filled"
                      value={data.diploma}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="phoneSecond"
                      label="Телфон Близък:"
                      variant="filled"
                      value={data.phoneSecond}
                      onChange={handleChange}
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      required
                      error={makeError}
                      id="lastName"
                      label="Фамилия:"
                      variant="filled"
                      value={data.lastName}
                      onChange={handleChange}
                      helperText={
                        makeError
                          ? "Марката/моделът се изписват на ангийски език \n и могат да съдържат само букви и цифри"
                          : ""
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="addressOfficial"
                      label="Адрес по ЛК:"
                      variant="filled"
                      value={data.addressOfficial}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="major"
                      label="Специалност:"
                      variant="filled"
                      value={data.major}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="email"
                      label="Email:"
                      value={data.email}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      required
                      id="IDNum"
                      label="ЛК №:"
                      variant="filled"
                      value={data.IDNum}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="addressReal"
                      label="Адрес по местопребиваване:"
                      variant="filled"
                      value={data.addressReal}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      name="marital"
                      select
                      label="Семейно положение:"
                      variant="filled"
                      value={data.marital}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      required
                      id="EGN"
                      label="ЕГН:"
                      value={data.EGN}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <Checkbox checked={data.telk} onChange={handleTelk} />
                    <span>ТЕЛК</span>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div>
                    <TextField
                      id="children"
                      label="Деца:"
                      variant="filled"
                      value={data.children}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      onChange={handlePhoto}
                    />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
        </Box>
        <form
          method="post"
          action=""
          encType="multipart/form-data"
          onSubmit={handleSavePerson}
        >
          <Button
            type="submit"
            // onClick={handleSavePerson}
            variant="contained"
            fullWidth
          >
            ЗАПИШИ
          </Button>
        </form>
      </Box>
      <ToastContainer />
    </div>
  );
};

export default CreatePerson;
