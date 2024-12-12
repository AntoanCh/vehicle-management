import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import dayjs from "dayjs";
import {
  AddBusiness,
  Edit,
  Delete,
  Cancel,
  Search,
  TransferWithinAStation,
  AddCircleOutline,
  PersonAddAlt1,
  LockReset,
} from "@mui/icons-material/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import { Link } from "react-router-dom";
import CreatePerson from "../pages/CreatePerson";
import { styled } from "@mui/system";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import {
  darken,
  lighten,
  useTheme,
  Typography,
  ListItemIcon,
} from "@mui/material";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const PeopleList = ({ sites, people, siteName, siteId }) => {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([false, {}]);
  const [transfer, setTransfer] = useState([false, {}]);
  const [add, setAdd] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState([false, {}]);
  const [copyList, setCopyList] = useState();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("model");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  console.log(people);
  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark"
      ? "#212121"
      : // "rgba(3, 44, 43, 1)"
        "#fff";
  // "rgba(244, 255, 233, 1)"

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

  const handleChangeTransfer = (e) => {
    const { value } = e.target;
    const siteSelected = sites.filter((obj) => obj.name === value);
    setTransfer([
      true,
      { ...transfer[1], site: value, siteId: siteSelected[0]._id },
    ]);
  };

  const handleCloseTransfer = () => {
    setTransfer([false, {}]);
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

  const handleSubmit = () => {};
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
      const { data } = await axios.put(
        `http://192.168.0.147:5555/api/person/${transfer[1]._id}`,
        {
          ...transfer[1],
        }
      );
      const { status, message } = data;

      setTransfer([false, {}]);
    } catch (error) {
      console.log(error);
    }
    setEdit([false, {}]);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleClick = (event, id) => {
    navigate(`/people/details/${id}`);
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) =>
          `${row.firstName} ${row.middleName} ${row.lastName}`,
        id: "name",
        header: "Име",
        size: 280,
        enableColumnFilter: false,
      },
      {
        accessorKey: "site",
        header: "Обект",
        size: 160,
        filterVariant: "select",
        enableGlobalFilter: false,
        editable: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "job",
        header: "Длъжност",
        size: 220,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        filterVariant: "multi-select",
      },
      {
        accessorKey: "employmentDate",
        header: "Дата на постъпване",
        size: 120,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        filterVariant: "select",
        Cell: ({ cell }) => dayjs(cell.getValue()).format("DD.MM.YYYY"),
      },
      {
        accessorKey: "phone",
        header: "Телефон",
        size: 150,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => `+359 ${cell.getValue()}`,
      },

      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "address",
        header: "Адрес",
        size: 200,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: people.data,
    // enableRowVirtualization: true,
    enableExpandAll: false,
    localization: { ...MRT_Localization_BG },
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableFacetedValues: true,
    enableColumnActions: false,
    enableColumnResizing: true,
    enableRowSelection: false,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    enableRowNumbers: true,
    enableRowActions: true,
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        size: 150, //make actions column wider
      },
    },
    initialState: {
      sorting: [
        {
          id: "reg",
          desc: false,
        },
        {
          id: "model",
          desc: false,
        },
      ],
      columnVisibility: {
        kaskoDate: false,
        oil: false,
        issue: false,
        oilChange: false,
        km: false,
      },
      pagination: { pageSize: 30, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-actions", "reg"],
        right: ["mrt-row-select"],
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30, 50],
      shape: "rounded",
      variant: "outlined",
    },

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
    },
    renderDetailPanel: ({ row }) => <Box></Box>,
    renderRowActions: ({ row, table }) => (
      <Box>
        <IconButton onClick={() => console.info("Edit")}>
          <Edit />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setVerifyDelete([true, row]);
          }}
          color="error"
        >
          <Delete />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setTransfer([true, row]);
          }}
          color="success"
        >
          <TransferWithinAStation />
        </IconButton>
      </Box>
    ),

    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("deactivating " + row.getValue("name"));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("contact " + row.getValue("name"));
        });
      };
    },
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
          {`Сигурен ли сте, че искате да изтриете ${verifyDelete[1].firstName} ${verifyDelete[1].middleName} ${verifyDelete[1].lastName} Тази операция е необратима`}
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
                  `http://192.168.0.147:5555/api/person/${verifyDelete[1]._id}`
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
        open={transfer[0]}
        onClose={handleCloseTransfer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`ПРЕХВЪРЛЯНЕ В ДРУГ ОБЕКТ`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <div>
            <span
              style={{ fontWeight: 800 }}
            >{`${transfer[1].firstName} ${transfer[1].middleName} ${transfer[1].lastName}`}</span>
          </div>

          <div className="">
            <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[400px] p-4 mx-auto">
              <div className="my-4">
                <TextField
                  type="text"
                  fullWidth
                  name="site"
                  select
                  label="Обект:"
                  value={transfer[1].site}
                  onChange={handleChangeTransfer}
                  variant="filled"
                >
                  {sites.map((obj, index) => (
                    <MenuItem key={index} value={obj.name}>
                      {obj.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <span>{`siteId: ${transfer[1].siteId}`}</span>
            </div>
          </div>
          <Box>
            <span>ID: </span>
            <span>{transfer ? transfer[1]._id : ""}</span>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={handleCloseTransfer}
            autoFocus
          >
            Отказ
          </Button>
          <Button variant="contained" onClick={handleUpdate} autoFocus>
            Запиши
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth={"xl"}
        open={add}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Добавяне на нов служител към ${siteName}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          <CreatePerson siteId={siteId} siteName={siteName} />
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
        </DialogActions>
      </Dialog>{" "}
      {handleLoading()}
      {loading ? <CircularProgress /> : <MaterialReactTable table={table} />}
    </Box>
  );
};

export default PeopleList;
