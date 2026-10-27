
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Registration failed");
      }

      console.log(result.message || "Registration successful");

      // Redirect to the login page after registration.
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

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
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {error && <p className="error">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Register;
