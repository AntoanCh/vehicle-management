import axios from "axios";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import ErrorDialog from "../utils/ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import { Box } from "@mui/material";
import { Edit, Delete, DoneOutline, Add } from "@mui/icons-material";
import AddIssue from "./AddIssue";
import Tooltip from "@mui/material/Tooltip";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const Issues = ({ vehicle, userRole, username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
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
  const [issues, setissues] = useState([]);
  const [add, setAdd] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const handleClick = () => {
    setAdd(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!issues.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(
          `http://192.168.0.147:5555/api/problems/${vehicle._id}`
        );
        setissues(res.data.data);
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
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Дата",
        size: 180,
        enableGlobalFilter: false,
        filterVariant: "date",
        filterFn: "stringDateFn",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm");
        },
      },
      {
        accessorKey: "km",
        header: "Километри",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => cell.getValue().toLocaleString() + " км",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "driverName",
        header: "Водач",
        size: 200,
        editable: false,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "desc",
        header: "Забележка",
        size: 450,
        enableColumnFilter: false,
      },
      {
        accessorKey: "doneByUser",
        header: "Завършен от",
        size: 150,
        enableColumnFilter: false,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "doneDate",
        header: "Завършен на",
        size: 180,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return cell.getValue()
            ? dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm")
            : "";
        },
      },
    ],
    [refresh]
  );
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: issues,
    rowCount,
    filterFns: {
      stringDateFn: (row, id, filterValue) => {
        return dayjs(row.original[id])
          .format("DD.MM.YYYY")
          .includes(dayjs(filterValue).format("DD.MM.YYYY"));
      },
    },
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableFacetedValues: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableHiding: false,
    enableColumnResizing: true,
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        {!row.original.done && (
          <Tooltip title="Отбележи проблема като завършен" disableInteractive>
            <IconButton
              color="success"
              onClick={() => {
                axios
                  .put(
                    `http://192.168.0.147:5555/api/problems/${row.original._id}`,
                    {
                      ...row.original,
                      done: true,
                      doneDate: dayjs(),
                      doneByUser: username,
                    }
                  )
                  .then((res) => {
                    if (issues.filter((item) => !item.done).length === 1) {
                      axios
                        .put(
                          `http://192.168.0.147:5555/api/vehicle/${vehicle._id}`,
                          {
                            ...vehicle,
                            issue: false,
                          }
                        )
                        .then((res) => {})
                        .catch((err) => {
                          setError({
                            show: true,
                            message: `Грешка при комуникация: ${err}`,
                          });
                        });
                    }
                    setAlert({
                      show: true,
                      message: `Забележка  ${row.original.desc}, от ${dayjs(
                        row.original.date
                      ).format("DD.MM.YYYY")} е отбелязана кати завършена!`,
                      severity: "success",
                    });
                    setTimeout(() => {
                      setRefresh(!refresh);
                    }, 500);
                  })
                  .catch((err) => {
                    setError({
                      show: true,
                      message: `Грешка при комуникация: ${err}`,
                    });
                  });
              }}
            >
              <DoneOutline />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    muiTableBodyRowProps: ({ isDetailPanel, row, table }) => {
      if (row.original.done) {
        return {
          sx: {
            textDecoration: "line-through",
          },
        };
      }
    },
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
    },
    initialState: {
      sorting: [
        {
          id: "date",
          desc: true,
        },
        // {
        //   id: "dropoffTime",
        //   desc: true,
        // },
      ],

      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      positionToolbarAlertBanner: "bottom",
    },
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
        <ErrorDialog error={error} setError={setError} />
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
        <AddIssue
          vehicle={vehicle}
          refresh={refresh}
          setRefresh={setRefresh}
          username={username}
          issues={issues}
          setError={setError}
          setIsLoading={setIsLoading}
          add={add}
          setAdd={setAdd}
          alert={alert}
          setAlert={setAlert}
          setErrorBanner={setErrorBanner}
          setIsRefetching={setIsRefetching}
        />

        <Box sx={{ marginY: "15px" }}>
          <Box
            sx={(theme) => ({
              backgroundColor: lighten(
                theme.palette.mode === "dark" ? "#212121" : "#fff",
                0.05
              ),
              display: "flex",
              gap: "0.5rem",
              p: "8px",
              justifyContent: "space-between",
            })}
          >
            <Box
              sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            ></Box>
            <Box>
              {(userRole.includes("admin") ||
                userRole.includes(vehicle.site)) &&
              !vehicle.sold ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  startIcon={<Add />}
                >
                  ДОБАВИ
                </Button>
              ) : (
                ""
              )}
            </Box>
          </Box>
          <MaterialReactTable table={table} />
        </Box>
      </LocalizationProvider>
    </Box>
  );
};

export default Issues;
