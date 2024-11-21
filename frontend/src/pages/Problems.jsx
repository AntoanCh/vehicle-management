import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MUIDataTable from "mui-datatables";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import IconButton from "@mui/material/IconButton";
import ErrorDialog from "../components/ErrorDialog";

const Problems = ({ vehicle, userRole, username, problems }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const data = problems.data.map((obj) => {
    return [
      obj.date,
      obj.driverName,
      obj.desc,
      obj.km + " км",
      obj.done,
      userRole.includes("admin") || userRole.includes(vehicle.site)
        ? !obj.done && (
            <IconButton
              onClick={() => {
                axios
                  .put(`http://192.168.0.147:5555/problems/${obj._id}`, {
                    ...obj,
                    done: true,
                  })
                  .then((res) => {
                    if (
                      problems.data.filter((item) => !item.done).length === 1
                    ) {
                      axios
                        .put(
                          `http://192.168.0.147:5555/vehicle/${vehicle._id}`,
                          {
                            ...vehicle,
                            issue: false,
                          }
                        )
                        .then((res) => {})
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              color="success"
              variant="contained"
            >
              <DoneOutlineIcon />
            </IconButton>
          )
        : "",
    ];
  });

  const columns = [
    {
      name: "Дата",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
        filterOptions: {
          logic: (date, filters, row) => {
            console.log(date);
            if (filters.length) return !date.includes(filters);
          },
          names: problems.data
            ? problems.data
                .map((prob) => dayjs(prob.date).format("DD/MM/YYYY"))
                .filter(
                  (prob, index, problems) => problems.indexOf(prob) === index
                )
            : [],
        },
      },
    },
    { name: "Шофьор" },
    { name: "Забележка", options: { filter: false, sort: false } },
    { name: "Километри", options: { filter: false } },
    { name: "", options: { filter: false, sort: false } },
    { name: "", options: { filter: false, sort: false } },
  ];
  const options = {
    filterType: "dropdown",
    selectableRows: false,
    download: false,
    print: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 100],

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
        <ErrorDialog error={error} setError={setError} />
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
