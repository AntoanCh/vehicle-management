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
import "./App.css";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  //functions for dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <div className="bg-gray-500">
      {/* <ThemeProvider theme={theme}> */}
      <CssBaseline />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Users />} />
            <Route path="/warehouse" element={<Warehouse />} />
            <Route path="/office" element={<Office />} />
            <Route path="/vehicles" element={<VehiclesMain />} />
            <Route path="/vehicles/create" element={<CreateVehicle />} />
            <Route path="/vehicles/details/:id" element={<ShowVehicle />} />
            {/* <Route path="/vehicle/edit/:id" element={<EditVehicle />} />
            <Route path="/vehicle/delete/:id" element={<DeleteVehicle />} /> */}
          </Routes>
          {/* <Footer /> */}
        </BrowserRouter>
      </LocalizationProvider>
      {/* </ThemeProvider> */}
    </div>
  );
}

export default App;
