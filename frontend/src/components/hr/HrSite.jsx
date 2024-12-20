import React, { useState, useEffect } from "react";
import PeopleList from "./PeopleList";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

const HrSite = ({ siteId, siteName, sites }) => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  useEffect(() => {
    setLoading(true);
    if (siteId === 0) {
      axios
        .get(`http://192.168.0.147:5555/api/person/`)
        .then((res) => {
          setPeople(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      axios
        .get(`http://192.168.0.147:5555/api/person/site/${siteId}`)
        .then((res) => {
          setPeople(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <PeopleList
          sites={sites}
          people={people}
          siteName={siteName}
          siteId={siteId}
        />
      )}
    </Box>
  );
};

export default HrSite;
