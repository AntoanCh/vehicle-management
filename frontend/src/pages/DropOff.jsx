import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

const DropOff = () => {
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState({});
  const [record, setRecord] = useState({});
  const [driver, setDriver] = useState({});
  const [problems, setProblems] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://192.168.0.147:5555/api/drivers/${id}`)
      .then((res) => {
        setDriver(res.data);
        axios
          .get(`http://192.168.0.147:5555/api/records/${res.data.recordId}`)
          .then((res) => {
            setRecord(res.data);
            axios
              .get(`http://192.168.0.147:5555/vehicle/${res.data.vehicleId}`)
              .then((res) => {
                setVehicle(res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
  }, []);

  const handleDropOff = () => {
    axios
      .put(`http://192.168.0.147:5555/api/records/${record._id}`, {
        ...record,
        dropoffTime: dayjs(),
      })
      .then((res) => {
        axios
          .put(`http://192.168.0.147:5555/api/drivers/${driver._id}`, {
            ...driver,
            occupied: false,
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
        axios
          .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
            ...vehicle,
            occupied: {
              bool: false,
              user: "",
            },
          })
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
        navigate("/scan", { state: { state: true } });
      })
      .catch((err) => {
        console.log(err);
      });
    if (problems) {
      axios
        .post(`http://192.168.0.147:5555/problems`, {
          date: dayjs(),
          desc: problems,
          vehicleId: vehicle._id,
          driverName: driver.firstName,
        })
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }

    setLoading(false);
    navigate("/scan");
  };

  const handleChange = (e) => {
    setProblems(e.target.value);
  };
  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#ccc",
          width: "80%",
        }}
        className="  border-2 border-blue-400 rounded-xl  p-4 mx-auto mt-5"
      >
        <Button
          sx={{}}
          color="error"
          variant="contained"
          onClick={() => navigate("/scan")}
          autoFocus
        >
          <ArrowBackIosIcon />
          НАЗАД
        </Button>
        <TextField
          sx={{
            "& .MuiInputBase-input": {
              fontSize: 18,

              padding: 1,
              fontWeight: 800,
              textAlign: "center",
              color: "black",
            },
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "black", //Adjust text color here
            },
          }}
          fullWidth
          variant="filled"
          disabled
          value={`${driver.firstName} ${driver.lastName}`}
        >{`${driver.firstName} ${driver.lastName}`}</TextField>
        <h1 style={{ fontWeight: 800, fontSize: 24, textAlign: "center" }}>
          ВРЪЩАНЕ НА АВТОМОБИЛ
        </h1>
        <Box>
          <TextField
            label="Дата и час на взимане"
            disabled
            variant="standard"
            value={dayjs(record.pickupTime).format(
              "DD/MM/YYYY     [Час:] HH:mm"
            )}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              backgroundColor: "#bbb",
              width: "50%",
            }}
            className="  border-2 border-blue-400 rounded-xl  p-4  mt-5 mx-1"
          >
            <TextField
              disabled
              fullWidth
              value={vehicle.reg}
              variant="standard"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 18,

                  padding: 1,
                  fontWeight: 800,
                  textAlign: "center",
                  color: "black",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black", //Adjust text color here
                },
              }}
            />
            <TextField
              fullWidth
              disabled
              value={`${vehicle.make} ${vehicle.model}`}
              variant="standard"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 18,
                  padding: 1,
                  fontWeight: 800,
                  textAlign: "center",
                  color: "black",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black", //Adjust text color here
                },
              }}
            />
            <TextField
              disabled
              fullWidth
              value={vehicle.fuel}
              variant="standard"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 18,
                  padding: 1,
                  fontWeight: 800,
                  textAlign: "center",
                  color: "black",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black", //Adjust text color here
                },
              }}
            />
            <TextField
              disabled
              fullWidth
              value={`ГТП:   ${dayjs(vehicle.gtp).format("DD/MM/YYYY")}`}
              variant="standard"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 18,
                  padding: 1,
                  fontWeight: 800,
                  textAlign: "center",
                  color: "black",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black", //Adjust text color here
                },
              }}
            />
            <TextField
              disabled
              fullWidth
              value={`ГО:   ${dayjs(vehicle.insDate).format("DD/MM/YYYY")}`}
              variant="standard"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 18,
                  padding: 1,
                  fontWeight: 800,
                  textAlign: "center",
                  color: "black",
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "black", //Adjust text color here
                },
              }}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: "#bbb",
              width: "50%",
            }}
            className="  border-2 border-blue-400 rounded-xl  p-4  mt-5 mx-1"
          >
            <TextField
              label="ЗАБЕЛЕЖКИ"
              onChange={handleChange}
              value={problems}
              sx={{
                width: "100%",
                height: "100%",
                "& .MuiInputBase-input": {
                  height: "100%",
                },
              }}
              multiline
            />
          </Box>
        </Box>
        <Button variant="contained" fullWidth onClick={handleDropOff}>
          ВЪРНИ АВТОМОБИЛ
        </Button>
      </Box>
    </div>
  );
};

export default DropOff;
