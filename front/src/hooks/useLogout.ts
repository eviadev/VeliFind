import { useState } from "react";
import axios from "axios";

const useLogout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    try {
      setLoading(true);

      const response = await axios.post(`http://localhost:3001/logout`);
      console.log("Logout successful:", response.data);

      setLoading(false);
    } catch (err) {
      setError("Error logging out. Please try again.");
      setLoading(false);
    }
  };

  return { loading, error, logout };
};

export default useLogout;
