import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import dar_logo from "../resources/dar_logo.jpg";
import { Button } from "@mui/material";
import { Box } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
      const { status, user } = data;
      setUsername(user);

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
          <Box className="bg-white flex flex justify-between border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto">
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/vehicles")}
              className="flex items-center bg-blue-400 my-4 border-2 border-purple-400 rounded-xl w-[220px] justify-center"
            >
              <p className="text-4xl font-bold">АВТОПАРК</p>
            </Box>
            <Box className="flex items-center bg-purple-400 my-4 border-2 border-blue-400 rounded-xl w-[220px] justify-center">
              <p className="text-4xl font-bold">ЧОВЕШКИ РЕСУРСИ</p>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default Home;
