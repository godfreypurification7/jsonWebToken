import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const Content = () => {
  const [user] = useContext(UserContext);

  if (!user?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <div>This is the content</div>;
};

export default Content;