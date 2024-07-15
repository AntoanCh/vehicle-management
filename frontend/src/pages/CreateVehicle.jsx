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

const CreateVehicle = () => {
  const [data, setData] = useState({
    type: "",
    site: "",
    make: "",
    model: "",
    reg: "",
    year: "",
    km: "",
    fuel: "",
    engNum: "",
    bodyNum: "",
    talonNum: "",
    gtp: dayjs(),
    insDate: dayjs(),
    insNum: "",
    kasko: false,
    kaskoDate: dayjs("01-01-2001"),
    kaskoNum: "",
    vignette: false,
    vignetteDate: dayjs("01-01-2001"),
    tax: "",
    owner: "",
    cat: "",
    oil: "",
    oilChange: "",

    tires: "",
    purchaseDate: dayjs(),
    startDate: dayjs(),
    startKm: "",
    price: "",
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
  const handleSaveVehicle = () => {
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
      !data.type ||
      !data.site ||
      !data.make ||
      !data.model ||
      !data.reg ||
      !data.year ||
      !data.km ||
      !data.fuel ||
      !data.engNum ||
      !data.bodyNum ||
      !data.talonNum ||
      !data.gtp ||
      !data.insDate ||
      !data.insNum ||
      !data.tax ||
      !data.owner ||
      !data.cat ||
      !data.oil ||
      !data.oilChange ||
      !data.tires
    ) {
      setLoading(false);
      setError([
        true,
        "Има невъведени данни. Въведете всички задължителни данни, обелязани със ' * '",
      ]);
    } else {
      axios
        .post("http://192.168.0.147:5555/vehicle", data)
        .then(() => {
          setLoading(false);
          navigate(`/${data.type}`);
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

  const handleChange = (e) => {
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }
    console.log(error);
    if (e.target.id === "tires") {
      if (e.target.value.match(/^[0-9]{3}$/)) {
        e.target.value = e.target.value + "/";
      } else if (e.target.value.match(/[0-9]{3}\/[0-9]{2}$/)) {
        e.target.value = e.target.value + "/";
      } else if (e.target.value.match(/[0-9]{3}\/[0-9]{2}\/[0-9]{3}$/)) {
      }
    }
    if (e.target.id === "reg") {
      if (
        (!e.target.value.match(/[a-z,A-Z]{1,2}[0-9]{4}[a-z,A-Z]{2}$/) &&
          e.target.value) ||
        !e.target.value
      ) {
        setRegError(true);
        console.log(regError);
      } else {
        setRegError(false);
        console.log(regError);
      }
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

  const years = [];
  for (let i = 1; i < 25; i++) {
    years.push(
      <MenuItem key={i} value={dayjs().year() - i}>
        {dayjs().year() - i}
      </MenuItem>
    );
  }

  const handleKasko = (event) => {
    setData({
      ...data,
      kasko: event.target.checked,
      kaskoDate: event.target.checked ? dayjs() : dayjs("01-01-2001"),
    });
  };
  const handleVignette = (event) => {
    setData({
      ...data,
      vignette: event.target.checked,
      vignetteDate: event.target.checked ? dayjs() : dayjs("01-01-2001"),
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-3xl my-4">НОВ АВТОМОБИЛ</h1>
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
      <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[1200px] p-4 mx-auto">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
            <div className="flex justify-between">
              <div className="mr-20">
                <div className="my-4">
                  <TextField
                    required
                    name="site"
                    select
                    label="Отговорник:"
                    value={data.site}
                    onChange={handleChange}
                    variant="filled"
                  >
                    <MenuItem key={1} value="office">
                      Офис
                    </MenuItem>
                    <MenuItem key={2} value="warehouse">
                      Склад
                    </MenuItem>
                  </TextField>
                </div>
                <div className="my-4">
                  {" "}
                  {/* <label className="text-xl mr-4 text-black-500">Вид</label> */}
                  <TextField
                    required
                    name="type"
                    select
                    label="Вид:"
                    value={data.type}
                    // defaultValue={data.type}
                    onChange={handleChange}
                    variant="filled"
                    // helperText="Please select your currency"
                  >
                    <MenuItem key={1} value="Truck">
                      Товарен
                    </MenuItem>
                    <MenuItem key={2} value="Car">
                      Лек
                    </MenuItem>
                  </TextField>
                </div>

                <div className="my-4">
                  <TextField
                    required
                    error={makeError}
                    id="make"
                    label="Марка:"
                    variant="filled"
                    value={data.make}
                    onChange={handleChange}
                    helperText={
                      makeError
                        ? "Марката/моделът се изписват на ангийски език \n и могат да съдържат само букви и цифри"
                        : ""
                    }
                  />
                </div>
                <div className="my-4">
                  <TextField
                    required
                    error={modelError}
                    id="model"
                    label="Модел:"
                    variant="filled"
                    value={data.model}
                    onChange={handleChange}
                    helperText={
                      modelError
                        ? "Марката/моделът се изписват на ангийски език \n и могат да съдържат само букви и цифри"
                        : ""
                    }
                  />
                </div>
                <div className="my-4">
                  <TextField
                    required
                    error={regError}
                    id="reg"
                    label="Рег. №:"
                    variant="filled"
                    value={data.reg}
                    onChange={handleChange}
                    helperText={
                      regError
                        ? "Неправилен формат на рег. № \n Номерът трябва да бъде във формат AB1234AB, изписан с латински букви"
                        : ""
                    }
                  />
                </div>
                <div className="my-4">
                  <TextField
                    required
                    name="year"
                    select
                    label="Година на производство:"
                    value={data.year}
                    onChange={handleChange}
                    variant="filled"
                    // helperText="Please select your currency"
                  >
                    {years}
                  </TextField>
                </div>
              </div>
              <div className="mr-10">
                <div className="mt-4">
                  <TextField
                    required
                    id="km"
                    label="Километри:"
                    variant="filled"
                    value={data.km}
                    onChange={handleChange}
                  />
                </div>
                <div className="">
                  <TextField
                    required
                    name="fuel"
                    select
                    label="Гориво:"
                    value={data.fuel}
                    onChange={handleChange}
                    variant="filled"
                    // helperText="Please select your currency"
                  >
                    <MenuItem key={1} value="Дизел">
                      Дизел
                    </MenuItem>
                    <MenuItem key={2} value="Бензин">
                      Бензин
                    </MenuItem>
                    <MenuItem key={3} value="Хибрид">
                      Хибрид
                    </MenuItem>
                    <MenuItem key={4} value="Електрически">
                      Електрически
                    </MenuItem>
                    <MenuItem key={5} value="Plug-In">
                      Plug-In
                    </MenuItem>
                    <MenuItem key={6} value="Газ">
                      Газ
                    </MenuItem>
                  </TextField>
                </div>
                <div className="">
                  <TextField
                    required
                    id="engNum"
                    label="Номер Двигател:"
                    variant="filled"
                    value={data.engNum}
                    onChange={handleChange}
                  />
                </div>
                <div className="">
                  <TextField
                    required
                    id="bodyNum"
                    label="Номер Рама:"
                    variant="filled"
                    value={data.bodyNum}
                    onChange={handleChange}
                  />
                </div>
                <div className="">
                  <TextField
                    required
                    id="talonNum"
                    label="Номер Талон:"
                    variant="filled"
                    value={data.talonNum}
                    onChange={handleChange}
                  />
                </div>
                <div className="">
                  {" "}
                  <Checkbox checked={data.vignette} onChange={handleVignette} />
                  <span>Автомобилът има винетен стикер</span>
                </div>
                <div className="my-2">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      disabled={data.vignette ? false : true}
                      format="DD/MM/YYYY"
                      id="vignetteDate"
                      label="Винетка до:"
                      value={data.vignetteDate}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.vignetteDate = newValue;
                        setData({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </div>
              </div>
              <div className="mr-10">
                <div className="mt-2">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      id="gtp"
                      label="ГТП до:"
                      value={data.gtp}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.gtp = newValue;
                        setData({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </div>
                <div className="my-4">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      id="insDate"
                      label="ГО до:"
                      value={data.gtp}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.insDate = newValue;
                        setData({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </div>
                <div className="my-4">
                  <TextField
                    required
                    id="insNum"
                    label="ГО № Полица:"
                    variant="filled"
                    value={data.insNum}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Checkbox checked={data.kasko} onChange={handleKasko} />
                  <span>Автомобилът има застраховка "Каско"</span>
                </div>
                <div className="mt-2">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      disabled={data.kasko ? false : true}
                      format="DD/MM/YYYY"
                      id="kaskoDate"
                      label="Каско до:"
                      value={data.kaskoDate}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.kaskoDate = newValue;
                        setData({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </div>
                <div className="mt-4">
                  <TextField
                    disabled={data.kasko ? false : true}
                    id="kaskoNum"
                    label="Каско № Полица:"
                    variant="filled"
                    value={data.kaskoNum}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <div className="my-4">
                  <TextField
                    required
                    name="tax"
                    select
                    label="Данък за(год):"
                    value={data.tax}
                    onChange={handleChange}
                    variant="filled"
                    // helperText="Please select your currency"
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
                </div>
                <div className="my-4">
                  <TextField
                    required
                    select
                    name="owner"
                    label="Собственик:"
                    variant="filled"
                    value={data.owner}
                    onChange={handleChange}
                  >
                    <MenuItem key={1} value="НИКОН-НК">
                      НИКОН-НК
                    </MenuItem>
                    <MenuItem key={1} value="ЕКСПРЕС-ГАРАНТ">
                      ЕКСПРЕС-ГАРАНТ
                    </MenuItem>
                    <MenuItem key={2} value="Николай Кънчев">
                      Николай Кънчев
                    </MenuItem>
                  </TextField>
                </div>
                <div className="my-4">
                  <TextField
                    required
                    name="cat"
                    select
                    label="ЕКО Група:"
                    value={data.cat}
                    onChange={handleChange}
                    variant="filled"
                    // helperText="Please select your currency"
                  >
                    <MenuItem key={1} value="1">
                      1
                    </MenuItem>
                    <MenuItem key={2} value="2">
                      2
                    </MenuItem>
                    <MenuItem key={3} value="3">
                      3
                    </MenuItem>
                    <MenuItem key={4} value="4">
                      4
                    </MenuItem>
                    <MenuItem key={5} value="5">
                      5
                    </MenuItem>
                  </TextField>
                </div>
                <div className="my-4">
                  <TextField
                    required
                    id="oil"
                    label="Масла/ф-ри(км):"
                    variant="filled"
                    value={data.oil}
                    onChange={handleChange}
                    // helperText="Последна смяна на масла и ф-ри"
                  />
                </div>
                <div className="my-4">
                  <TextField
                    required
                    id="oilChange"
                    label="Масло интервал(км):"
                    variant="filled"
                    value={data.oilChange}
                    onChange={handleChange}
                    // helperText="Последна смяна на масла и ф-ри"
                  />
                </div>
                <div className="my-4">
                  <TextField
                    required
                    id="tires"
                    label="Гуми размер(Ш/В/Д):"
                    variant="filled"
                    value={data.tires}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-center text-xl">Данни за покупка</h1>
              <p className="text-center bg-blue-400 border-blue-800 border-solid rounded-xl">
                При непопълнени данни за дата на първи ремонт и килемтраж, по
                подразбиране ще се вземат датата и километрите от най-ранният
                въведен ремонт на автомобила
              </p>
              <div className="flex justify-center">
                <div className="my-4 text flex justify-center">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      id="startDate"
                      label="Дата на покупка:"
                      value={data.purchaseDate}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.purchaseDate = newValue;
                        setData({ ...newData });
                      }}
                    />
                    <DatePicker
                      format="DD/MM/YYYY"
                      id="startDate"
                      label="Дата първи ремонт:"
                      value={data.startDate}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.startDate = newValue;
                        setData({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </div>
                <div className="mt-6 text flex justify-center">
                  <TextField
                    id="startKm"
                    label="Километраж:"
                    variant="filled"
                    value={data.startKm}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-6 text flex justify-center">
                  <TextField
                    id="price"
                    label="Цена:"
                    variant="filled"
                    value={data.price}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">лв</InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </LocalizationProvider>
        </Box>
        <Button onClick={handleSaveVehicle} variant="contained" fullWidth>
          ЗАПИШИ
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateVehicle;
