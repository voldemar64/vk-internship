import React from "react";
import Loader from "../loader/Loader";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  loggedIn: boolean;
  [key: string]: any;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                         component: Component,
                                                         loggedIn,
                                                         ...props
                                                       }) => {
  return loggedIn ? <Component {...props} /> : <Loader />;
};

export default ProtectedRoute;