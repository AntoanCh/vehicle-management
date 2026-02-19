import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowVehicle from "./pages/vehicles/ShowVehicle.jsx";
import PersonCard from "./pages/hr/PersonCard.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Scan from "./pages/vehicles/Scan.jsx";
import Charts from "./components/vehicles/Charts.jsx";
import Records from "./components/vehicles/Records.jsx";
import DropOff from "./pages/vehicles/DropOff.jsx";
import DriversList from "./components/vehicles/drivers/DriversList.jsx";
import Settings from "./pages/Settings.jsx";
import Hr from "./pages/hr/Hr.jsx";
import CreatePerson from "./components/hr/CreatePerson.jsx";
import VehiclesMain from "./pages/vehicles/VehiclesMain.jsx";
import UsersList from "./components/UsersList.jsx";
import SitesList from "./components/hr/SitesList.jsx";
import "./App.css";
import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "./components/Header.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/bg";
import Box from "@mui/material/Box";
import HeaderMenu from "./components/HeaderMenu.jsx";
import { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material";
import { bgBG } from "@mui/material/locale";

import {
  createTheme,
  ThemeProvider,
  useColorScheme,
} from "@mui/material/styles";

function App() {
  const [filter, setFilter] = React.useState("all");
  const [customFilter, setCustomFilter] = useState("РЕМОНТ");
  const [showExpense, setShowExpense] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [expenseWithTax, setExpenseWithTax] = useState(true);
  //Get clients local IP address
  // const [localIp, setLocalIp] = useState("");

  // useEffect(() => {
  //   const getLocalIP = async () => {
  //     const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;

  //     const pc = new RTCPeerConnection({
  //       iceServers: [{ urls: "192.168.0.147:5555" }],
  //     });

  //     pc.createDataChannel("");

  //     pc.createOffer().then((offer) => pc.setLocalDescription(offer));

  //     pc.onicecandidate = (ice) => {
  //       console.log(ice);
  //       if (ice && ice.candidate && ice.candidate.candidate) {
  //         const ipMatch = ipRegex.exec(ice.candidate.candidate);
  //         if (ipMatch) {
  //           setLocalIp(ipMatch[0]);
  //           pc.onicecandidate = null;
  //         }
  //       }
  //     };
  //   };

  //   getLocalIP();
  //   console.log("🚀 ~ App ~ localIp:", localIp);
  // }, []);

  useEffect(() => {
    if (localStorage.getItem("darkTheme") === "true") {
      setDarkTheme(true);
    }
  }, []);
  const theme = createTheme({
    palette: {
      mode: darkTheme ? "dark" : "light",

      background: {
        default: "#222222",
      },
      tertiary: {
        main: "#FFE461",
        dark: "#FED047",
        light: "#FFEC92",
      },
    },
  });

  const themeLight = createTheme({
    ...theme,
    palette: {
      mode: darkTheme ? "dark" : "light",
      background: {
        default: "#bdbdbd",
      },
    },
  });
  const themeDark = createTheme({
    ...theme,
    palette: {
      mode: darkTheme ? "dark" : "light",
      background: {
        default: "#424242",
      },
    },
  });

  return (
    <ThemeProvider
      theme={darkTheme ? createTheme(themeDark, bgBG) : createTheme(themeLight)}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
          <BrowserRouter>
            <HeaderMenu setDarkTheme={setDarkTheme} darkTheme={darkTheme} />

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
                <Route path="/users" element={<UsersList />} />
                <Route path="/sites" element={<SitesList />} />
                <Route path="/hr" element={<Hr />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/records" element={<Records />} />
                <Route path="/drop-off/:id" element={<DropOff />} />
                <Route path="/drivers" element={<DriversList />} />
                <Route path="/hr/create" element={<CreatePerson />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/vehicles"
                  element={
                    <VehiclesMain
                      customFilter={customFilter}
                      setCustomFilter={setCustomFilter}
                      filter={filter}
                      setFilter={setFilter}
                      showExpense={showExpense}
                      setShowExpense={setShowExpense}
                      expenseWithTax={expenseWithTax}
                      setExpenseWithTax={setExpenseWithTax}
                    />
                  }
                />
                <Route path="/vehicles/details/:id" element={<ShowVehicle />} />
                <Route path="/people/details/:id" element={<PersonCard />} />
              </Routes>
            </Box>
          </BrowserRouter>
        </LocalizationProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
