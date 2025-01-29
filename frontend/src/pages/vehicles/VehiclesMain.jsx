import React, { useEffect, useState } from "react";
import axios from "axios";
import VehiclesList from "../../components/vehicles/VehiclesList.jsx";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const VehiclesMain = ({
  filter,
  setFilter,
  customFilter,
  setCustomFilter,
  showExpense,
  setShowExpense,
  expenseWthTax,
  setExpenseWithTax,
}) => {
  const [userRole, setUserRole] = useState([]);
  const [username, setUsername] = useState();
  const [expenseDate, setExpenseDate] = useState(dayjs());
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

  return (
    <VehiclesList
      username={username}
      userRole={userRole}
      setUsername={setUsername}
      setUserRole={setUserRole}
      filter={filter}
      setFilter={setFilter}
      customFilter={customFilter}
      setCustomFilter={setCustomFilter}
      showExpense={showExpense}
      setShowExpense={setShowExpense}
      expenseWthTax={expenseWthTax}
      setExpenseWithTax={setExpenseWithTax}
      expenseDate={expenseDate}
      setExpenseDate={setExpenseDate}
    />
  );
};

export default VehiclesMain;
