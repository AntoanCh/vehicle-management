import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import ErrorDialog from "../components/ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

//Material UI Imports
import { ListItemIcon } from "@mui/material";

//Icons Imports
import { AccountCircle, Send } from "@mui/icons-material";

const VehicleRecords = ({ vehicle, userRole, username, records }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleCloseError = () => {
    setError([false, ""]);
  };
  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";
  // "rgba(244, 255, 233, 1)"
  const data = useMemo(() => {
    return records.data.map((obj, index) => {
      return {
        id: index,
        driver: obj.driverName,
        pickupTime: obj.pickupTime,
        dropoffTime: obj.dropoffTime,
        pickupKm:
          obj.pickupKm.toString().slice(0, -3) +
          " " +
          obj.pickupKm.toString().slice(-3),
        dropoffKm: obj.dropoffKm
          ? obj.dropoffKm.toString().slice(0, -3) +
            " " +
            obj.dropoffKm.toString().slice(-3)
          : "в движение",
        destination: obj.destination ? obj.destination : "в движение",
        problem: obj.problem,
      };
    });
  }, []);

  //
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      {
        accessorKey: "driver",
        header: "Водач",
        size: 150,
        editable: false,
      },
      {
        accessorKey: "pickupTime",
        header: "Тръгване",
        size: 150,
        // valueFormatter: (value) => dayjs(value).format("DD.MM.YYYY - HH:mm"),
      },
      {
        accessorKey: "dropoffTime",
        header: "Връщане",
        size: 150,
        // valueFormatter: (value) => dayjs(value).format("DD.MM.YYYY - HH:mm"),
      },
      {
        accessorKey: "pickupKm",
        header: "Километри на тръгване",
        size: 160,
      },
      {
        accessorKey: "dropoffKm",
        header: "Километри на връщане",
        size: 160,
      },
      {
        accessorKey: "destination",
        header: "Маршрут",
        size: 160,
      },
      {
        accessorKey: "problems",
        header: "Забележки",
        size: 160,
      },
    ],
    []
  );

  //

  // const columns = [
  //   {
  //     name: "Шофьор",
  //   },
  //   {
  //     name: "Тръгване",
  //     options: {
  //       sortDirection: "desc",
  //       customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
  //       filterOptions: {
  //         logic: (date, filters, row) => {
  //           console.log(date);
  //           if (filters.length) return !date.includes(filters);
  //         },
  //         names: records.data
  //           ? records.data
  //               .map((rec) => dayjs(rec.pickupTime).format("DD/MM/YYYY"))
  //               .filter((rec, index, records) => records.indexOf(rec) === index)
  //           : [],
  //       },
  //     },
  //   },
  //   {
  //     name: "Връщане",
  //     options: {
  //       customBodyRender: (value) =>
  //         value ? dayjs(value).format("DD/MM/YYYY - HH:mm") : "в движение",
  //     },
  //   },
  //   {
  //     name: "Километри на тръгване",
  //     options: {
  //       filter: false,
  //     },
  //   },
  //   {
  //     name: "Километри на връщане",
  //     options: {
  //       filter: false,
  //     },
  //     customBodyRender: (value) => (value ? value : "в движение"),
  //   },
  //   {
  //     name: "Маршрут",
  //     options: {
  //       customBodyRender: (value) => (value ? value : "в движение"),
  //     },
  //   },
  //   {
  //     name: "Забележки",
  //     options: {},
  //   },
  // ];
  const options = {
    filterType: "dropdown",
    selectableRows: false,
    download: false,
    print: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 100],

    textLabels: {
      body: {
        noMatch: "Нищо не е намерено",
      },
      pagination: {
        next: "Следваща страница",
        previous: "Предишна страница",
        rowsPerPage: "Покажи по:",
        displayRows: "от", // 1-10 of 30
      },
      toolbar: {
        search: "Търсене",
        downloadCsv: "Изтегли CSV",
        print: "Принтирай",
        viewColumns: "Показване на колони",
        filterTable: "Филтри",
      },
      filter: {
        title: "ФИЛТРИ",
        reset: "изчисти",
      },
      viewColumns: {
        title: "Покажи колони",
      },
      selectedRows: {
        text: "rows(s) deleted",
        delete: "Delete",
      },
    },
  };
  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowSelection: true,
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

        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ backgroundColor: "white" }}>
            <MaterialReactTable
              table={table}
              localization={MRT_Localization_BG}
            />
          </Box>
          // <div className="my-4">
          //   <MUIDataTable
          //     title={"ДВИЖЕНИЕ"}
          //     data={data}
          //     columns={columns}
          //     options={options}
          //   />
          // </div>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default VehicleRecords;
