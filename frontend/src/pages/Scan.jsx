import React, { useState } from "react";
import { Box } from "@mui/material";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const Scan = () => {
  const [barcode, setBarcode] = useState();
  const [error, setError] = useState([false, ""]);
  const handleChange = (e) => {
    setBarcode(e.target.value);
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!barcode) {
      setError([true, "Не е сканирана карта"]);
    } else {
      try {
        const { data } = await axios.get(
          `http://192.168.0.147:5555/api/drivers/barcode/${barcode}`
        );

        const { status, message } = data;

        console.log(data);
        if (data.length !== 0) {
          setTimeout(() => {
            navigate(`/pick-up/${data[0].barcode}`);
          }, 400);
        } else {
          setError([true, "Шофьор с такъв номер не съществува"]);
        }
      } catch (error) {
        console.log(error);
      }
      setBarcode("");
    }
  };
  const handleError = () => {
    setError(false, "");
  };

  return (
    <>
      <Dialog
        open={error[0]}
        onClose={handleError}
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
          <Button variant="contained" onClick={handleError} autoFocus>
            Добре
          </Button>
        </DialogActions>
      </Dialog>
      <Box className="flex justify-center">
        <Box
          sx={{
            backgroundColor: "#ccc",
          }}
          className="  border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto mt-5"
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: 24,
              margin: "auto",
              textAlign: "center",
            }}
          >
            СКАНИРАЙТЕ СЛУЖЕБНАТА КАРТА
          </h1>
          <form action="">
            <Box
              sx={{
                display: "flex",
              }}
            >
              <TextField
                autoFocus
                fullWidth
                id="barcode"
                name="barcode"
                label="Сканирайте картата:"
                variant="filled"
                value={barcode}
                onChange={handleChange}
              />
              <Button
                sx={{ maxWidth: "10%" }}
                type="submit"
                onClick={handleSubmit}
                fullWidth
                variant="contained"
              >
                <DoubleArrowIcon />
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Scan;
