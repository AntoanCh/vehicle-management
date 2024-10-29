import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

// test
const Problems = ({ vehicle, userRole, username, problems }) => {
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

  const data = problems.data.map((obj) => {
    return [
      dayjs(obj.date).format("DD/MM/YYYY - HH:mm"),
      obj.driverName,
      obj.desc,
      obj.km + " км",
      obj.done,
      userRole.includes("admin") || userRole.includes(vehicle.site) ? (
        <IconButton
          onClick={() => {
            axios
              .put(`http://192.168.0.147:5555/problems/${obj._id}`, {
                ...obj,
                done: true,
              })
              .then((res) => {})
              .catch((err) => {
                console.log(err);
              });
          }}
          color="success"
          variant="contained"
        >
          <DeleteForeverIcon />
        </IconButton>
      ) : (
        ""
      ),
    ];
  });

  const columns = [
    {
      name: "Дата",
      options: {
        sortDirection: "desc",
      },
    },
    { name: "Шофьор" },
    { name: "Забележка" },
    { name: "Километри" },
    { name: "" },
    { name: "" },
  ];
  const options = {
    filterType: "checkbox",
    selectableRows: false,
    download: false,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],

    setRowProps: (row) => {
      if (row[4]) {
        return {
          style: { textDecoration: "line-through" },
        };
      }
    },
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
              title={"ЗАБЕЛЕЖКИ"}
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

export default Problems;
