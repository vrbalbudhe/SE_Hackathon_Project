import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Add missing imports
import { PublicLayout } from "./layouts/PublicLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import Homepage from "./pages/Homepage";
import React from "react";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ProfilePageAdmin from "./pages/ProfilePageAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        {
          path: "/",
          element: <Homepage />,
        },
        {
          path: "/auth",
          element: <AuthPage />,
        },
      ],
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [
        {
          path: "/user/:id",
          element: <ProfilePage />,
        },
        {
          path: "/admin/dashboard",
          element: <AdminDashboard />,
          element: <ProfilePageAdmin/>,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
