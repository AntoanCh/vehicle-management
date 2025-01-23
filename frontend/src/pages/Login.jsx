import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, MenuItem, TextField } from "@mui/material";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import { Box } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorDialog from "../components/utils/ErrorDialog";

const Login = () => {
  const [users, setUsers] = useState();
  const [error, setError] = useState({ show: false, message: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [caps, setCaps] = useState(false);
  useEffect(() => {
    axios
      .get("http://192.168.0.147:5555/api/users")
      .then((res) => {
        setUsers(res.data.data.map((entrie) => entrie.username));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const { username, password } = input;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.username || !input.password) {
      setError({ show: true, message: "Въведете Потребител и Парола" });
    } else {
      try {
        const { data } = await axios.post(
          "http://192.168.0.147:5555/auth/login",
          {
            ...input,
          }
        );
        localStorage.setItem("token", data.token);
        const { status, message } = data;

        if (status) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/");
          }, 400);
        } else {
          setError({
            show: true,
            message: "Неправилна парола или потребителско име",
          });
        }
      } catch (error) {
        console.log(error);
      }
      setInput({
        ...input,
        username: "",
        password: "",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box>
        <ErrorDialog error={error} setError={setError} />
        <h2 className="text-2xl text-center"> Вход Потребител</h2>
        <form action="">
          <Box
            sx={{
              width: "600px",
              height: "100%",
              // padding: "15px",
              // width: "600px",
              // border: "3px solid #29b6f6",
              // borderRadius: "10px",
              // backgroundColor: "#e0e0e0",
            }}
          >
            <Box sx={{ marginY: "5px" }}>
              <TextField
                fullWidth
                name="username"
                select
                label="Потребител:"
                value={username}
                onChange={handleChange}
                variant="filled"
              >
                {users ? (
                  users.sort().map((e, index) => (
                    <MenuItem key={index} value={e}>
                      {e}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem key={1} value={0}>
                    0
                  </MenuItem>
                )}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
              <span style={{ color: "red" }}> {caps ? "CAPSLOCK ON" : ""}</span>
            </Box>

            <Box sx={{ marginY: "15px" }}>
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="filled-adornment-password">
                  Парола:
                </InputLabel>
                <FilledInput
                  id="filled-adornment-password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.getModifierState("CapsLock")) {
                      setCaps(true);
                    } else {
                      setCaps(false);
                    }
                  }}
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {/* <TextField
                type="password"
                fullWidth
                name="password"
                label="Парола:"
                value={password}
                onChange={handleChange}
                variant="filled"
              /> */}
            </Box>
            <Box sx={{ marginY: "15px" }}>
              <Button
                type="submit"
                onClick={handleSubmit}
                fullWidth
                variant="outlined"
              >
                ВЛЕЗ
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
