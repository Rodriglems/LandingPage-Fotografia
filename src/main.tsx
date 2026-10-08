
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import Admin from "./app/Admin.tsx";
  import "./styles/index.css";

  const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

  createRoot(document.getElementById("root")!).render(isAdmin ? <Admin /> : <App />);
  