import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import CancelIcon from "@mui/icons-material/Cancel";
import TableRow from "@mui/material/TableRow";
import CountdownTimer from "../../components/utils/CountdownTimer";
import DropOff from "./DropOff";
import Pickup from "../../components/vehicles/Pickup";
import Clock from "../../components/utils/Clock";
import ErrorDialog from "../../components/utils/ErrorDialog";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const Scan = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });

  const [error, setError] = useState({ show: false, message: "" });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [barcode, setBarcode] = useState("");
  // const [error, setError] = useState({ show: false, message: "" });
  const [driver, setDriver] = useState({});
  const [dropoff, setDropoff] = useState({});
  const [blur, setBlur] = useState(false);
  const [select, setSelect] = useState({ show: false, vehicle: {} });
  const [secondDriver, setSecondDriver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [time, setTime] = useState(dayjs());
  const [stopTimer, setStopTimer] = useState(true);
  const [loadingSites, setLoadingSites] = useState(true);
  const [sites, setSites] = useState({});
  const [selectedSite, setSelectedSite] = useState("");

  const handleChange = (e) => {
    setBarcode(e.target.value);
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/client-ip")
      .then((res) => res.json())
      .then((data) => console.log(data.ip));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!sites.length) {
        setLoadingSites(true);
      }
      // else {
      //   setIsRefetching(true);
      // }

      try {
        const res = await axios.get("http://192.168.0.147:5555/api/sites");
        setSites(res.data.data.filter((item) => item.hasVehicles));
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }
      setLoadingSites(false);
      // setIsRefetching(false);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (!vehicles.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get("http://192.168.0.147:5555/api/vehicle");
        setVehicles(
          res.data.data
            .filter((item) => item.site === "БОРСА")
            .sort((a, b) => {
              if (a.occupied.status && !b.occupied.status) {
                return 1;
              } else if (!a.occupied.status && b.occupied.status) {
                return -1;
              } else if (a.occupied.status && b.occupied.status) {
                if (a.occupied.time < b.occupied.time) {
                  return 1;
                } else {
                  return -1;
                }
              } else if (!a.occupied.status && !b.occupied.status) {
                if (`${a.make} ${a.model}` > `${b.make} ${b.model}`) {
                  return 1;
                } else if (`${a.make} ${a.model}` === `${b.make} ${b.model}`) {
                  return 0;
                } else {
                  return -1;
                }
              } else {
                return 0;
              }
            }),
        );
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }
      setIsLoading(false);
      setIsRefetching(false);
    };

    fetchData();
    const interval = setInterval(() => {
      const refetchData = async () => {
        // if (!vehicles.length) {
        //   setIsLoading(true);
        // }

        try {
          const res = await axios.get("http://192.168.0.147:5555/api/vehicle");
          setVehicles(
            res.data.data
              .filter((item) => item.site === "ОФИС")
              .sort((a, b) => {
                if (a.occupied.status && !b.occupied.status) {
                  return 1;
                } else if (!a.occupied.status && b.occupied.status) {
                  return -1;
                } else if (a.occupied.status && b.occupied.status) {
                  if (a.occupied.time < b.occupied.time) {
                    return 1;
                  } else {
                    return -1;
                  }
                } else if (!a.occupied.status && !b.occupied.status) {
                  if (`${a.make} ${a.model}` > `${b.make} ${b.model}`) {
                    return 1;
                  } else if (
                    `${a.make} ${a.model}` === `${b.make} ${b.model}`
                  ) {
                    return 0;
                  } else {
                    return -1;
                  }
                } else {
                  return 0;
                }
              }),
          );
        } catch (error) {
          setError({
            show: true,
            message: `Грешка при комуникация: ${error}`,
          });

          return;
        }
        setIsLoading(false);
        setIsRefetching(false);
      };

      refetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [driver, dropoff]);

  //This rerenders the whole component every second (this helps with barcode autofocus)
  // useEffect(() => {
  //   setTime(dayjs());
  // }, [dayjs()]);

  //Function for submitting the barcode
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcode) {
      setError({ show: true, message: "Не е сканирана карта" });
    } else {
      try {
        const { data } = await axios.get(
          `http://192.168.0.147:5555/api/drivers/barcode/${barcode}`,
        );

        const { status, message } = data;

        if (data.length !== 0) {
          if (data[0].occupied) {
            // setTimeout(() => {
            //   navigate(`/drop-off/${data[0]._id}`);
            // }, 400);
            setDropoff({ show: true, driver: data[0]._id });
          } else {
            setStopTimer(false);
            setDriver(data[0]);
          }
        } else {
          setError({
            show: true,
            message: "Шофьор с такъв номер не съществува",
          });
        }
      } catch (error) {
        setError({ show: true, message: `Грешка: ${error}` });
      }
      setBarcode("");
    }
  };

  const handleClick = (vehicle) => {
    setSelect({ show: true, vehicle: { ...vehicle } });
  };

  const handleSecondDriver = async (vehicle) => {
    try {
      const res = await axios.get(
        `http://192.168.0.147:5555/api/records/vehicle/${vehicle._id}`,
      );

      const record = res.data.data.filter((rec) => !rec.dropoffTime)[0];
      // navigate(`/drop-off/${record.driverId}`, {
      //   state: { id: 1, secondDriver: driver.firstName },
      // });
      setDropoff({ show: true, driver: driver._id });
    } catch (error) {
      setError({ show: true, message: `Грешка: ${error}` });
    }
  };
  const handleChangeTab = (event, newValue) => {
    setSelectedSite(newValue);
    console.log(selectedSite);
  };
  //MRT
  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#212121" : "#fff";

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.make} ${row.model}`,
        id: "model",
        header: "Марка/модел",
        size: 200,
      },
      {
        accessorKey: "reg",
        header: "Номер",
        size: 200,
        Cell: ({ cell }) =>
          cell
            .getValue()
            .split(/(\d{4})/)
            .join(" ")
            .trim(),
      },
      {
        accessorFn: (row) => row.occupied.user,
        id: "user",
        header: "Водач",
        size: 200,
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
      },
      {
        accessorFn: (row) => row.occupied.time,
        id: "time",
        header: "Време на тръгване",
        muiTableHeadCellProps: { align: "right" },
        muiTableBodyCellProps: { align: "right" },
        size: 200,
        Cell: ({ cell }) =>
          cell.getValue()
            ? `${dayjs(cell.getValue()).format("DD/MM/YY - HH:mm")}`
            : "",
      },
    ],
    [refresh],
  );
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: vehicles,
    rowCount,
    enableFullScreenToggle: false,
    enableBottomToolbar: false,
    // enableTopToolbar: false,
    enableGlobalFilter: false,
    enableColumnFilters: false,
    enableStickyHeader: false,
    enableFacetedValues: false,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnResizing: false,
    enableRowPinning: false,
    enableRowActions: false,
    enablePagination: false,
    enableSorting: false,

    muiTableContainerProps: { sx: { maxWidth: "100%" } },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ minWidth: "100%" }}>
        {" "}
        <form action="">
          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              // onFocus={() => setBlur(false)}
              inputRef={(input) =>
                dropoff.show ? input : input && input.focus()
              }
              error={blur}
              autoFocus
              autoComplete="off"
              fullWidth
              id="barcode"
              name="barcode"
              label="Баркод:"
              variant="filled"
              value={barcode}
              onChange={handleChange}
              size="small"
            />
            <Button
              sx={{ maxWidth: "10%" }}
              type="submit"
              onClick={handleSubmit}
              fullWidth
              color={blur ? "error" : "primary"}
              variant="contained"
            >
              <DoubleArrowIcon />
            </Button>
          </Box>
        </form>
        <Box sx={{ display: "flex" }}>
          {driver._id && (
            <>
              <Button
                onClick={() => {
                  setStopTimer(true);
                  setSecondDriver(false);
                  setDriver({});
                }}
                sx={{
                  marginTop: "10px",
                  "& .MuiInputBase-input": {
                    fontSize: 18,
                    padding: 1,
                    fontWeight: 800,
                    textAlign: "center",
                    color: "black",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "black", //Adjust text color here
                  },
                }}
                color="error"
                variant="contained"
              >
                <CancelIcon />
              </Button>
              <CountdownTimer
                initialSeconds={60}
                stop={stopTimer}
                driver={driver}
                setDriver={setDriver}
                setSecondDriver={setSecondDriver}
                setSelect={setSelect}
              />
            </>
          )}

          <TextField
            sx={{
              marginTop: "10px",
              "& .MuiInputBase-input": {
                fontSize: 18,
                padding: 1,

                fontWeight: 800,
                textAlign: "center",
                color: "black",
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor:
                  theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
              },
            }}
            fullWidth
            variant="filled"
            size="small"
            disabled
            value={driver._id ? `${driver.firstName} ${driver.lastName}` : ""}
          ></TextField>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Clock />

          {driver._id && (
            <Box sx={{ display: "flex", width: "70%" }}>
              <TextField
                sx={{
                  marginTop: "10px",
                  height: "38px",
                  width: "50%",
                  "& .MuiInputBase-input": {
                    padding: 1,
                    fontWeight: 800,
                    textAlign: "center",
                    color: "black",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor:
                      theme.palette.mode === "dark" ? "white" : "black", //Adjust text color here
                  },
                }}
                variant="filled"
                disabled
                size="small"
                value="ИЗБЕРЕТЕ АВТОМОБИЛ"
              ></TextField>

              <Button
                variant="contained"
                onClick={() => setSecondDriver(!secondDriver)}
                color={secondDriver ? "primary" : "warning"}
                // size="small"
                sx={{
                  marginTop: "10px",
                  height: "38px",
                  width: "50%",
                  fontWeight: 800,
                }}
              >
                {secondDriver
                  ? "ВЗЕМЕТЕ АВТОМОБИЛ"
                  : "ВЪРНЕТЕ АВТОМОБИЛ ВЗЕТ ОТ ДРУГ ВОДАЧ"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    ),
    muiTableBodyRowProps: ({ isDetailPanel, row, table }) => {
      if (row.original.occupied) {
        if (driver._id && !secondDriver && !row.original.occupied.status) {
          return {
            onClick: (event) => {
              handleClick(row.original);
            },
            sx: (theme) => ({
              backgroundColor: lighten(theme.palette.primary.main, 0.2),
              cursor: "pointer",
            }),
          };
        } else if (driver._id && secondDriver && row.original.occupied.status) {
          return {
            onClick: (event) => {
              handleSecondDriver(row.original);
            },
            sx: (theme) => ({
              backgroundColor: "grey",
              cursor: "pointer",
            }),
          };
        } else if (row.original.occupied.status) {
          return {
            sx: (theme) => ({
              backgroundColor: "grey",
            }),
            hover: false,
          };
        } else {
          return {
            sx: (theme) => ({
              backgroundColor: theme.palette.primary.main,
            }),
            hover: false,
          };
        }
      }
    },
    muiTableBodyCellProps: ({ row }) => ({
      sx: {
        fontWeight: 800,
        fontSize: 16,
        color: "black",
      },
    }),
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
    },
    initialState: {
      sorting: [{ id: "time", desc: true }],
      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: false,
      showColumnFilters: false,
      density: "compact",
      positionToolbarAlertBanner: "bottom",
    },
    paginationDisplayMode: "pages",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [30, 50, 100, 200],
      shape: "rounded",
      variant: "outlined",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },

    mrtTheme: (theme) => ({
      baseBackgroundColor:
        theme.palette.mode === "dark"
          ? baseBackgroundColor
          : darken(baseBackgroundColor, 0.2),
      draggingBorderColor: theme.palette.secondary.main,
    }),
  });

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {select.show && (
        <Pickup
          open={select.show}
          vehicle={select.vehicle}
          driver={driver}
          setDriver={setDriver}
          setLoading={setLoading}
          setSelect={setSelect}
          setError={setError}
        />
      )}

      {dropoff.show && (
        <DropOff
          theme={theme}
          baseBackgroundColor={baseBackgroundColor}
          dropoff={dropoff}
          setDropoff={setDropoff}
          setError={setError}
        />
      )}

      <ErrorDialog error={error} setError={setError} />
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={selectedSite}
        onChange={handleChangeTab}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {sites.length &&
          sites.map((item) => <Tab label={item.name} value={item.name} />)}

        {/* <Tab label="ОФИС" />
        <Tab label="СКЛАД" />
        <Tab label="345" />
        <Tab label="СЕРВИЗ" /> */}
      </Tabs>

      <Box
        sx={{
          width: "80%",
          margin: "auto",
        }}
      >
        {/* 

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Модел</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="left">
                  Номер
                </TableCell>

                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Водач
                </TableCell>

                <TableCell sx={{ fontWeight: 800 }} align="right">
                  Време на тръгване
                </TableCell>
              </TableRow>
            </TableHead>
            {vehicles &&
              vehicles
                .sort((a, b) => {
                  if (a.occupied.status && !b.occupied.status) {
                    return 1;
                  } else if (!a.occupied.status && b.occupied.status) {
                    return -1;
                  } else if (a.occupied.status && b.occupied.status) {
                    if (a.occupied.time < b.occupied.time) {
                      return 1;
                    } else {
                      return -1;
                    }
                  } else if (!a.occupied.status && !b.occupied.status) {
                    if (`${a.make} ${a.model}` > `${b.make} ${b.model}`) {
                      return 1;
                    } else if (
                      `${a.make} ${a.model}` === `${b.make} ${b.model}`
                    ) {
                      return 0;
                    } else {
                      return -1;
                    }
                  } else {
                    return 0;
                  }
                })
                .map((vehicle, index) => (
                  <TableBody key={index}>
                    <TableRow
                      onClick={
                        driver._id && !secondDriver && !vehicle.occupied.status
                          ? () => handleClick(vehicle)
                          : driver._id &&
                            secondDriver &&
                            vehicle.occupied.status
                          ? () => handleSecondDriver(vehicle)
                          : undefined
                      }
                      key={index}
                      sx={[
                        driver._id && !secondDriver && !vehicle.occupied.status
                          ? {
                              backgroundColor: "#53c4f7",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "#29b6f6",
                              },
                            }
                          : driver._id &&
                            secondDriver &&
                            vehicle.occupied.status
                          ? {
                              backgroundColor: "#9e9e9e",
                              "&:hover": {
                                boxShadow: 6,
                                cursor: "pointer",
                                backgroundColor: "grey",
                              },
                            }
                          : vehicle.occupied.status
                          ? {
                              backgroundColor: "grey",
                            }
                          : { backgroundColor: "#29b6f6" },
                      ]}
                    >
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        component="th"
                        scope="row"
                      >
                        {`${vehicle.make} ${vehicle.model}`}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        align="left"
                      >
                        {vehicle.reg
                          .split(/(\d{4})/)
                          .join(" ")
                          .trim()}
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 18 }}
                        align="right"
                      >
                        {vehicle.occupied.user}
                      </TableCell>

                      <TableCell
                        sx={{ fontWeight: 800, fontSize: 20 }}
                        align="right"
                      >
                        {vehicle.occupied.status
                          ? dayjs(vehicle.occupied.time).format(
                              "DD/MM/YYYY - HH:mm"
                            )
                          : ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
          </Table>
        </TableContainer> */}

        <MaterialReactTable table={table} />
      </Box>
    </Box>
  );
};

export default Scan;
