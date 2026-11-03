import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { FeedProvider } from "./context/feedContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FeedProvider>
        <App />
      </FeedProvider>
    </AuthProvider>
  </StrictMode>,
);
