import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateVehicle from "./pages/CreateVehicle.jsx";
import ShowVehicle from "./pages/ShowVehicle.jsx";
import DeleteVehicle from "./pages/DeleteVehicle.jsx";
import EditVehicle from "./pages/EditVehicle.jsx";
import Home from "./pages/Home.jsx";
import CarsHome from "./pages/CarsHome.jsx";
import TrucksHome from "./pages/TrucksHome.jsx";
import "./App.css";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header.jsx";
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
            <Route path="/trucks" element={<TrucksHome />} />
            <Route path="/cars" element={<CarsHome />} />
            <Route path="/vehicle/create" element={<CreateVehicle />} />
            <Route path="/vehicle/details/:id" element={<ShowVehicle />} />
            <Route path="/vehicle/edit/:id" element={<EditVehicle />} />
            <Route path="/vehicle/delete/:id" element={<DeleteVehicle />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
      {/* </ThemeProvider> */}
    </div>
  );
}

export default App;
