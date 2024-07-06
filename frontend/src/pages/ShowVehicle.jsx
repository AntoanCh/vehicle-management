import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, ButtonGroup } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Services from "./Services";
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

const ShowVehicle = () => {
  const [vehicle, setVehicle] = useState({});
  const [oldVehicle, setOldVehicle] = useState({});
  const [showLog, setShowLog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [services, setServices] = useState();
  const [fuels, setFuels] = useState();
  const [problems, setProblems] = useState();
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
      const { data } = await axios.post("http://localhost:5555/", { token });
      const { status, user, role } = data;
      setUsername(user);
      setUserRole(role);
    };
    verifyUser();
    console.log(userRole);
  }, [token, navigate]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://192.168.0.145:5555/vehicles/${id}`)
      .then((res) => {
        setVehicle(res.data);
        setLoading(false);
        axios
          .get(`http://192.168.0.145:5555/services/${res.data._id}`)
          .then((res) => {
            setServices(res.data);
            setServLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setServLoading(false);
          });
        axios
          .get(`http://192.168.0.145:5555/fuels/${res.data._id}`)
          .then((res) => {
            setFuels(res.data);
            setFuelLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setFuelLoading(false);
          });
        axios
          .get(`http://192.168.0.145:5555/problems/${res.data._id}`)
          .then((res) => {
            setProblems(res.data);
            setProblemLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setProblemLoading(false);
          });
        axios
          .get(`http://192.168.0.145:5555/logs/${res.data._id}`)
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
  const handleDelete = () => {
    axios
      .delete(`http://192.168.0.145:5555/vehicles/${vehicle._id}`)
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
    console.log(updated);
    axios
      .put(`http://192.168.0.145:5555/vehicles/${vehicle._id}`, updated)
      .then(() => {
        axios.post(`http://192.168.0.145:5555/logs`, {
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

    console.log(diff);
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
      .put(`http://192.168.0.145:5555/vehicles/${vehicle._id}`, vehicle)
      .then(() => {
        axios.post(`http://192.168.0.145:5555/logs`, {
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
                    {/* <span className="text-xl">{vehicle.year}</span> */}
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
                    {/* <span className="text-xl">{vehicle.fuel}</span> */}
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
                  <div className="w-40">
                    {" "}
                    <span className="text-xl mr-2 ml-4 text-gray-500">
                      № ДВГ:
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
                      value={vehicle.engNum}
                    />
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
                  <div className="w-40">
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
                        maxWidth: "100px",
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
                          // className="w-fit"
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
              </div>
            </div>

            <div className="flex justify-end">
              {userRole === "admin" || userRole === vehicle.site ? (
                <Button onClick={handleCheck} variant="outlined">
                  ПРОВЕРЕН
                </Button>
              ) : (
                ""
              )}
            </div>
            <div className="my-4">
              <div className="my-4 flex justify-end my-2">
                <div className={edit ? "flex" : "flex w-64"}>
                  <span className="text-xl mr-2 ml-4 text-gray-500">
                    Тех.Обс.:
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
                <div className="flex w-56">
                  <span
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl mr-2 ml-4"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl mr-2 ml-4"
                        : "text-xl mr-2 ml-4"
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
                        : "text-xl"
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
                <div className="flex w-56">
                  <span
                    className={
                      isDue(vehicle.km - vehicle.oil, "oil") === "warning"
                        ? "text-red-600 text-xl"
                        : isDue(vehicle.km - vehicle.oil, "oil") === "caution"
                        ? "text-yellow-500 text-xl"
                        : "text-xl"
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
                        : "text-xl"
                    }
                    type="text"
                    style={{
                      borderRadius: "5px",
                      textAlign: "center",
                      maxWidth: "110px",
                    }}
                    value={`${10000 - (vehicle.km - vehicle.oil)} km`}
                  />
                </div>
                <div className={edit ? "flex" : "flex w-70"}>
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
              </div>
              <div className="my-4 flex justify-end my-2">
                <div className={edit ? "flex" : "flex w-56"}>
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
                      value={vehicle.tax}
                    />
                  )}
                </div>
                <div className={"flex"}>
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
                <div className={"flex"}>
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
                </div>
              </div>
              <div className="my-4 flex justify-end my-2">
                <div className={"flex"}>
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
                <div className={"flex"}>
                  <span
                    className={
                      isDue(vehicle.kaskoDate, "date") === "warning"
                        ? "text-red-600 text-xl mr-2 ml-4"
                        : isDue(vehicle.kaskoDate, "date") === "caution"
                        ? "text-yellow-500 text-xl mr-2 ml-4"
                        : "text-xl mr-2 ml-4"
                    }
                  >
                    Каско до:
                    {isDue(vehicle.kaskoDate, "date") ? (
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
                        vehicle.kaskoDate ? vehicle.kaskoDate.slice(0, 10) : ""
                      }
                      id="kaskoDate"
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      disabled
                      className={
                        isDue(vehicle.kaskoDate, "date") === "warning"
                          ? "text-red-600 text-xl bg-gray-400"
                          : isDue(vehicle.kaskoDate, "date") === "caution"
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
                          ? bgDate(vehicle.kaskoDate.slice(0, 10))
                          : "N/A"
                      }
                    />
                  )}
                </div>
              </div>
              <div className="my-4 flex justify-end my-2">
                <div className={"flex"}>
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

                <div className={"flex"}>
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
                </div>
              </div>

              {userRole === "admin" || userRole === vehicle.site ? (
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
              ) : (
                ""
              )}
            </div>
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
              {servLoading ? (
                <CircularProgress />
              ) : (
                <Services
                  username={username}
                  userRole={userRole}
                  vehicle={vehicle}
                  fuels={fuels}
                  services={services}
                />
              )}
            </div>

            <div>
              <Button
                onClick={handleShowLog}
                fullWidth
                variant="contained"
                style={{}}
              >
                {showLog ? "СКРИИ ЛОГ" : "ПОКАЖИ ЛОГ"}
              </Button>
              {showLog ? (
                logLoading ? (
                  <CircularProgress />
                ) : (
                  <Log log={log} />
                )
              ) : (
                ""
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
            <div>
              {userRole === "admin" || userRole === vehicle.site ? (
                <Button
                  onClick={handleDelete}
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
