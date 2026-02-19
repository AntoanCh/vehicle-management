import React from "react";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { Edit, DeleteForever, Timeline } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { darken, lighten, useTheme } from "@mui/material";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import Tooltip from "@mui/material/Tooltip";
import ErrorDialog from "../utils/ErrorDialog";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import CloseIcon from "@mui/icons-material/Close";
import AddSite from "./AddSite";
import EditSite from "./EditSite";
import DeleteSite from "./DeleteSite";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const SitesList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(true);
  const [errorBanner, setErrorBanner] = useState({
    show: false,
    message: "",
    color: "",
  });
  const [sites, setSites] = useState({});
  const [error, setError] = useState({ show: false, message: "" });
  const [rowCount, setRowCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState({ show: false, site: {} });
  const [add, setAdd] = useState(false);
  const [hist, setHist] = useState({ show: false, site: {}, data: [] });
  const [verifyDelete, setVerifyDelete] = useState({ show: false, site: {} });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!sites.length) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }

      try {
        const res = await axios.get(`http://192.168.0.147:5555/api/sites/`);
        setSites(res.data.data);
        setRowCount(res.data.count);
      } catch (error) {
        setError({
          show: true,
          message: `Грешка при комуникация: ${error}`,
        });

        return;
      }
      setError({ show: false, message: "" });
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
        accessorKey: "name",
        header: "Име",
        size: 200,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "left",
          sx: { fontWeight: 800 },
        },
      },
      {
        accessorKey: "hasVehicles",
        header: "Автопарк",
        size: 100,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "left",
          sx: { fontWeight: 800 },
        },
        Cell: ({ cell }) => {
          if (cell.getValue()) {
            return "ИМА";
          } else {
            return "НЯМА";
          }
        },
      },

      {
        accessorKey: "company",
        header: "Фирма",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "address",
        header: "Адрес",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "phone",
        header: "Телефон",
        size: 250,
        editable: false,
        enableClickToCopy: true,
        enableGlobalFilter: false,
        muiTableBodyCellProps: {
          align: "center",
        },
      },
    ],
    [refresh],
  );

  const handleAddModal = () => {
    setAdd(true);
  };

  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: sites,
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
                setEdit({ show: true, site: row.original });
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
                setVerifyDelete({ show: true, site: row.original });
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
        <Button fullWidth variant="contained" onClick={handleAddModal}>
          Добави обект
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
    <Box>
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
      <DeleteSite
        verifyDelete={verifyDelete}
        setVerifyDelete={setVerifyDelete}
        sites={sites}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
        setIsRefetching={setIsRefetching}
      />
      <EditSite
        edit={edit}
        setEdit={setEdit}
        sites={sites}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
        setIsRefetching={setIsRefetching}
      />
      <AddSite
        add={add}
        setAdd={setAdd}
        sites={sites}
        setRefresh={setRefresh}
        refresh={refresh}
        setAlert={setAlert}
        setError={setError}
        setErrorBanner={setErrorBanner}
        setIsRefetching={setIsRefetching}
      />
      <ErrorDialog error={error} setError={setError} />
      <Box>
        <Box sx={{ width: "99%", margin: "5px" }}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
    </Box>
  );
};

export default SitesList;
