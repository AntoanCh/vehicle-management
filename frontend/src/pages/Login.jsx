import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, MenuItem, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Login = () => {
  const [users, setUsers] = useState();
  const [error, setError] = useState([false, ""]);
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

  const handleError = () => {
    setError(false, "");
  };

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.username || !input.password) {
      setError([true, "Въведете Потребител и Парола"]);
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
            navigate("/vehicles");
          }, 400);
        } else {
          setError([true, "Неправилна парола или потребителско име"]);
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
    <div className="flex justify-center">
      <div>
        <Dialog
          open={error[0]}
          onClose={handleError}
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
            <Button variant="contained" onClick={handleError} autoFocus>
              Добре
            </Button>
          </DialogActions>
        </Dialog>
        <h2 className="text-2xl text-center"> Вход Потребител</h2>
        <form action="">
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
                {users ? (
                  users.map((e, index) => (
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
              <Button
                type="submit"
                onClick={handleSubmit}
                fullWidth
                variant="outlined"
              >
                ВЛЕЗ
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
