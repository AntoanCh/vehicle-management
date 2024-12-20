import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SitesList from "../../components/hr/SitesList.jsx";

const Users = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://192.168.0.147:5555/api/sites")
      .then((res) => {
        setSites(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      {loading ? <CircularProgress /> : <SitesList sites={sites} />}
    </div>
  );
};

export default Users;
