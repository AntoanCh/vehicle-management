import React from "react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import dayjs from "dayjs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Edit, DeleteForever, Timeline } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useNavigate } from "react-router-dom";
import { darken, lighten, useTheme } from "@mui/material";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import Tooltip from "@mui/material/Tooltip";
import AddDriver from "./AddDriver";
import EditDriver from "./EditDriver";
import ErrorDialog from "../../utils/ErrorDialog";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import DeleteDriver from "./DeleteDriver";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const DriversList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [drivers, setDrivers] = useState({});
  const [error, setError] = useState({ show: false, message: "" });
  const [rowCount, setRowCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState({ show: false, driver: {} });
  const [add, setAdd] = useState(false);
  const [hist, setHist] = useState({ show: false, driver: {}, data: [] });
  const [verifyDelete, setVerifyDelete] = useState({ show: false, driver: {} });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    barcode: "",
    barcode2: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!drivers.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      // axios
      //   .get(`http://192.168.0.147:5555/api/drivers/`)
      //   .then((res) => {
      //     setDrivers(res.data.data);
      //     setRowCount(res.data.count);
      //   })
      //   .catch((err) => {
      //     setError({
      //       show: true,
      //       message: "Дата, описание, вид и стойност са задължителни полета",
      //     });

      //     return;
      //   });
      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/drivers/`);
        setDrivers(res.data.data);
        setRowCount(res.data.count);
      } catch {
        setError({
          show: true,
          message: "Дата, описание, вид и стойност са задължителни полета",
        });

        return;
      }
      setError({ show: false, message: "" });
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [refresh]);

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#212121" : "#fff";

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "name",
        header: "Име",
        size: 200,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "left",
        },
      },

      {
        accessorKey: "barcode",
        header: "Карта 1",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "barcode2",
        header: "Карта 2",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [refresh]
  );
  const { firstName, lastName, barcode, barcode2 } = input;

  //
  const handleLoading = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  const handleAddModal = () => {
    setAdd(true);
  };

  const handleDelete = () => {
    // axios.delete(`http://192.168.0.147/sites/${e}`)
  };

  const handleCloseHist = () => {
    setHist([false, {}, []]);
  };

  const columns2 = [
    {
      name: "Кола",
      options: {
        filter: false,
      },
    },
    {
      name: "Номер",
    },
    {
      name: "Тръгване",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
      },
    },
    {
      name: "Връщане",
      options: {
        customBodyRender: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY - HH:mm") : "в движение",
      },
    },
    {
      name: "Километри на тръгване",
      options: {
        filter: false,
        setCellProps: () => {
          return { align: "center" };
        },
      },
    },
    {
      name: "Километри на връщане",
      options: {
        filter: false,
        setCellProps: () => {
          return { align: "center" };
        },
      },
    },
    {
      name: "Маршрут",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
      },
    },
    {
      name: "Забележки",
      options: {},
    },
  ];
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: drivers,
    rowCount,
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableRowNumbers: true,
    enableRowActions: true,
    enableColumnResizing: true,
    enableRowPinning: false,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiToolbarAlertBannerProps: errorBanner.show
      ? {
          color: errorBanner.color,
          children: errorBanner.message,
        }
      : undefined,
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 150,
      },
    },
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [30, 50, 100, 200],
      shape: "rounded",
      variant: "outlined",
    },
    enableColumnResizing: true,
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
    },
    initialState: {
      sorting: [
        {
          id: "name",
          desc: false,
        },
      ],
      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <Box>
          <Tooltip title="Редактиране" disableInteractive>
            <IconButton
              onClick={() => {
                setEdit({ show: true, driver: row.original });
              }}
              color="warning"
              variant="contained"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Изтриване" disableInteractive>
            <IconButton
              onClick={() => {
                setVerifyDelete([true, row.original]);
              }}
              color="error"
              variant="contained"
            >
              <DeleteForever />
            </IconButton>
          </Tooltip>
          <Tooltip title="Движение" disableInteractive>
            <IconButton
              onClick={() => {
                axios
                  .get(
                    `http://192.168.0.147:5555/api/records/driver/${row.original._id}`
                  )
                  .then((res) => {
                    setHist({
                      show: true,
                      driver: row.original,
                      data: res.data,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              color="success"
              variant="contained"
            >
              <Timeline />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button fullWidth variant="contained" onClick={handleAddModal}>
          Добави Шофьор
          <PersonAddAlt1Icon />
        </Button>
      </Box>
    ),
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: lighten(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
      }),
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
  });

  return (
    <Box>
      {/* <Dialog
        open={verifyDelete[0]}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {`Сигурен ли сте, че искате да изтриете шофьор] ${verifyDelete[1].name} Тази операция е необратима`}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseDelete}
            autoFocus
          >
            ОТКАЗ
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              axios
                .delete(
                  `http://192.168.0.147:5555/api/drivers/${verifyDelete[1]._id}`
                )
                .then(() => {
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            autoFocus
          >
            ИЗТРИЙ
          </Button>
        </DialogActions>
      </Dialog> */}
      <DeleteDriver
        verifyDelete={verifyDelete}
        setVerifyDelete={setVerifyDelete}
        error={error}
        setError={setError}
      />
      <EditDriver edit={edit} setEdit={setEdit} />
      <Slide
        direction="down"
        in={alert.show}
        // in={true}
        sx={{
          position: "absolute",
          // left: "50%",
          zIndex: 2,
          width: "40%",
        }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          sx={{ margin: 0 }}
          onClick={() => {
            setAlert(false);
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      </Slide>
      <Dialog
        maxWidth={"lg"}
        open={hist.show}
        onClose={handleCloseHist}
        fullWidth
        // maxWidth={"xl"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`ИСТОРИЯ ${hist.driver.firstName} ${hist.driver.lastName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>

          <Box></Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseHist}
            autoFocus
          >
            Затвори
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorDialog error={error} setError={setError} />
      <AddDriver
        add={add}
        setAdd={setAdd}
        drivers={drivers}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
      />

      <Box>
        <Box sx={{ width: "99%", margin: "5px" }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
    </Box>
  );
};

export default DriversList;
