import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MUIDataTable from "mui-datatables";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { bgBG } from "@mui/x-data-grid/locales";
import Box from "@mui/material/Box";
import ErrorDialog from "../components/ErrorDialog";

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

  const data = records.data.map((obj, index) => {
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

  //
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "driver",
      headerName: "Водач",
      width: 150,
      editable: false,
    },
    {
      field: "pickupTime",
      headerName: "Тръгване",
      width: 150,
      valueFormatter: (value) => dayjs(value).format("DD.MM.YYYY - HH:mm"),
    },
    {
      field: "dropoffTime",
      headerName: "Връщане",
      width: 150,
      valueFormatter: (value) => dayjs(value).format("DD.MM.YYYY - HH:mm"),
    },
    {
      field: "pickupKm",
      headerName: "Километри на тръгване",
      width: 160,
    },
    {
      field: "dropoffKm",
      headerName: "Километри на връщане",
      width: 160,
    },
    {
      field: "destination",
      headerName: "Маршрут",
      width: 160,
    },
    {
      field: "problems",
      headerName: "Забележки",
      width: 160,
    },
  ];

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
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
        <ErrorDialog error={error} setError={setError} />

        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ backgroundColor: "white" }}>
            <DataGrid
              initialState={{
                sorting: {
                  sortModel: [{ field: "pickupTime", sort: "desc" }],
                },
              }}
              localeText={bgBG.components.MuiDataGrid.defaultProps.localeText}
              rows={data}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
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
    </div>
  );
};

export default VehicleRecords;
