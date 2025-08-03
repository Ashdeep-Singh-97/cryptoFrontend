import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const WithAuth = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/verify`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setLoading(false);
        } else {
          navigate("/");
        }
      } catch (err) {
        navigate("/");
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) return null;

  return children;
};

export default WithAuth;
