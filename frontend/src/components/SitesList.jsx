import React from "react";

import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem } from "@mui/material";

import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import CancelIcon from "@mui/icons-material/Cancel";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";

const Sites = ({ sites }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, {}]);
  const [add, setAdd] = useState(false);
  const [editSite, setEditSite] = useState();
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);

  //
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const { name, address, phone, email } = input;

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEdit([true, { ...edit, [name]: value }]);
  };

  const handleCloseEdit = () => {
    setEdit([false, {}]);
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://192.168.0.147:5555/api/sites", {
        ...input,
      });
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
      name: "",
      address: "",
      phone: "",
      email: "",
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

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put("http://192.168.0.147:5555/api/sites", {
        ...edit[1],
      });
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

  const data = sites.data
    ? sites.data.map((obj) => {
        return [
          obj.name,
          obj.address,
          obj.phone,
          obj.email,

          // userRole === "admin" || userRole === vehicle.site ? (
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

          // ) : (
          //   ""
          // ),
        ];
      })
    : [];

  const columns = [
    {
      name: "Обект",
      options: {
        sortDirection: "desc",
      },
    },
    { name: "Адрес" },
    { name: "Телефон" },
    { name: "Email" },
    { name: "Действия" },
  ];
  const options = {
    filterType: "checkbox",
    selectableRows: false,
    download: false,
    rowsPerPage: 20,
    rowsPerPageOptions: [20, 50, 100],
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
    <div>
      <Dialog
        open={verifyDelete[0]}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">ИЗТРИВАНЕ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {`Сигурен ли сте, че искате да изтриете обект ${verifyDelete[1].name} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/api/sites/${verifyDelete[1]._id}`
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
          {`РЕДАКТИРАНЕ ${edit[1].name}`}
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
                  name="name"
                  label="Обект:"
                  value={edit[1].name}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес:"
                  value={edit[1].address}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  type="phone"
                  fullWidth
                  name="phone"
                  label="Tелефон:"
                  value={edit[1].phone}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </div>
              <div className="my-4">
                <TextField
                  type="email"
                  fullWidth
                  name="email"
                  label="Еmail:"
                  value={edit[1].email}
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
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Добавяне на обект"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  fullWidth
                  name="name"
                  label="Обект:"
                  value={name}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес:"
                  value={address}
                  onChange={handleChangeAdd}
                  variant="filled"
                ></TextField>
              </div>
              <div className="my-4">
                <TextField
                  type="phone"
                  fullWidth
                  name="phone"
                  label="Tелефон:"
                  value={phone}
                  onChange={handleChangeAdd}
                  variant="filled"
                />
              </div>
              <div className="my-4">
                <TextField
                  type="email"
                  fullWidth
                  name="email"
                  label="Еmail:"
                  value={email}
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
          <Box sx={{ width: "50%", margin: "5px" }}>
            <MUIDataTable
              title={"ОБЕКТИ"}
              data={data}
              columns={columns}
              options={options}
            />

            <Button fullWidth variant="contained" onClick={handleAddModal}>
              Добави Обект
              <AddBusinessIcon />
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Sites;
