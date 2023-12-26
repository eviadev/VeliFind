import { useState } from "react";

const useRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        console.log("Registration successful");
      } else {
        setError("Registration failed. Please check your input and try again.");
        console.error("Registration failed");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleRegister,
  };
};

export default useRegister;
