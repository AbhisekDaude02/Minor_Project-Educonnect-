import { Navigate, Outlet } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const ProtectedLayout = () => {
  const { isLogging, authLoading } = useContext(AuthContext);

  // Wait until authentication check is completed
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Restoring your Educonnect session...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!isLogging) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <MainNavbar />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
