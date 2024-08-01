import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import dar_logo from "../resources/dar_logo.jpg";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

const BigButton = styled(Button)({
  fontWeight: 800,
  fontSize: 24,
  padding: 12,

  borderRadius: 4,
  minHeight: "100%",
});

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userRole, setuserRole] = useState("");
  const token = localStorage.getItem("token");

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
      setuserRole(role);

      return status
        ? // toast(`${user}`, {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     theme: "dark",
          //   })
          ""
        : (localStorage.removeItem("token"), navigate("/login"));
    };
    verifyUser();
  }, [token, navigate]);
  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <Box className="flex justify-center">
        <Box>
          <h2 className="text-2xl text-center">УПРАВЛЕНИЕ НА АКТИВИТЕ</h2>
          <Box
            sx={{ display: "flex", justifyContent: "space-between" }}
            className="bg-white  border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto"
          >
            <Box sx={{ minWidth: "50%" }}>
              <BigButton
                onClick={() => navigate("/vehicles")}
                fullWidth
                variant="contained"
              >
                АВТОПАРК
              </BigButton>
            </Box>
            <Box sx={{ width: "50%" }}>
              <BigButton
                disabled={
                  userRole === "hr" || userRole === "admin" ? false : true
                }
                onClick={() =>
                  userRole === "hr" || userRole === "admin"
                    ? navigate("/hr")
                    : ""
                }
                fullWidth
                color="secondary"
                variant="contained"
              >
                ЧОВЕШКИ РЕСУРСИ
              </BigButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default Home;
