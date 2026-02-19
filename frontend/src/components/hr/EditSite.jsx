import React from "react";
import axios from "axios";
import { Button, IconButton, MenuItem } from "@mui/material";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import { Close } from "@mui/icons-material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DraggablePaper from "../DraggablePaper";
import Checkbox from "@mui/material/Checkbox";

const EditSite = ({
  edit,
  setEdit,
  sites,
  setError,
  setRefresh,
  refresh,
  setAlert,
  setErrorBanner,
  setIsRefetching,
}) => {
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!edit.site.name) {
      setError({ show: true, message: `Въведете име на обекта!` });
      return;
    }
    // else if (!input.company) {
    //   setError({ show: true, message: `Въведете фирма!` });
    //   return;
    // }
    else if (
      sites
        .filter((site) => site._id !== edit.site._id)
        .filter((site) => site.name === edit.site.name.toUpperCase()).length
    ) {
      setError({ show: true, message: `Този обект вече съществува` });
      return;
    }
    try {
      const { data } = await axios.put(
        `http://192.168.0.147:5555/api/sites/${edit.site._id}`,
        {
          ...edit.site,
        },
      );
      const { status, message } = data;

      if (data) {
        setAlert({
          show: true,
          message: `Успешно редактирахте обект ${edit.site.name}!`,
          severity: "success",
        });
      } else {
        setAlert({
          show: true,
          message: "Грешка при запис",
          severity: "error",
        });
        setErrorBanner({
          show: true,
          message: "Грешка при запис",
          color: "error",
        });
      }
      setIsRefetching(true);
      setRefresh(!refresh);
      setEdit({ show: false, site: {} });
    } catch (error) {
      setErrorBanner({
        show: true,
        message: "Грешка при комуникация със сървъра!",
        color: "error",
      });
      setError({ show: true, message: `Грешка при комуникация: ${error}` });
    }
    setEdit({ show: false, site: {} });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;

    setEdit({ show: true, site: { ...edit.site, [name]: value } });
  };
  const handleHasVehicles = (event) => {
    setEdit({
      show: true,
      site: { ...edit.site, hasVehicles: event.target.checked },
    });
  };

  const handleClose = () => {
    setEdit({ show: false, site: {} });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
      <Dialog
        PaperComponent={DraggablePaper}
        open={edit.show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move", backgroundColor: "#42a5f5" }}
          id="draggable-dialog-title"
        >
          {`РЕДАКТИРАНЕ ${edit.site.name} `}
          <IconButton
            sx={{
              margin: 0,
              padding: 0,
              float: "right",
            }}
            color="error"
            onClick={handleClose}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <Box>
            <span>ID: </span>
            <span>{edit ? edit.site._id : ""}</span>
          </Box>

          <Box>
            <Box>
              <Box>
                <TextField
                  fullWidth
                  name="name"
                  label="Име:"
                  value={edit.site.name}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </Box>
              <Box>
                <Checkbox
                  checked={edit.site.hasVehicles}
                  onChange={handleHasVehicles}
                />
                <span>Автопарк</span>
              </Box>
              {edit.site.hasVehicles && (
                <Box sx={{ marginY: "15px" }}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Парола:"
                    value={edit.site.password}
                    onChange={handleChangeEdit}
                    variant="filled"
                  ></TextField>
                </Box>
              )}

              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="company"
                  label="Фирма:"
                  value={edit.site.company}
                  onChange={handleChangeEdit}
                  variant="filled"
                ></TextField>
              </Box>

              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="address"
                  label="Адрес:"
                  value={edit.site.address}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email:"
                  value={edit.site.email}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </Box>
              <Box sx={{ marginY: "15px" }}>
                <TextField
                  fullWidth
                  name="пхоне"
                  label="Telefon:"
                  value={edit.site.пхоне}
                  onChange={handleChangeEdit}
                  variant="filled"
                />
              </Box>
            </Box>
          </Box>
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
    </LocalizationProvider>
  );
};

export default EditSite;
