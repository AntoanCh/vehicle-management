import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateVehicle from "./pages/CreateVehicle.jsx";
import ShowVehicle from "./pages/ShowVehicle.jsx";
import PersonCard from "./pages/PersonCard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Office from "./pages/Office.jsx";
import Scan from "./pages/Scan.jsx";
import Charts from "./pages/Charts.jsx";
import Records from "./pages/Records.jsx";
import DropOff from "./pages/DropOff.jsx";
import Drivers from "./pages/Drivers.jsx";
import Warehouse from "./pages/Warehouse.jsx";
import Hr from "./pages/Hr.jsx";
import CreatePerson from "./pages/CreatePerson.jsx";
import VehiclesMain from "./pages/VehiclesMain.jsx";
import Users from "./pages/Users.jsx";
import Sites from "./pages/Sites.jsx";
import "./App.css";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import HeaderMenu from "./components/HeaderMenu.jsx";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import {
  createTheme,
  ThemeProvider,
  useColorScheme,
} from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    // mode: "dark",
    secondary: {
      main: "#E33E7F",
    },
  },
});

function App() {
  const [filter, setFilter] = React.useState("all");
  // const { mode, setMode } = useColorScheme();
  // if (!mode) {
  //   return null;
  // }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                <Route path="/hr" element={<Hr />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/records" element={<Records />} />
                <Route path="/drop-off/:id" element={<DropOff />} />
                <Route path="/drivers" element={<Drivers />} />
                <Route path="/hr/create" element={<CreatePerson />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/office" element={<Office />} />
                <Route
                  path="/vehicles"
                  element={
                    <VehiclesMain filter={filter} setFilter={setFilter} />
                  }
                />
                <Route path="/vehicles/details/:id" element={<ShowVehicle />} />
                <Route path="/people/details/:id" element={<PersonCard />} />
              </Routes>
            </Box>

            <Footer />
          </BrowserRouter>
        </LocalizationProvider>
        {/* </ThemeProvider> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
