import React from "react";
import Draggable from "react-draggable";
import Paper from "@mui/material/Paper";

const DraggablePaper = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

export default DraggablePaper;
