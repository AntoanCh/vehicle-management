import axios from "axios";
export const verifyUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  const { data } = await axios.post("http://192.168.0.147:5555/auth", {
    token,
  });
  const { status, user } = data;
  return data;
};
