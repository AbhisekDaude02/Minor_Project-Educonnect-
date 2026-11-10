import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeaturesPage from "./pages/FeaturesPage";
import HowWorks from "./pages/HowWorks";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Team from "./pages/Team";
import { Toaster } from "react-hot-toast";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Message from "./pages/main/Message";
import Feed from "./pages/main/Feed";
import Note from "./pages/main/Note";
import Jobs from "./pages/main/Job";
import Friend from "./pages/main/Friend";
import MyProfile from "./pages/main/MyProfile";
import Notification from "./pages/main/Notification";
import ViewProfile from "./pages/main/ViewProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "/about",
        element: <AboutPage />,
      },

      {
        path: "/features",
        element: <FeaturesPage />,
      },

      {
        path: "/works",
        element: <HowWorks />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/team",
        element: <Team />,
      },
    ],
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },

  {
    path:"/educonnect",
    element:<ProtectedLayout/>,
    children:[
      {
        index:true,
        element:<Feed/>
      },

      {
        path:"message",
        element:<Message/>
      },
      {
        path:"notes",
        element:<Note/>
      },

      {
        path:"job",
        element:<Jobs/>
      },

      {
        path:"notification",
        element:<Notification/>
      },
      {
        path:"friend",
        element:<Friend/>
      },
      {
        path:"profile",
        element:<MyProfile/>
      },
       {
        path:"profile/:userId",
        element:<ViewProfile/>
      }
    ]
  }

]);

const App = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#ffffff",
            padding: "14px 18px",
          },
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
};
export default App;
