import React from "react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { Button, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import UserDelete from "./UserDelete";
import UserAdd from "./UserAdd";
import ErrorDialog from "./utils/ErrorDialog";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import UserEditPassword from "./UserEditPassword";
import UserEditRole from "./UserEditRole";
import { darken, lighten, useTheme } from "@mui/material";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import Tooltip from "@mui/material/Tooltip";
import { DeleteForever, SupervisedUserCircle } from "@mui/icons-material";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [error, setError] = useState({ show: false, message: "" });
  const [users, setUsers] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [editPassword, setEditPassword] = useState({ show: false, user: {} });
  const [editRole, setEditRole] = useState({ show: false, user: {} });
  const [edit, setEdit] = useState({ show: false, id: 0, type: "" });
  const [add, setAdd] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [verifyDelete, setVerifyDelete] = useState({ show: false, user: {} });

  useEffect(() => {
    const fetchData = async () => {
      if (!users.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/users/`);
        setUsers(res.data.data);
        setRowCount(res.data.count);
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }
      setIsLoading(false);
      setIsRefetching(false);
    };
    fetchData();
  }, [refresh]);

  const theme = useTheme();
  const baseBackgroundColor =
    theme.palette.mode === "dark" ? "#212121" : "#fff";

  const columns = useMemo(
    () => [
      {
        accessorKey: "username",
        header: "Потребител",
        size: 200,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "left",
        },
      },

      {
        accessorKey: "role",
        header: "Права",
        size: 450,
        editable: false,
        enableClickToCopy: false,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "left",
        },
        Cell: ({ cell }) => {
          return cell.getValue().map((e) => (
            <Chip
              size="small"
              sx={{
                marginX: "2px",
                fontWeight: 800,
              }}
              label={e}
              color="success"
            />
          ));
        },
      },
      {
        accessorKey: "_id",
        header: "ID",
        size: 200,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [refresh]
  );

  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: users,
    rowCount,
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    // globalFilterFn: "contains",
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
    muiToolbarAlertBannerProps: errorBanner.show
      ? {
          color: errorBanner.color,
          children: errorBanner.message,
        }
      : undefined,
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
    state: {
      isLoading,
      showProgressBars: isRefetching,
      showAlertBanner: errorBanner.show,
    },
    initialState: {
      sorting: [
        {
          id: "username",
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
          <Tooltip title="Редактирай права" disableInteractive>
            <IconButton
              onClick={() => {
                setEditRole({ show: true, user: row.original });
              }}
              color="warning"
              variant="contained"
            >
              <SupervisedUserCircle />
            </IconButton>
          </Tooltip>
          <Tooltip title="Смени Парола" disableInteractive>
            <IconButton
              onClick={() => {
                setEditPassword({
                  show: true,
                  user: { ...row.original, password: "" },
                });
              }}
              color="warning"
              variant="contained"
            >
              <LockResetIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Изтриване" disableInteractive>
            <IconButton
              onClick={() => {
                setVerifyDelete({ show: true, user: row.original });
              }}
              color="error"
              variant="contained"
            >
              <DeleteForever />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button fullWidth variant="contained" onClick={() => setAdd(true)}>
          Добави потребител
          <PersonAddAlt1Icon />
        </Button>
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
    <div>
      <Slide
        direction="down"
        in={alert.show}
        // in={true}
        sx={{
          position: "absolute",
          // left: "50%",
          zIndex: 2,
          width: "40%",
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
          {alert.message}
        </Alert>
      </Slide>
      <UserDelete
        verifyDelete={verifyDelete}
        setVerifyDelete={setVerifyDelete}
        setError={setError}
        alert={alert}
        setAlert={setAlert}
        setErrorBanner={setErrorBanner}
        refresh={refresh}
        setRefresh={setRefresh}
        setIsRefetching={setIsRefetching}
      />
      <ErrorDialog error={error} setError={setError} />
      <UserAdd
        add={add}
        setAdd={setAdd}
        setError={setError}
        alert={alert}
        setAlert={setAlert}
        setErrorBanner={setErrorBanner}
        refresh={refresh}
        setRefresh={setRefresh}
        setIsRefetching={setIsRefetching}
      />
      <UserEditPassword
        editPassword={editPassword}
        setEditPassword={setEditPassword}
        edit={edit}
        setEdit={setEdit}
        editUser={editUser}
        setError={setError}
        alert={alert}
        setAlert={setAlert}
        setErrorBanner={setErrorBanner}
        refresh={refresh}
        setRefresh={setRefresh}
        setIsRefetching={setIsRefetching}
      />
      <UserEditRole
        editRole={editRole}
        setEditRole={setEditRole}
        edit={edit}
        setEdit={setEdit}
        editUser={editUser}
        setError={setError}
        alert={alert}
        setAlert={setAlert}
        setErrorBanner={setErrorBanner}
        refresh={refresh}
        setRefresh={setRefresh}
        setIsRefetching={setIsRefetching}
      />

      <Box>
        <Box sx={{ width: "99%", margin: "5px" }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
    </div>
  );
};

export default Users;
