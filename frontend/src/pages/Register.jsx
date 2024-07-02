// import React from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";

// const Register = () => {
//   const navigate = useNavigate();
//   const handleError = (err) =>
//     toast.error(err, {
//       position: "bottom-left",
//     });
//   const handleSuccess = (msg) =>
//     toast.success(msg, {
//       position: "bottom-left",
//     });

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post("http://localhost:5555/register", {
//         ...inputValue,
//       });
//       const { success, message } = data;
//       if (success) {
//         handleSuccess(message);
//         setTimeout(() => {
//           navigate("/vehicles");
//         }, 1000);
//       } else {
//         handleError(message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//     setInputValue({
//       ...inputValue,
//       username: "",
//       password: "",
//       role: "",
//     });
//   };
//   const [inputValue, setInputValue] = useState({
//     username: "",
//     password: "",
//     role: "",
//   });
//   const { username, password } = inputValue;
//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setInputValue({
//       ...inputValue,
//       [name]: value,
//     });
//   };
//   return (
//     <div>
//       CREATE AN ACCOUNT
//       <form onSubmit={handleRegister}>
//         <div>
//           <label htmlFor="username">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={username}
//             placeholder="Username"
//             onChange={handleOnChange}
//           />
//         </div>
//         <div>
//           <label htmlFor="password"></label>
//           <input
//             type="password"
//             name="password"
//             value={password}
//             placeholder="Password"
//             onChange={handleOnChange}
//           />
//         </div>
//         <button type="submit">SUBMIT</button>
//         <span></span>
//       </form>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button, MenuItem, TextField } from "@mui/material";

const Register = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const { username, password } = input;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5555/login", {
        ...input,
      });
      localStorage.setItem("token", data.token);
      const { status, message } = data;
      console.log(data);
      if (status) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/vehicles");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInput({
      ...input,
      username: "",
      password: "",
    });
  };
  return (
    <div className="flex justify-center">
      <div>
        <h2 className="text-2xl text-center"> Регистрация Потребител</h2>
        <div className="bg-gray-300 flex flex-col border-2 border-blue-400 rounded-xl w-[600px] p-4 mx-auto">
          <div className="my-4">
            <TextField
              fullWidth
              name="username"
              select
              label="Потребител:"
              value={username}
              onChange={handleChange}
              variant="filled"
            >
              <MenuItem key={1} value="admin">
                ADMIN
              </MenuItem>
              <MenuItem key={2} value="румен">
                РУМЕН
              </MenuItem>
              <MenuItem key={3} value="любо">
                ЛЮБО
              </MenuItem>
              <MenuItem key={4} value="гост">
                ГОСТ
              </MenuItem>
            </TextField>
          </div>
          <div className="my-4">
            <TextField
              type="password"
              fullWidth
              name="password"
              label="Парола:"
              value={password}
              onChange={handleChange}
              variant="filled"
            />
          </div>
          <div className="my-4">
            <Button onClick={handleSubmit} fullWidth variant="outlined">
              ВЛЕЗ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
