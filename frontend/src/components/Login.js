
import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Login = () => {
  const [user, setUser] = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      if (result.accessToken) {
        setUser({
          accessToken: result.accessToken,
        });

        navigate("/content", { replace: true });
      } else {
        setError(result.error || "No access token received");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    }
  };

  if (user?.accessToken) {
    return <Navigate to="/content" replace />;
  }

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="login-input">
          <input
            value={email}
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
          />

          <input
            value={password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          <button type="submit">Login</button>

          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
