import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, MenuItem, TextField } from "@mui/material";

const Login = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    axios
      .get("http://192.168.0.147:5555/users")
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
  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
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
          navigate("/vehicles");
        }, 400);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInput({
      ...input,
      username: "",
      password: "",
    });
  };

  return (
    <div className="flex justify-center">
      <div>
        <h2 className="text-2xl text-center"> Вход Потребител</h2>
        <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto">
          <div className="my-4">
            <TextField
              fullWidth
              name="username"
              select
              label="Потребител:"
              value={username}
              onChange={handleChange}
              variant="filled"
            >
              {users
                ? users.map((e, index) => (
                    <MenuItem key={index} value={e}>
                      {e}
                    </MenuItem>
                  ))
                : ""}
            </TextField>
          </div>
          <div className="my-4">
            <TextField
              type="password"
              fullWidth
              name="password"
              label="Парола:"
              value={password}
              onChange={handleChange}
              variant="filled"
            />
          </div>
          <div className="my-4">
            <Button onClick={handleSubmit} fullWidth variant="outlined">
              ВЛЕЗ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
