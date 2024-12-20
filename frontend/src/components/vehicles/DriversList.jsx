import React from "react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import dayjs from "dayjs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Edit, DeleteForever, Timeline } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import { darken, lighten, useTheme } from "@mui/material";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import Tooltip from "@mui/material/Tooltip";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const DriversList = () => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState({});
  const [error, setError] = useState([false, ""]);
  const [refetching, setRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);
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

  useEffect(() => {
    const fetchData = async () => {
      if (!drivers.length) {
        setLoading(true);
      } else {
        setRefetching(true);
      }

      axios
        .get(`http://192.168.0.147:5555/api/drivers/`)
        .then((res) => {
          setDrivers(res.data.data);
          setRowCount(res.data.count);
        })
        .catch((err) => {
          setError([true, err]);
          console.error(err);
          return;
        });
      setError([false, ""]);
      setLoading(false);
      setRefetching(false);
    };
    fetchData();
  }, []);

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "name",
        header: "Име",
        size: 200,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "left",
        },
      },

      {
        accessorKey: "barcode",
        header: "Карта 1",
        size: 250,
        editable: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "barcode2",
        header: "Карта 2",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    []
  );
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
      name: "Тръгване",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
      },
    },
    {
      name: "Връщане",
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
    {
      name: "Забележки",
      options: {},
    },
  ];
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: drivers,
    rowCount,
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    enableFacetedValues: true,
    enableHiding: false,
    enableRowNumbers: true,
    enableRowActions: true,
    enableColumnResizing: true,
    enableRowPinning: false,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 150,
      },
    },
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [30, 50, 100, 200],
      shape: "rounded",
      variant: "outlined",
    },
    enableColumnResizing: true,
    initialState: {
      sorting: [
        {
          id: "name",
          desc: false,
        },
      ],
      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
        <Box>
          <Tooltip title="Редактиране" disableInteractive>
            <IconButton
              onClick={() => {
                setEdit([true, row.original]);
              }}
              color="warning"
              variant="contained"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Изтриване" disableInteractive>
            <IconButton
              onClick={() => {
                setVerifyDelete([true, row.original]);
              }}
              color="error"
              variant="contained"
            >
              <DeleteForever />
            </IconButton>
          </Tooltip>
          <Tooltip title="Редактиране" disableInteractive>
            <IconButton
              onClick={() => {
                axios
                  .get(
                    `http://192.168.0.147:5555/api/records/driver/${row.original._id}`
                  )
                  .then((res) => {
                    setHist([true, row.original, res.data]);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              color="success"
              variant="contained"
            >
              <Timeline />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    ),
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
          {
            backgroundColor: lighten(baseBackgroundColor, 0.1),
          },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
          {
            backgroundColor: darken(baseBackgroundColor, 0.2),
          },
      }),
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: baseBackgroundColor,
      draggingBorderColor: theme.palette.secondary.main,
    }),
  });

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
            {/* {hist[0] && (
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
                    obj.problem,
                  ];
                })}
                columns={columns2}
                options={options}
              />
            )} */}
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
          <Box sx={{ width: "90%", margin: "5px" }}>
            <MaterialReactTable table={table} />
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
