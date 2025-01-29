import React from "react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { Edit, DeleteForever, Timeline } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
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
} from "material-react-table";
import DriverRecords from "./DriverRecords";

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

  useEffect(() => {
    const fetchData = async () => {
      if (!drivers.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/drivers/`);
        setDrivers(res.data.data);
        setRowCount(res.data.count);
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

  const handleAddModal = () => {
    setAdd(true);
  };

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
                setVerifyDelete({ show: true, driver: row.original });
              }}
              color="error"
              variant="contained"
            >
              <DeleteForever />
            </IconButton>
          </Tooltip>
          <Tooltip title="Движение" disableInteractive>
            <IconButton
              onClick={async () => {
                await setHist({
                  show: true,
                  driver: row.original,
                  data: [],
                });
                // axios
                //   .get(
                //     `http://192.168.0.147:5555/api/records/driver/${row.original._id}`
                //   )
                //   .then((res) => {

                //   })
                //   .catch((err) => {
                //     console.log(err);
                //   });
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
          Добави водач
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

      <ErrorDialog error={error} setError={setError} />
      <DriverRecords hist={hist} setHist={setHist} />
      <AddDriver
        add={add}
        setAdd={setAdd}
        drivers={drivers}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
        setIsRefetching={setIsRefetching}
      />
      <EditDriver
        edit={edit}
        setEdit={setEdit}
        drivers={drivers}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
        setIsRefetching={setIsRefetching}
      />
      <DeleteDriver
        verifyDelete={verifyDelete}
        setVerifyDelete={setVerifyDelete}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
        setIsRefetching={setIsRefetching}
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
