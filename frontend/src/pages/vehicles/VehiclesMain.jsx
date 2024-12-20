import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import VehiclesList from "../../components/vehicles/VehiclesList.jsx";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

const VehiclesMain = ({
  filter,
  setFilter,
  customFilter,
  setCustomFilter,
  showExpense,
  setShowExpense,
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState([]);
  const [username, setUsername] = useState();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
      const { status, user, role } = data;
      setUsername(user);
      setUserRole(role);
    };
    verifyUser();
  }, [token, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/vehicle")
      .then((res) => {
        setVehicles(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  return (
    <Box>
      {loading ? (
        <Skeleton variant="rectangular" width={1600} height={660} />
      ) : (
        <VehiclesList
          username={username}
          userRole={userRole}
          setUsername={setUsername}
          setUserRole={setUserRole}
          data={vehicles}
          filter={filter}
          setFilter={setFilter}
          customFilter={customFilter}
          setCustomFilter={setCustomFilter}
          showExpense={showExpense}
          setShowExpense={setShowExpense}
        />
      )}
    </Box>
  );
};

export default VehiclesMain;
