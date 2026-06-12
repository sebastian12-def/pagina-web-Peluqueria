import React, { useState } from "react";
import { clearSession, getStoredUser } from "./api.js";
import { Shell } from "./components/Shell.jsx";
import { AdminDashboard } from "./views/AdminDashboard.jsx";
import { AuthScreen } from "./views/AuthScreen.jsx";
import { ClientDashboard } from "./views/ClientDashboard.jsx";

export function App() {
  const [user, setUser] = useState(getStoredUser());
  const [view, setView] = useState("login");

  function logout() {
    clearSession();
    setUser(null);
    setView("login");
  }

  if (user?.role === "CLIENT") {
    return <Shell user={user} onLogout={logout}><ClientDashboard /></Shell>;
  }

  if (user?.role === "BARBER_ADMIN") {
    return <Shell user={user} onLogout={logout}><AdminDashboard user={user} /></Shell>;
  }

  return <AuthScreen view={view} setView={setView} onAuth={setUser} />;
}
