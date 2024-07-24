// export default Register;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, MenuItem, TextField } from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
    role: "",
  });
  const { username, password, role } = input;
  const handleChange = (e) => {
    const { name, value, role } = e.target;
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
        "http://192.168.0.147:5555/auth/register",
        {
          ...input,
        }
      );
      const { status, message } = data;

      if (status) {
        handleSuccess(message);
        window.location.reload();
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
      role: "",
    });
  };
  return (
    <div className="flex justify-center">
      <div>
        <h2 className="text-2xl text-center"> Регистрация Потребител</h2>
        <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto">
          <div className="my-4">
            <TextField
              fullWidth
              name="username"
              label="Потребител:"
              value={username}
              onChange={handleChange}
              variant="filled"
            ></TextField>
          </div>
          <div className="my-4">
            <TextField
              fullWidth
              select
              name="role"
              label="Права:"
              value={role}
              onChange={handleChange}
              variant="filled"
            >
              <MenuItem key={1} value="user">
                USER
              </MenuItem>
              <MenuItem key={2} value="office">
                ОФИС ОТГОВОРНИК
              </MenuItem>
              <MenuItem key={3} value="warehouse">
                СКЛАД ОТГОВОРНИК
              </MenuItem>
              <MenuItem key={4} value="admin">
                ADMIN
              </MenuItem>
              <MenuItem key={5} value="hr">
                HR
              </MenuItem>
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
              ЗАПИШИ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
