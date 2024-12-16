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
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ErrorDialog from "../components/ErrorDialog";

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

const CreatePerson = ({ siteId, siteName }) => {
  const location = useLocation();
  //   const { siteId, siteName } = location.state;
  const [data, setData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    EGN: "",
    addressOfficial: "",
    addressReal: "",
    job: "",
    marital: "",
    telk: false,
    education: "",
    major: "",
    email: "",
    phone: "",
    phoneSecond: "",
    employmentDate: dayjs(),
    children: "",
    photo: "",
    site: siteName,
    siteId: siteId,
  });
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [middleNameError, setMiddleNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [jobError, setJobError] = useState(false);
  const [employmentDateError, setEmploymentDateError] = useState(false);
  const [EGNError, setEGNError] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [imageFeedback, setImageFeedback] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setError([false, ""]);
  };
  const handleSavePerson = (e) => {
    setLoading(true);

    if (firstNameError || middleNameError || lastNameError) {
      e.preventDefault();
      setLoading(false);

      setError([
        true,
        "Има неправилно въведени данни. Проверете за червени полета и поправете грешките",
      ]);
    } else if (
      !data.firstName ||
      !data.middleName ||
      !data.lastName ||
      !data.EGN ||
      !data.job ||
      !data.employmentDate
    ) {
      e.preventDefault();
      setLoading(false);
      if (!data.firstName) {
        setFirstNameError(true);
      }
      if (!data.middleName) {
        setMiddleNameError(true);
      }
      if (!data.lastName) {
        setLastNameError(true);
      }
      if (!data.job) {
        setJobError(true);
      }
      if (!data.employmentDate) {
        setEmploymentDateError(true);
      }

      if (!data.EGN) {
        setEGNError(true);
      }
      setError([
        true,
        "Има невъведени данни. Въведете всички задължителни данни, отбелязани със ' * '",
      ]);
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("middleName", data.middleName);
      formData.append("lastName", data.lastName);
      formData.append("EGN", data.EGN);
      formData.append("job", data.job);
      formData.append("employmentDate", data.employmentDate);
      formData.append("addressOfficial", data.addressOfficial);
      formData.append("addressReal", data.addressReal);
      formData.append("marital", data.marital);
      formData.append("telk", data.telk);
      formData.append("education", data.education);
      formData.append("major", data.major);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("phoneSecond", data.phoneSecond);
      formData.append("children", data.children);
      formData.append("photo", data.photo);
      formData.append("site", data.site);
      formData.append("siteId", data.siteId);

      axios
        .post("http://192.168.0.147:5555/api/person", formData)
        .then(() => {
          setLoading(false);
          window.location.reload();
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
    setImageFeedback(true);
  };
  const handleChange = (e) => {
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }

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
    <Box className="p-4">
      <h1 className="text-center text-3xl my-4">{`НОВ СЛУЖИТЕЛ ЗА ${siteName}`}</h1>
      <ErrorDialog error={error} setError={setError} />;
      {loading ? <CircularProgress /> : ""}
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
              <Grid columns={10} container spacing={1}>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      required
                      id="firstName"
                      name="firstName"
                      label="Име:"
                      value={data.firstName}
                      onChange={handleChange}
                      variant="filled"
                      error={firstNameError}
                      helperText={
                        firstNameError
                          ? "Имената се изписват на кирилица  \n "
                          : ""
                      }
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      required
                      id="middleName"
                      name="middleName"
                      label="Презиме:"
                      value={data.middleName}
                      onChange={handleChange}
                      variant="filled"
                      error={middleNameError}
                      helperText={
                        middleNameError
                          ? "Имената се изписват на кирилица  \n "
                          : ""
                      }
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      label="Фамилия:"
                      variant="filled"
                      value={data.lastName}
                      onChange={handleChange}
                      error={lastNameError}
                      helperText={
                        lastNameError
                          ? "Имената се изписват на кирилица  \n "
                          : ""
                      }
                    />
                  </div>
                </Grid>
                <Grid item xs={2}>
                  {" "}
                  <div>
                    <TextField
                      required
                      error={jobError}
                      select
                      name="job"
                      label="Длъжност:"
                      variant="filled"
                      value={data.job}
                      onChange={handleChange}
                    >
                      {jobsList()}
                    </TextField>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <DemoContainer components={["DatePicker, DatePicker"]}>
                      <DatePicker
                        required
                        error={employmentDateError}
                        format="DD/MM/YYYY"
                        id="employmentDate"
                        name="employmentDate"
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

                <Grid item xs={2}>
                  <div>
                    <TextField
                      required
                      id="EGN"
                      error={EGNError}
                      name="EGN"
                      label="ЕГН:"
                      value={data.EGN}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      name="education"
                      select
                      label="Образование:"
                      variant="filled"
                      value={data.education}
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
                  </div>
                </Grid>

                <Grid item xs={2}>
                  <div>
                    <TextField
                      id="major"
                      name="major"
                      label="Специалност:"
                      variant="filled"
                      value={data.major}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      id="phone"
                      name="phone"
                      label="Телефон:"
                      value={data.phone}
                      onChange={handleChange}
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+359</InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </div>
                </Grid>

                <Grid item xs={2}>
                  <div>
                    <TextField
                      id="phoneSecond"
                      name="phoneSecond"
                      label="Телфон Близък:"
                      variant="filled"
                      value={data.phoneSecond}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+359</InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      id="email"
                      name="email"
                      label="Email:"
                      value={data.email}
                      onChange={handleChange}
                      variant="filled"
                    ></TextField>
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      id="addressOfficial"
                      name="addressOfficial"
                      label="Адрес по ЛК:"
                      variant="filled"
                      value={data.addressOfficial}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>

                <Grid item xs={2}>
                  <div>
                    <TextField
                      id="addressReal"
                      name="addressReal"
                      label="Адрес по местопребиваване:"
                      variant="filled"
                      value={data.addressReal}
                      onChange={handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      name="marital"
                      select
                      label="Семейно положение:"
                      variant="filled"
                      value={data.marital}
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
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div>
                    <TextField
                      select
                      id="children"
                      name="children"
                      label="Деца:"
                      variant="filled"
                      value={data.children}
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
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <Box sx={{ alignContent: "center" }}>
                    <Checkbox checked={data.telk} onChange={handleTelk} />
                    <span>ТЕЛК</span>
                  </Box>
                </Grid>

                <Grid item xs={2} sx={{ alignContent: "center" }}>
                  <Button
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
                </Grid>
                <Grid item xs={2} sx={{ alignContent: "center" }}>
                  {imageFeedback && (
                    <Box>
                      <span style={{ color: "green" }}>Снимката е качена</span>
                      <Button
                        color="error"
                        onClick={() => {
                          setData({ ...data, photo: "" });
                          setImageFeedback(false);
                        }}
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </Box>
                  )}
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
    </Box>
  );
};

export default CreatePerson;
