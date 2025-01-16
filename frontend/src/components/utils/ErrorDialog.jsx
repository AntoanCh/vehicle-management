import React from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Button, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DraggablePaper from "../DraggablePaper";

const ErrorDialog = ({ error, setError }) => {
  const handleError = () => {
    setError(false, "");
  };
  return (
    <Dialog
      PaperComponent={DraggablePaper}
      open={error.show}
      onClose={handleError}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        style={{ cursor: "move", backgroundColor: "#42a5f5" }}
        id="draggable-dialog-title"
      >
        {"Грешка"}{" "}
        <IconButton
          sx={{
            margin: 0,
            padding: 0,
            float: "right",
          }}
          color="error"
          onClick={handleError}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box sx={{ fontWeight: 800, marginTop: "20px" }}>{error.message}</Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleError} autoFocus>
          Добре
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
