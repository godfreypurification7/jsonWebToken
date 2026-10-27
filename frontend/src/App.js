import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import Protected from "./components/Protected";
import Content from "./components/Content";

export const UserContext = React.createContext(null);

function AppContent({ user, setUser }) {
  const navigate = useNavigate();

  const logOutCallback = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // A missing /logout endpoint may return 404; still clear local state.
      console.error("Logout request failed:", error);
    } finally {
      setUser({});
      navigate("/");
    }
  };

  return (
    <div className="app">
      <Navigation logOutCallback={logOutCallback} />

      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </div>
  );
}

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRefreshToken = async () => {
      try {
        const response = await fetch("http://localhost:4000/refresh_token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          setUser({});
          return;
        }

        const result = await response.json();
        setUser({
          accessToken: result.accessToken ?? result.accesstoken ?? "",
        });
      } catch (error) {
        console.error("Could not refresh session:", error);
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    checkRefreshToken();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={[user, setUser]}>
      <BrowserRouter>
        <AppContent user={user} setUser={setUser} />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

// https://www.youtube.com/watch?v=x5gLL8-M9Fo