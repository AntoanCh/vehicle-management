import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputAdornment from "@mui/material/InputAdornment";

const CreateVehicle = () => {
  const [data, setData] = useState({
    type: "",
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
    kaskoDate: dayjs(),
    kaskoNum: "",
    tax: "",
    owner: "",
    cat: "",
    oil: "",
    tires: "",
    startDate: dayjs(),
    startKm: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const navigate = useNavigate();

  const handleSaveVehicle = () => {
    setLoading(true);

    if (data.reg)
      axios
        .post("http://localhost:5555/vehicles", data)
        .then(() => {
          setLoading(false);
          navigate(`/${data.type}`);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.message) {
            alert(err.response.data.message);
          } else {
            alert("Грешка, проверете конзолата");
            console.log(err);
          }
        });
  };

  const handleChange = (e) => {
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
        !e.target.value.match(/[a-z,A-Z]{1,2}[1-9]{4}[a-z,A-Z]{2}$/) &&
        e.target.value
      ) {
        setRegError(true);
        console.log(regError);
      } else {
        setRegError(false);
        console.log(regError);
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

  return (
    <div className="p-4">
      <h1 className="text-center text-3xl my-4">НОВ АВТОМОБИЛ</h1>
      {loading ? <CircularProgress /> : ""}
      <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[1200px] p-4 mx-auto">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex justify-between">
              <div>
                <div className="my-4">
                  {" "}
                  {/* <label className="text-xl mr-4 text-black-500">Вид</label> */}
                  <TextField
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
                    error={modelError}
                    id="make"
                    label="Марка:"
                    variant="filled"
                    value={data.make}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4">
                  <TextField
                    error={modelError}
                    id="model"
                    label="Модел:"
                    variant="filled"
                    value={data.model}
                    onChange={handleChange}
                    helperText={
                      modelError
                        ? "Марката и моделът могат да съдържат само латински букви и цифри"
                        : ""
                    }
                  />
                </div>
                <div className="my-4">
                  <TextField
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
                    name="year"
                    select
                    label="Година:"
                    value={data.year}
                    onChange={handleChange}
                    variant="filled"
                    // helperText="Please select your currency"
                  >
                    {years}
                  </TextField>
                </div>
              </div>
              <div>
                <div className="my-4">
                  <TextField
                    id="km"
                    label="Километри:"
                    variant="filled"
                    value={data.km}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4">
                  <TextField
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
                  </TextField>
                </div>
                <div className="my-4">
                  <TextField
                    id="engNum"
                    label="Номер Двигател:"
                    variant="filled"
                    value={data.engNum}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4">
                  <TextField
                    id="bodyNum"
                    label="Номер Рама:"
                    variant="filled"
                    value={data.bodyNum}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4">
                  <TextField
                    id="talonNum"
                    label="Номер Талон:"
                    variant="filled"
                    value={data.talonNum}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <div className="my-4">
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
                    id="insNum"
                    label="ГО № Полица:"
                    variant="filled"
                    value={data.insNum}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
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
                <div className="my-4">
                  <TextField
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
                    name="tax"
                    select
                    label="Данък за:"
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
                    id="owner"
                    label="Собственик:"
                    variant="filled"
                    value={data.owner}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4">
                  <TextField
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
                    id="oil"
                    label="Масло/ф-ри:"
                    variant="filled"
                    value={data.oil}
                    onChange={handleChange}
                    // helperText="Последна смяна на масла и ф-ри"
                  />
                </div>
                <div className="my-4">
                  <TextField
                    id="tires"
                    label="Гуми размер:"
                    variant="filled"
                    value={data.tires}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-center text-xl">Данни за покупка</h1>
              <div className="flex justify-center">
                <div className="my-4 text flex justify-center">
                  <DemoContainer components={["DatePicker, DatePicker"]}>
                    <DatePicker
                      format="DD/MM/YYYY"
                      id="startDate"
                      label="Дата на покупка:"
                      value={data.startDate}
                      onChange={(newValue) => {
                        const newData = { ...data };
                        newData.startDate = newValue;
                        setData({ ...newData });
                      }}
                    />
                  </DemoContainer>
                </div>
                <div className="my-4 text flex justify-center">
                  <TextField
                    id="startKm"
                    label="Километраж:"
                    variant="filled"
                    value={data.startKm}
                    onChange={handleChange}
                  />
                </div>
                <div className="my-4 text flex justify-center">
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
    </div>
  );
};

export default CreateVehicle;
