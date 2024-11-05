import React from "react";
import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import dayjs from "dayjs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import TimelineIcon from "@mui/icons-material/Timeline";

const DriversList = ({ drivers }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, {}]);
  const [add, setAdd] = useState(false);
  const [hist, setHist] = useState([false, {}, []]);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
    barcode: "",
    barcode2: "",
  });
  const { firstName, lastName, barcode, barcode2 } = input;

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;

    setEdit([true, { ...edit[1], [name]: value }]);
    console.log(edit);
  };

  const handleCloseEdit = () => {
    setEdit([false, {}]);
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://192.168.0.147:5555/api/drivers",
        {
          ...input,
        }
      );
      const { status, message } = data;

      if (status) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
    setInput({
      ...input,
      firstName: "",
      lastName: "",
      barcode: "",
      barcode2: "",
    });
  };
  //
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleAddModal = () => {
    setAdd(true);
  };

  const handleDelete = () => {
    // axios.delete(`http://192.168.0.147/sites/${e}`)
  };
  const handleCloseAdd = () => {
    setAdd(false);
  };
  const handleCloseHist = () => {
    setHist([false, {}, []]);
  };

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `http://192.168.0.147:5555/api/drivers/${edit[1]._id}`,
        {
          ...edit[1],
        }
      );
      const { status, message } = data;

      // if (status) {
      //   handleSuccess(message);
      //   window.location.reload();
      // } else {
      //   handleError(message);
      // }
      setEdit([false, {}]);
    } catch (error) {
      console.log(error);
    }
    setEdit([false, {}]);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const data = drivers.data
    ? drivers.data
        .map((obj) => {
          return [
            `${obj.firstName} ${obj.lastName}`,
            <Box>
              <IconButton
                onClick={() => {
                  axios
                    .get(
                      `http://192.168.0.147:5555/api/records/driver/${obj._id}`
                    )
                    .then((res) => {
                      setHist([true, obj, res.data]);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
                color="success"
                variant="contained"
              >
                <TimelineIcon />
              </IconButton>
            </Box>,
            obj.barcode,
            obj.barcode2,
            <Box>
              <IconButton
                onClick={() => {
                  setEdit([true, obj]);
                }}
                color="warning"
                variant="contained"
              >
                <EditIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  setVerifyDelete([true, obj]);
                }}
                color="error"
                variant="contained"
              >
                <DeleteForeverIcon />
              </IconButton>
            </Box>,
          ];
        })
        .sort()
    : [];

  const columns = [
    {
      name: "Име",
      options: {},
    },
    {
      name: "История",
      options: {
        filter: false,
        sort: false,
      },
    },
    { name: "Карта 1" },
    { name: "Карта 2" },
    {
      name: "Действия",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
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
      name: "Час на тръгване",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
      },
    },
    {
      name: "Час на връщане",
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
  ];
  const options = {
    filterType: "dropdown",
    selectableRows: false,
    download: false,
    print: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 100],
    // expandableRowsOnClick: true,
    // expandableRows: true,
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
    <Box>
      <Dialog
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
      </Dialog>
      <Dialog
        open={edit[0]}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`РЕДАКТИРАНЕ ${edit[1].firstName} ${edit[1].lastName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <span>ID: </span>
            <span>{edit ? edit[1]._id : ""}</span>
          </div>

          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  fullWidth
                  name="firstName"
                  label="Име:"
                  value={edit[1].firstName}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="lastName"
                  label="Фамилия:"
                  value={edit[1].lastName}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>

              <div className="my-4">
                <TextField
                  fullWidth
                  name="barcode"
                  label="Номер карта:"
                  value={edit[1].barcode}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="barcode2"
                  label="Номер карта 2:"
                  value={edit[1].barcode2}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseEdit}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Обнови
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth={"lg"}
        open={hist[0]}
        onClose={handleCloseHist}
        fullWidth
        // maxWidth={"xl"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`ИСТОРИЯ ${hist[1].firstName} ${hist[1].lastName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>

          <Box>
            {hist[0] && (
              <MUIDataTable
                title={"ИСТОРИЯ"}
                data={hist[2].data.map((obj) => {
                  return [
                    obj.vehicleModel,
                    obj.vehicleReg,
                    obj.pickupTime,
                    obj.dropoffTime,
                    obj.pickupKm,
                    obj.dropoffKm ? obj.dropoffKm : "в движение",
                    obj.destination ? obj.destination : "в движение",
                  ];
                })}
                columns={columns2}
                options={options}
              />
            )}
          </Box>
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
      <Dialog
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Добавяне на шофьор"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  fullWidth
                  name="firstName"
                  label="Име:"
                  value={firstName}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="lastName"
                  label="Фамилия:"
                  value={lastName}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>

              <div className="my-4">
                <TextField
                  fullWidth
                  name="barcode"
                  label="Номер карта:"
                  value={barcode}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="barcode2"
                  label="Номер карта 2:"
                  value={barcode2}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </div>
              {/* <div className="my-4">
                <Button onClick={handleSubmit} fullWidth variant="outlined">
                  ЗАПИШИ
                </Button>
              </div> */}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => setAdd(false)}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleAddSubmit} autoFocus>
            Добави
          </Button>
        </DialogActions>
      </Dialog>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className="my-4 flex flex-col items-center">
          <Box sx={{ width: "80%", margin: "5px" }}>
            <MUIDataTable
              title={"ШОФЬОРИ"}
              data={data}
              columns={columns}
              options={options}
            />
            <Button fullWidth variant="contained" onClick={handleAddModal}>
              Добави Шофьор
              <PersonAddAlt1Icon />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DriversList;
