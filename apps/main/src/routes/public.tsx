
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Login = lazy(() => import("@/app/auth/Login"));
const Register = lazy(() => import("@/app/auth/Register"));
const ActivateAccount = lazy(() => import("@/app/auth/ActivateAccount"));
const Preview = lazy(() => import("@/app/generics/preview"));


export const publicRoutes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/activate-account",
    element: <ActivateAccount />,
  },
  
];
