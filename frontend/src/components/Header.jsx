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

const Header = () => {
  const [tab, setTab] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://localhost:5555/", { token });
      const { status, user, role } = data;
      setUsername(user);
      setUserRole(role);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
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

  return (
    <div className="flex justify-between bg-gray-300">
      <div className="px-2 py-2">
        <Button
          sx={{ margin: "auto" }}
          variant="outlined"
          component={Link}
          to="/vehicle/create"
        >
          {"НОВ"}
          <AddCircleOutlineIcon />
        </Button>
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
        <p className="px-2 py-2">
          <PersonIcon />
          {username}
        </p>

        {token ? (
          <Button onClick={Logout} variant="outlined">
            Изход
            <LogoutIcon />
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Header;
