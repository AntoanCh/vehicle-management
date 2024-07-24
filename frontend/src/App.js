import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateVehicle from "./pages/CreateVehicle.jsx";
import ShowVehicle from "./pages/ShowVehicle.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Office from "./pages/Office.jsx";
import Warehouse from "./pages/Warehouse.jsx";
import VehiclesMain from "./pages/VehiclesMain.jsx";
import Users from "./pages/Users.jsx";
import Sites from "./pages/Sites.jsx";
import "./App.css";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import HeaderMenu from "./components/HeaderMenu.jsx";

function App() {
  return (
    <Box sx={{ display: "flex" }} className="bg-gray-500">
      <CssBaseline />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <HeaderMenu />
          {/* <Header /> */}
          <Box
            sx={{
              margin: "auto",
              width: "100%",
              marginTop: "4%",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<Users />} />
              <Route path="/sites" element={<Sites />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/office" element={<Office />} />
              <Route path="/vehicles" element={<VehiclesMain />} />
              <Route path="/vehicles/create" element={<CreateVehicle />} />
              <Route path="/vehicles/details/:id" element={<ShowVehicle />} />
            </Routes>
          </Box>

          {/* <Footer /> */}
        </BrowserRouter>
      </LocalizationProvider>
      {/* </ThemeProvider> */}
    </Box>
  );
}

export default App;
