import React from "react";

const SlideAlert = ({ alert, setAlert }) => {
  return (
    <Slide
      direction="down"
      in={alert.show}
      sx={{
        position: "absolute",
        left: "50%",
        zIndex: 2,
        width: "20%",
      }}
    >
      <Alert
        severity={alert.severity}
        variant="filled"
        sx={{ margin: 0 }}
        onClick={() => {
          setAlert(false);
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setAlert(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>Успех</AlertTitle>
        {alert.message}
      </Alert>
    </Slide>
  );
};

export default SlideAlert;