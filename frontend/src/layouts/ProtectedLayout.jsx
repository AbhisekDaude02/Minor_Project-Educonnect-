import { Navigate, Outlet } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import Footer from "../components/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
const ProtectedLayout = () => {

    const {isLogging} = useContext(AuthContext)

    if(!isLogging){
        return <Navigate to="/login" replace/>
    }
  return (
    <>
      <MainNavbar/>
      <Outlet />
      <Footer />
    </>
  );
};

export default ProtectedLayout;
