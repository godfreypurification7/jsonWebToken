
import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const Protected = () => {
  const [user] = useContext(UserContext);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.accessToken) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProtected() {
      try {
        const response = await fetch(
          "http://localhost:4000/protected",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to fetch protected content"
          );
        }

        if (!cancelled) {
          setContent(result.data || "No protected content available");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Protected request failed:", error);
          setContent("Unable to load protected content");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProtected();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div>Loading protected content...</div>;
  }

  return <div>{content}</div>;
};

export default Protected;
