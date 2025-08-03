import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/user/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-base"
  >
    Logout
  </button>
);

};

export default LogoutButton;
