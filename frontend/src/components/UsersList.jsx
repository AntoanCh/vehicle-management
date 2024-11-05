import React from "react";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem } from "@mui/material";
import Register from "../pages/Register";
import Box from "@mui/material/Box";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MUIDataTable from "mui-datatables";
import dayjs from "dayjs";

const Users = ({ users }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, 0, ""]);
  const [add, setAdd] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [caps, setCaps] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickChip = () => {
    console.info("You clicked the Chip.");
  };

  const handleDeleteChip = (index) => {
    setEditUser({ ...editUser, role: editUser.role.splice(index, 1) });
  };
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleAdd = () => {
    setAdd(true);
  };

  const handleDelete = () => {
    // axios.delete(`http://192.168.0.147/users/${e}`)
  };
  const handleCancel = () => {
    setAdd(false);
  };

  const handleCloseDelete = () => {
    setVerifyDelete([false, {}]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (edit[2] === "role") {
      try {
        const { data } = await axios.post(
          "http://192.168.0.147:5555/auth/updaterole",
          {
            ...editUser,
          }
        );
        const { status, message } = data;

        // if (status) {
        //   handleSuccess(message);
        //   window.location.reload();
        // } else {
        //   handleError(message);
        // }
        setEdit([false, 0, ""]);
        setEditUser({});
      } catch (error) {
        console.log(error);
      }
    } else if (edit[2] === "password") {
      try {
        const { data } = await axios.post(
          "http://192.168.0.147:5555/auth/updatepswrd",
          {
            ...editUser,
          }
        );
        const { status, message } = data;

        // if (status) {
        //   handleSuccess(message);
        //   window.location.reload();
        // } else {
        //   handleError(message);
        // }
        setEdit([false, 0, ""]);
        setEditUser({});
      } catch (error) {
        console.log(error);
      }
      setEdit([false, 0, ""]);
      setEditUser({});
    }
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  const handleEdit = (event, id, type) => {
    setEdit([true, id, type]);

    if (type === "password") {
      setEditUser({
        ...users.data.filter((obj) => obj._id === id)[0],
        password: "",
      });
    } else {
      setEditUser(users.data.filter((obj) => obj._id === id)[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "role") {
      // setEditUser({ ...editUser, role: e.target.value });
    }
    if (e.target.name === "password") {
      setEditUser({ ...editUser, password: e.target.value });
    }
  };

  const handleClose = () => {
    setEdit([false, 0, ""]);
  };
  const roles = ["admin", "hr", "ОФИС", "СКЛАД", "IT", "FREEZER"];
  const data = users.data
    ? users.data
        .map((obj) => {
          return [
            obj.username,

            <Box>
              {obj.role.map((item) => `${item} ,`)}
              <IconButton
                color="warning"
                onClick={(event) => {
                  handleEdit(event, obj._id, "role");
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>,
            obj._id,

            <Box>
              <IconButton
                onClick={(event) => {
                  handleEdit(event, obj._id, "password");
                }}
                color="warning"
                variant="outlined"
              >
                <LockResetIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setVerifyDelete([
                    true,
                    users.data.filter((obj1) => obj1._id === obj._id)[0],
                  ]);
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
      name: "Потребител",
      options: {},
    },
    {
      name: "Права",
    },
    {
      name: "ID",
    },
    {
      name: "Действия",
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
          {`Сигурен ли сте, че искате да изтриете потребител ${verifyDelete[1].username} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/api/users/${verifyDelete[1]._id}`
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
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {editUser ? editUser.username : ""}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "red" }}> {caps ? "CAPSLOCK ON" : ""}</span>
            </Box>
          </div>

          {edit[2] === "role" ? (
            <>
              <div>
                <span>Права: </span>
                <span>
                  {editUser
                    ? editUser.role.map((item, index) => (
                        <Chip
                          color="primary"
                          label={item}
                          variant="outlined"
                          onDelete={() => handleDeleteChip(index)}
                        />
                      ))
                    : ""}
                </span>
              </div>
              <div className="my-2">
                <Stack direction="row" spacing={1}>
                  {roles
                    .filter((item) => !editUser.role.includes(item))
                    .map((item) => (
                      <Chip
                        color="secondary"
                        label={item}
                        variant="outlined"
                        onClick={handleClickChip}
                      />
                    ))}
                </Stack>
              </div>
            </>
          ) : (
            ""
          )}
          {edit[2] === "password" ? (
            <div className="my-2">
              <FormControl
                sx={{ minWidth: "400px" }}
                fullWidth
                variant="filled"
              >
                <InputLabel htmlFor="filled-adornment-password">
                  Нова Парола
                </InputLabel>
                <FilledInput
                  value={editUser.password}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.getModifierState("CapsLock")) {
                      setCaps(true);
                    } else {
                      setCaps(false);
                    }
                  }}
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        // onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              {/* <TextField
                fullWidth
                type="password"
                name="password"
                id="password"
                label="Нова Парола:"
                variant="filled"
                value={editUser.password}
                onChange={handleChange}
              /> */}
            </div>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleClose}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Обнови
          </Button>
        </DialogActions>
      </Dialog>
      {handleLoading()}
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="my-4 flex flex-col items-center">
          <Box sx={{ width: "50%", margin: "5px" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <MUIDataTable
                title={"ШОФЬОРИ"}
                data={data}
                columns={columns}
                options={options}
              />

              <div className="flex justify-end">
                {add ? (
                  <Button
                    color="warning"
                    fullWidth
                    variant="contained"
                    onClick={handleCancel}
                  >
                    Отказ
                    <CancelIcon />
                  </Button>
                ) : (
                  <Button fullWidth variant="contained" onClick={handleAdd}>
                    Добави Потребител
                    <PersonAddAlt1Icon />
                  </Button>
                )}
              </div>
              <Dialog
                open={add}
                onClose={() => setAdd(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Добави Потребител"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                  <div className="">
                    <Register />
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
                  {/* <Button variant="contained" onClick={handleUpdate} autoFocus>
                    Запази
                  </Button> */}
                </DialogActions>
              </Dialog>
            </Paper>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Users;
