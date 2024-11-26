import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useState } from "react";

const Records = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState({});
  useEffect(() => {
    axios
      .get(`http://192.168.0.147:5555/api/records/`)
      .then((res) => {
        setRecords(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const columns = [
    {
      name: "Тръгване",
      options: {
        sortDirection: "desc",
        customBodyRender: (value) => dayjs(value).format("DD/MM/YYYY - HH:mm"),
        filterOptions: {
          logic: (date, filters, row) => {
            console.log(date);
            if (filters.length) return !date.includes(filters);
          },
          names: records.data
            ? records.data
                .map((rec) => dayjs(rec.pickupTime).format("DD/MM/YYYY"))
                .filter((rec, index, records) => records.indexOf(rec) === index)
            : [],
        },
      },
    },
    {
      name: "Връщане",
      options: {
        customBodyRender: (value) =>
          value ? dayjs(value).format("DD/MM/YYYY - HH:mm") : "в движение",
        filterOptions: {
          logic: (date, filters, row) => {
            console.log(date);
            if (filters.length) return !date.includes(filters);
          },
          names: records.data
            ? records.data
                .map((rec) => dayjs(rec.dropoffTime).format("DD/MM/YYYY"))
                .filter((rec, index, records) => records.indexOf(rec) === index)
            : [],
        },
      },
    },
    {
      name: "Водач",
    },
    {
      name: "Кола",
    },
    { name: "Номер" },
    {
      name: "Километри на тръгване",
      options: {
        setCellProps: () => {
          // return { align: "center" };
        },
        filter: false,
      },
    },
    {
      name: "Километри на връщане",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
        customBodyRender: (value) => (value ? value : "в движение"),
        filter: false,
      },
    },
    {
      name: "Маршрут",
      options: {
        setCellProps: () => {
          // return { align: "center" };
        },
        customBodyRender: (value) => (value ? value : "в движение"),
      },
    },
    {
      name: "Забележки",
      options: {
        setCellProps: () => {
          return { align: "center" };
        },
      },
    },
  ];
  const options = {
    filterType: "dropdown",
    selectableRows: false,
    download: false,
    print: false,
    rowsPerPage: 30,
    rowsPerPageOptions: [30, 50, 100],
    // expandableRowsOnClick: true,
    // expandableRows: true,
    textLabels: {
      body: {
        noMatch: "Нищо не е намерено",
      },
      pagination: {
        next: "Следваща страница",
        previous: "Предишна страница",
        rowsPerPage: "Покажи по:",
        displayRows: "от", // 1-10 of 30
      },
      toolbar: {
        search: "Търсене",
        downloadCsv: "Изтегли CSV",
        print: "Принтирай",
        viewColumns: "Показване на колони",
        filterTable: "Филтри",
      },
      filter: {
        title: "ФИЛТРИ",
        reset: "изчисти",
      },
      viewColumns: {
        title: "Покажи колони",
      },
      selectedRows: {
        text: "rows(s) deleted",
        delete: "Delete",
      },
    },
  };
  const data = records.data
    ? records.data.map((obj) => {
        return [
          obj.pickupTime,
          obj.dropoffTime,
          obj.driverName,
          obj.vehicleModel,
          obj.vehicleReg,
          obj.pickupKm,
          obj.dropoffKm,
          obj.destination,
          obj.problem,
        ];
      })
    : [];

  return (
    <Box sx={{ margin: "5px" }}>
      <MUIDataTable
        title={"ДВИЖЕНИЕ"}
        data={data}
        columns={columns}
        options={options}
      />
    </Box>
  );
};

export default Records;
