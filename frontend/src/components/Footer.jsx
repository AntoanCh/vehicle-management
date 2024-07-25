import React from "react";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

const Footer = () => {
  const [patchOpen, setPatchOpen] = useState(false);
  const handleClose = () => {
    setPatchOpen(false);
  };
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0px",
        width: "100%",
      }}
      className="text-right bg-gray-600"
    >
      <Dialog
        open={patchOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Patch Notes</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Version {process.env.REACT_APP_VERSION}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleClose}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      Version v{process.env.REACT_APP_VERSION}{" "}
      <Button
        onClick={() => setPatchOpen(true)}
        size="small"
        variant="contained"
        color="secondary"
      >
        Patch Notes
      </Button>
    </Box>
  );
};

export default Footer;
