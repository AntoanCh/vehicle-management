import axios from "axios";
export const verifyUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const { data } = await axios.post("http://localhost:5555/", { token });
  const { status, user } = data;
  return data;
};
