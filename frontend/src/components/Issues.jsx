import axios from "axios";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/bg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import IconButton from "@mui/material/IconButton";
import ErrorDialog from "./ErrorDialog";
import { useMemo } from "react";
import { MRT_Localization_BG } from "material-react-table/locales/bg";
import { darken, lighten, useTheme } from "@mui/material";
import { Box } from "@mui/material";
import { Edit, Delete, DoneOutline } from "@mui/icons-material";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";

const Issues = ({ vehicle, userRole, username }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([false, ""]);
  const [issues, setissues] = useState([]);
  const [refetching, setRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!issues.length) {
        setLoading(true);
      } else {
        setRefetching(true);
      }

      axios
        .get(`http://192.168.0.147:5555/problems/${vehicle._id}`)
        .then((res) => {
          setissues(res.data.data);
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
        accessorKey: "date",
        header: "Дата",
        size: 180,
        enableGlobalFilter: false,
        filterVariant: "date",
        filterFn: "stringDateFn",
        muiTableBodyCellProps: {
          align: "center",
        },
        Cell: ({ cell }) => {
          return dayjs(cell.getValue()).format("DD.MM.YYYY - HH:ss");
        },
      },
      {
        accessorKey: "km",
        header: "км",
        size: 160,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => cell.getValue().toLocaleString() + " км",
        muiTableBodyCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "driverName",
        header: "Водач",
        size: 200,
        editable: false,
        filterVariant: "multi-select",
      },
      {
        accessorKey: "desc",
        header: "Забележка",
        size: 450,
        enableColumnFilter: false,
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    localization: { ...MRT_Localization_BG },
    data: issues,
    rowCount,
    filterFns: {
      stringDateFn: (row, id, filterValue) => {
        return dayjs(row.original[id])
          .format("DD.MM.YYYY")
          .includes(dayjs(filterValue).format("DD.MM.YYYY"));
      },
    },
    enableFullScreenToggle: false,
    enableStickyHeader: true,
    enableFacetedValues: true,
    enableHiding: false,
    enableColumnResizing: true,
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        {!row.original.done && (
          <IconButton
            color="success"
            onClick={() => {
              axios
                .put(`http://192.168.0.147:5555/problems/${row.original._id}`, {
                  ...row.original,
                  done: true,
                })
                .then((res) => {
                  if (issues.filter((item) => !item.done).length === 1) {
                    axios
                      .put(`http://192.168.0.147:5555/vehicle/${vehicle._id}`, {
                        ...vehicle,
                        issue: false,
                      })
                      .then((res) => {})
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                  setTimeout(() => {
                    // window.location.reload();
                  }, 1000);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <DoneOutline />
          </IconButton>
        )}
      </Box>
    ),
    muiTableContainerProps: { sx: { maxHeight: "600px" } },
    muiTableBodyRowProps: ({ isDetailPanel, row, table }) => {
      if (row.original.done) {
        return {
          sx: {
            textDecoration: "line-through",
          },
        };
      }
    },
    initialState: {
      sorting: [
        {
          id: "date",
          desc: true,
        },
        // {
        //   id: "dropoffTime",
        //   desc: true,
        // },
      ],

      pagination: { pageSize: 50, pageIndex: 0 },
      showGlobalFilter: true,
      showColumnFilters: true,
      density: "compact",
      positionToolbarAlertBanner: "bottom",
    },
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [30, 50, 100, 200],
      shape: "rounded",
      variant: "outlined",
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: "0",
      },
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
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="bg">
        <ErrorDialog error={error} setError={setError} />
        {handleLoading()}
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ marginY: "15px" }}>
            <MaterialReactTable table={table} />
          </Box>
        )}
      </LocalizationProvider>
    </Box>
  );
};

export default Issues;
