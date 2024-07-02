import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://localhost:5555/", { token });
      const { status, user } = data;
      setUsername(user);
      console.log(data);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (localStorage.removeItem("token"), navigate("/login"));
    };
    verifyUser();
  }, [token, navigate]);
  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
