import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import dar_logo from "../resources/dar_logo.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        navigate("/login");
      }
      const { data } = await axios.post("http://192.168.0.147:5555/auth", {
        token,
      });
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
      <div className="flex justify-center">
        <div>
          <h2 className="text-2xl text-center">АВТОМОБИЛЕН КОНТРОЛ</h2>
          <div className="bg-white flex flex-col border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto">
            <div className="my-4">
              <img src={dar_logo} alt="" />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
