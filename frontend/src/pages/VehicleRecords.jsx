import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

  const data = records.data.map((obj) => {
    return [
      obj.driverName,
      obj.pickupTime,
      obj.dropoffTime,
      obj.pickupKm.toString().slice(0, -3) +
        " " +
        obj.pickupKm.toString().slice(-3),
      obj.dropoffKm
        ? obj.dropoffKm.toString().slice(0, -3) +
          " " +
          obj.dropoffKm.toString().slice(-3)
        : "в движение",
      obj.destination ? obj.destination : "в движение",
      obj.problem,
    ];
  });

  const columns = [
    {
      name: "Шофьор",
    },
    {
      name: "Тръгване",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
        filterOptions: {
          logic: (date, filters, row) => {
            console.log(date);
            if (filters.length) return !date.includes(filters);
          },
          names: records.data
            ? records.data
                .map((rec) => dayjs(rec.pickupTime).format("DD/MM/YYYY"))
                .filter((rec, index, records) => records.indexOf(rec) === index)
            : [],
        },
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
      },
    },
    {
      name: "Километри на връщане",
      options: {
        filter: false,
      },
      customBodyRender: (value) => (value ? value : "в движение"),
    },
    {
      name: "Маршрут",
      options: {
        customBodyRender: (value) => (value ? value : "в движение"),
      },
    },
    {
      name: "Забележки",
      options: {},
    },
  ];
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
        <Dialog
          open={error[0]}
          onClose={handleCloseError}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Грешка"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error[1]}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseError} autoFocus>
              Добре
            </Button>
          </DialogActions>
        </Dialog>

        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="my-4">
            <MUIDataTable
              title={"ДВИЖЕНИЕ"}
              data={data}
              columns={columns}
              options={options}
            />
          </div>
        )}
      </LocalizationProvider>
    </div>
  );
};

export default VehicleRecords;
