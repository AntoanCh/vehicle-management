import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const Header = () => {
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editUser, setEditUser] = useState({});
  const token = localStorage.getItem("token");
  const [showProfile, setShowProfile] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
      const { status, user, role, id } = data;
      setUsername(user);
      setUserRole(role);
      setUserId(id);
      setEditUser({
        _id: id,
        username: user,
        role: role,
        password: "",
      });
      return status
        ? toast(`${user}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        : (localStorage.removeItem("token"), navigate("/login"));
    };
    verifyUser();
  }, [token, navigate]);
  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleClick = (e) => {
    setTab(e.target.id);
  };

  const location = useLocation().pathname;
  useEffect(() => {
    if (location === "/vehicles") {
      setTab("vehicles");
    } else if (location === "/warehouse") {
      setTab("warehouse");
    }
  }, []);
  const handleProfile = () => {
    setShowProfile(true);
  };
  const handleClose = () => {
    setShowProfile(false);
  };
  const handleChange = (e) => {
    editUser
      ? setEditUser({ ...editUser, password: e.target.value })
      : setEditUser("asd");
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/auth/updatepswrd",
        {
          ...editUser,
        }
      );
      const { status, message } = data;

      setShowProfile(false);
      setEditUser({ ...editUser, password: "" });
      setAlert(true);
    } catch (error) {
      console.log(error);
    }
    setShowProfile(false);
    setEditUser({ ...editUser, password: "" });
  };
  return (
    <>
      <div className="flex justify-between bg-gray-300">
        <Dialog
          open={showProfile}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{username}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description"></DialogContentText>
            <div>
              <span>ID: </span>
              <span>{userId}</span>
            </div>

            <div className="my-2">
              <TextField
                fullWidth
                type="password"
                name="password"
                id="password"
                label="Нова Парола:"
                variant="filled"
                value={editUser.password}
                onChange={handleChange}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              variant="contained"
              onClick={handleClose}
              autoFocus
            >
              Отказ
            </Button>
            <Button variant="contained" onClick={handleUpdate} autoFocus>
              Обнови
            </Button>
          </DialogActions>
        </Dialog>

        <div className="px-2 py-2">
          {userRole === "user" || !userRole ? (
            ""
          ) : (
            <Button
              sx={{ margin: "auto" }}
              variant="outlined"
              component={Link}
              to="/vehicles/create"
            >
              {"ДОБАВИ АВТОМОБИЛ"}
              {/* <AddCircleOutlineIcon /> */}
              <TimeToLeaveIcon />
              {/* <AddIcon /> */}
            </Button>
          )}

          {userRole === "admin" ? (
            <Button
              sx={{ marginLeft: "3px" }}
              variant="outlined"
              component={Link}
              to="/users"
            >
              {"ПОТРЕБИТЕЛИ"}
              <PersonOutlineIcon />
            </Button>
          ) : (
            ""
          )}
        </div>

        <div>
          {" "}
          <ButtonGroup
            className="mt-2"
            variant="outlined"
            aria-label="Basic button group"
          >
            <Button
              variant={tab === "vehicles" ? "contained" : "outlined"}
              id="vehicles"
              onClick={handleClick}
              component={Link}
              to={"/vehicles"}
            >
              ВСИЧКИ
            </Button>
            <Button
              variant={tab === "office" ? "contained" : "outlined"}
              id="office"
              onClick={handleClick}
              component={Link}
              to={"/office"}
            >
              ОФИС
            </Button>
            <Button
              variant={tab === "warehouse" ? "contained" : "outlined"}
              id="warehouse"
              onClick={handleClick}
              component={Link}
              to={"/warehouse"}
            >
              СКЛАД
            </Button>
            {/* <Button>Three</Button> */}
          </ButtonGroup>
        </div>
        <div className="px-2 py-2 flex">
          <p
            className="px-2 py-2"
            style={{ cursor: "pointer" }}
            onClick={handleProfile}
          >
            <PersonIcon />
            {username}
          </p>

          {token ? (
            <Button onClick={Logout} variant="outlined" size="small">
              Изход
              <LogoutIcon />
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <Collapse in={alert}>
        <Alert
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Паролата е сменена успешно!
        </Alert>
      </Collapse>
    </>
  );
};

export default Header;
