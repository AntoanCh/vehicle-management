import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import ErrorDialog from "../../utils/ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import Chip from "@mui/material/Chip";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const DriverRecords = ({ userRole, username, hist, setHist }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, message: "" });
  const [records, setRecords] = useState([]);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!records.length) {
  //       setLoading(true);
  //     } else {
  //       setIsRefetching(true);
  //     }

  //     try {
  //       const res = await axios.get(
  //         `http://192.168.0.147:5555/api/records/driver/${hist.driver._id}`
  //       );
  //       setRecords(res.data.data);
  //       setRowCount(res.data.count);
  //     } catch {
  //       setError({ show: true, message: "Грешка при комуникация" });
  //       return;
  //     }

  //     setError({ show: false, message: "" });
  //     setLoading(false);
  //     setIsRefetching(false);
  //   };
  //   fetchData();
  // }, [hist.show]);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setHist({ show: false, driver: {}, data: [] });
  };

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#212121" : "#fff";

  //
  const columns = useMemo(
    () => [
      {
        accessorKey: "vehicleModel",
        header: "Автомобил",
        size: 200,
        editable: false,
        enableGlobalFilter: false,
        filterVariant: "select",
      },
      {
        accessorKey: "vehicleReg",
        header: "Номер",
        size: 200,
        editable: false,
        filterVariant: "select",
      },
      {
        accessorKey: "pickupTime",
        header: "Тръгване",
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
        accessorKey: "dropoffTime",
        header: "Връщане",
        filterVariant: "datetime",
        filterFn: "stringDateFn",
        size: 180,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return cell.getValue() ? (
            dayjs(cell.getValue()).format("DD.MM.YYYY - HH:mm")
          ) : (
            <Chip
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 10,
              }}
              label={"В ДВИЖЕНИЕ"}
              color="success"
            />
          );
        },
      },
      {
        accessorKey: "pickupKm",
        header: "Тръгване(км)",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => cell.getValue().toLocaleString() + " км",
        muiTableBodyCellProps: {
          align: "center",
        },
        Footer: ({ table }) => {
          const trips = table
            .getFilteredRowModel()
            .rows.map(
              (row) => row.getValue("dropoffKm") - row.getValue("pickupKm")
            )
            .reduce((trip, acc) => trip + acc, 0);
          console.log(trips);
          return (
            <Box sx={{ margin: "auto" }}>
              {"Изминати км:"}
              <Box color="warning.main">{`${trips} км.`}</Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "dropoffKm",
        header: "Връщане(км)",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            cell.getValue().toLocaleString() + " км"
          ) : (
            <Chip
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 10,
              }}
              label={"В ДВИЖЕНИЕ"}
              color="success"
            />
          ),
        muiTableBodyCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "destination",
        header: "Маршрут",
        size: 350,
        enableColumnFilter: false,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            cell.getValue()
          ) : (
            <Chip
              size="small"
              sx={{
                fontWeight: 800,
                fontSize: 10,
              }}
              label={"В ДВИЖЕНИЕ"}
              color="success"
            />
          ),
      },
      {
        accessorKey: "problem",
        header: "Забележки",
        size: 450,
        enableColumnFilter: false,
      },
    ],
    [hist]
  );
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: hist.data,
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
    enableStickyFooter: true,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableRowPinning: true,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    initialState: {
      sorting: [
        {
          id: "pickupTime",
          desc: true,
        },
        {
          id: "dropoffTime",
          desc: true,
        },
      ],
      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
    },
    positionToolbarAlertBanner: "bottom",
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
    paginationDisplayMode: "pages",
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
    <Dialog
      maxWidth={"xl"}
      open={hist.show}
      onClose={handleClose}
      // fullWidth
      // maxWidth={"xl"}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`ИСТОРИЯ ${hist.driver.firstName} ${hist.driver.lastName}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>

        <Box
        // sx={{ maxHeight: "80%" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
            <ErrorDialog error={error} setError={setError} />
            {handleLoading()}
            {loading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ backgroundColor: "white" }}>
                <MaterialReactTable table={table} />
              </Box>
            )}
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          variant="contained"
          onClick={handleClose}
          autoFocus
        >
          Затвори
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DriverRecords;
