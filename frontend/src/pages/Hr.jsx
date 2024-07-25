import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import HrSite from "../components/HrSite";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      sx={{ width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, width: "100%" }}>
          <Box>{children}</Box>
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Hr = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const [persons, setPersons] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/api/sites")
      .then((res) => {
        setSites(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  console.log(sites);
  const siteNames = () => {
    return sites.map((obj, index) => (
      <Tab
        key={index}
        sx={{ fontWeight: "800" }}
        label={obj.name}
        {...a11yProps(index)}
      />
    ));
  };
  const siteList = () => {
    return sites.map((obj, index) => {
      return (
        <TabPanel key={index} value={value} index={index}>
          <HrSite siteId={obj._id} siteName={obj.name} />
        </TabPanel>
      );
    });
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: "100%",
        backgroundColor: "#9e9e9e",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {siteNames()}
      </Tabs>
      {siteList()}
    </Box>
  );
  //   <Box>{loading ? <CircularProgress /> : ""}</Box>;
};

export default Hr;
