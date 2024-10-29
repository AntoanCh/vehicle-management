import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import dar_logo from "../resources/dar_logo.jpg";
import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";

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
            <Grid container spacing={2}>
              {" "}
              <Grid item xs={6}>
                <Box sx={{ height: "100%" }}>
                  <BigButton
                    onClick={() => navigate("/vehicles")}
                    fullWidth
                    variant="contained"
                  >
                    АВТОМОБИЛИ
                  </BigButton>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{}}>
                  <BigButton
                    disabled={
                      userRole.includes("it") || userRole.includes("admin")
                        ? false
                        : true
                    }
                    onClick={() =>
                      userRole.includes("it") || userRole.includes("admin")
                        ? navigate("/hr")
                        : ""
                    }
                    fullWidth
                    color="secondary"
                    variant="contained"
                  >
                    ИТ ТЕХНИКА
                  </BigButton>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{}}>
                  <BigButton
                    disabled={
                      userRole.includes("cool") || userRole.includes("admin")
                        ? false
                        : true
                    }
                    onClick={() =>
                      userRole.includes("cool") || userRole.includes("admin")
                        ? navigate("/hr")
                        : ""
                    }
                    fullWidth
                    color="secondary"
                    variant="contained"
                  >
                    ХЛАДИЛНА ТЕХНИКА
                  </BigButton>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{}}>
                  <BigButton
                    disabled={
                      userRole.includes("hr") || userRole.includes("admin")
                        ? false
                        : true
                    }
                    onClick={() =>
                      userRole.includes("hr") || userRole.includes("admin")
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
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Home;
