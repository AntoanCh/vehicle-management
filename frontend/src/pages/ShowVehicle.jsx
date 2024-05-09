import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Services from "./Services";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ShowVehicle = () => {
  const [vehicle, setVehicle] = useState({});
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [services, setServices] = useState();
  const [servLoading, setServLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/vehicles/${id}`)
      .then((res) => {
        setVehicle(res.data);
        setLoading(false);
        axios
          .get(`http://localhost:5555/services/${res.data._id}`)
          .then((res) => {
            setServices(res.data);
            setServLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setServLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setEdit(true);
  };
  const handleSave = () => {
    setEdit(false);
    axios
      .put(`http://localhost:5555/vehicles/${vehicle._id}`, vehicle)
      .then(() => {
        window.location.reload();
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
  const handleChange = (e) => {
    if (e.target.id === "tires") {
      if (e.target.value.match(/^[0-9]{3}$/)) {
        e.target.value = e.target.value + "/";
      } else if (e.target.value.match(/[0-9]{3}\/[0-9]{2}$/)) {
        e.target.value = e.target.value + "/";
      } else if (e.target.value.match(/[0-9]{3}\/[0-9]{2}\/[0-9]{3}$/)) {
      }
    }
    if ((e.target.id === "km" || e.target.id === "oil") && e.target.value) {
      e.target.value = parseInt(e.target.value);
      if (e.target.value === "NaN") {
        e.target.value = "";
      }
    }
    const newVehicle = { ...vehicle };
    newVehicle[e.target.id] = e.target.value;
    setVehicle({ ...newVehicle });
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
      if (dueDate > 10000) {
        return "warning";
      } else if (dueDate > 9000) {
        return "caution";
      }
    }
  };
  const handleCheck = () => {
    vehicle.checked = dayjs();
    axios
      .put(`http://localhost:5555/vehicles/${vehicle._id}`, vehicle)
      .then(() => {
        window.location.reload();
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
          <div className="bg-gray-400 m-auto rounded-xl flex flex-col border-2 border-gray-600 w-fit p-4">
            <div className="flex">
              <div>
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
                <div className="my-4 flex justify-between">
                  <span className="text-3xl mr-4 text-gray-600">
                    {`${vehicle.make} ${vehicle.model}`}
                  </span>
                </div>
                <div className="flex w-fit text-xl text-center">
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
                </div>
              </div>
              <div>
                <div className="my-4 flex">
                  <div className="w-40">
                    <span className="text-xl mr-2 text-gray-500">Година:</span>
                    <span className="text-xl">{vehicle.year}</span>
                  </div>

                  <div className="w-56">
                    <span className="text-xl ml-4 mr-2 text-gray-500">
                      Гориво:
                    </span>
                    <span className="text-xl">{vehicle.fuel}</span>
                  </div>
                  <div className="w-64">
                    {" "}
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      № ДВГ:
                    </span>
                    <span>{vehicle.engNum}</span>
                  </div>

                  <div className={edit ? "flex" : "flex w-64"}>
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
                      <span className="text-xl">{vehicle.tires}</span>
                    )}
                  </div>
                </div>
                <div className="my-4 flex justify-end">
                  <div className="w-56">
                    <span className="text-xl ml-4 mr-2 text-gray-500">
                      Талон №:
                    </span>
                    <span>{vehicle.talonNum}</span>
                  </div>
                  <div className="w-64">
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      № Рама:
                    </span>
                    <span>{vehicle.bodyNum}</span>
                  </div>
                  <div className={edit ? "flex" : "flex w-64"}>
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      Собственик:
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
                        value={vehicle.owner}
                        id="owner"
                        onChange={handleChange}
                      />
                    ) : (
                      <span>{vehicle.owner}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCheck} variant="outlined">
                ПРОВЕРЕН
              </Button>
            </div>
            <div className="my-4">
              <div className="my-4 flex justify-end my-2">
                <div className={edit ? "flex" : "flex w-64"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Масло/Ф-ри:
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
                      value={vehicle.oil}
                      id="oil"
                      onChange={handleChange}
                    />
                  ) : (
                    <>
                      <span className="text-xl">{vehicle.oil} km</span>
                    </>
                  )}
                </div>
                <div className="flex w-56">
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Преди:
                  </span>
                  <span
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl"
                        : "text-xl"
                    }
                  >
                    {isDue(vehicle.km - vehicle.oil, "oil") ? (
                      <WarningAmberIcon />
                    ) : (
                      ""
                    )}
                    {vehicle.km - vehicle.oil} km
                  </span>
                </div>
                <div className={edit ? "flex" : "flex w-70"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Проверен на:
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
                      <span
                        className={
                          isDue(vehicle.checked, "checked") === "warning"
                            ? "text-red-600 text-xl"
                            : isDue(vehicle.checked, "checked") === "caution"
                            ? "text-yellow-500 text-xl"
                            : "text-xl"
                        }
                      >
                        {vehicle.checked
                          ? bgDate(vehicle.checked.slice(0, 10))
                          : "N/A"}
                        {isDue(vehicle.checked, "checked") ? (
                          <WarningAmberIcon />
                        ) : (
                          ""
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="my-4 flex justify-end my-2">
                <div className={edit ? "flex" : "flex w-64"}>
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
                        width: "150px",
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
                    <span className="text-xl">{vehicle.tax}</span>
                  )}
                </div>
                <div className={edit ? "flex" : "flex w-64"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    ГТП до:
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
                    <span
                      className={
                        isDue(vehicle.gtp, "date") === "warning"
                          ? "text-red-600 text-xl"
                          : isDue(vehicle.gtp, "date") === "caution"
                          ? "text-yellow-500 text-xl"
                          : "text-xl"
                      }
                    >
                      {vehicle.gtp ? bgDate(vehicle.gtp.slice(0, 10)) : ""}
                      {isDue(vehicle.gtp, "date") ? <WarningAmberIcon /> : ""}
                    </span>
                  )}
                </div>
                <div className={edit ? "flex" : "flex w-64"}>
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
                        width: "150px",
                      }}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>
                  ) : (
                    <span className="text-xl">{vehicle.cat}</span>
                  )}
                </div>
              </div>
              <div className="my-4 flex justify-end my-2">
                <div className={edit ? "flex" : "flex w-64"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    ГО до:
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
                    <span
                      className={
                        isDue(vehicle.insDate, "date") === "warning"
                          ? "text-red-600 text-xl"
                          : isDue(vehicle.insDate, "date") === "caution"
                          ? "text-yellow-500 text-xl"
                          : "text-xl"
                      }
                    >
                      {vehicle.insDate
                        ? bgDate(vehicle.insDate.slice(0, 10))
                        : "N/A"}
                      {isDue(vehicle.insDate, "date") ? (
                        <WarningAmberIcon />
                      ) : (
                        ""
                      )}
                    </span>
                  )}
                </div>
                <div className={edit ? "flex" : "flex w-64"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Каско до:
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
                        vehicle.kaskoDate ? vehicle.kaskoDate.slice(0, 10) : ""
                      }
                      id="kaskoDate"
                      onChange={handleChange}
                    />
                  ) : (
                    <span
                      className={
                        isDue(vehicle.kaskoDate, "date") === "warning"
                          ? "text-red-600 text-xl"
                          : isDue(vehicle.kaskoDate, "date") === "caution"
                          ? "text-yellow-500 text-xl"
                          : "text-xl"
                      }
                    >
                      {vehicle.kaskoDate
                        ? bgDate(vehicle.kaskoDate.slice(0, 10))
                        : "N/A"}
                      {isDue(vehicle.kaskoDate, "date") ? (
                        <WarningAmberIcon />
                      ) : (
                        ""
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="my-4 flex justify-end my-2">
                <div className={edit ? "flex" : "flex w-64"}>
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
                    <span>{vehicle.insNum}</span>
                  )}
                </div>

                <div className={edit ? "flex" : "flex w-64"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Каско Полица:
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
                      value={vehicle.kaskoNum}
                      id="kaskoNum"
                      onChange={handleChange}
                    />
                  ) : (
                    <span>{vehicle.kaskoNum ? vehicle.kaskoNum : "N/A"}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                {edit ? (
                  <ButtonGroup variant="contained">
                    <Button onClick={handleSave}>
                      <SaveIcon />
                    </Button>
                    <Button color="warning" onClick={handleCancelEdit}>
                      <CancelIcon />
                    </Button>
                  </ButtonGroup>
                ) : (
                  <Button variant="contained" onClick={handleEdit}>
                    <EditIcon />
                  </Button>
                )}
              </div>
            </div>
            <div>
              {servLoading ? (
                <CircularProgress />
              ) : (
                <Services vehicle={vehicle} services={services} />
              )}
            </div>
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">
                Последна Промяна:
              </span>
              <span>{new Date(vehicle.updatedAt).toString().slice(0, 31)}</span>
            </div>
            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">Добавен:</span>
              <span>{new Date(vehicle.createdAt).toString().slice(0, 31)}</span>
            </div>

            <div className="my-4">
              <span className="text-xl mr-4 text-gray-500">ID:</span>
              <span>{vehicle._id}</span>
            </div>
          </div>
        </LocalizationProvider>
      )}
    </div>
  );
};

export default ShowVehicle;
