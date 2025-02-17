// App.jsx o donde definas el enrutador
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InstalacionesPage from "./pages/InstalacionesPage";
import InstalacionDeletePage from "./pages/InstalacionDeletePage";
import InstalacionFormPage from "./pages/InstalacionFormPage";
import ReservasPage from "./pages/ReservasPage";

import 'bootstrap/dist/css/bootstrap.min.css';

import AddReservaPage from "./pages/AddReservaPage";
import EditReservaPage from "./pages/EditReservaPage";
import DeleteReservaPage from "./pages/DeleteReservaPage";
import UsuarioPage from "./pages/UsuarioPage";
import DeleteUsuarioPage from "./pages/DeleteUsuarioPage";



const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // Esto indica que es la ruta por defecto para "/"
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "instalaciones",
        element: <InstalacionesPage />,
      },
      {
        path: "instalacion/add",
        element: <InstalacionFormPage />,
      },
     {
       path: "instalacion/edit/:id",
       element: <InstalacionFormPage />,
     },
      {
        path: "instalacion/del/:id",
        element: <InstalacionDeletePage />,
      },
      {
        path: "mis-reservas",
        element: <ReservasPage />,
      },
     

      {
        path: "mis-reservas/add",
        element: <AddReservaPage />,
      },
      {
        path: "mis-reservas/edit/:id",
        element: <EditReservaPage />,
      },
      {
        path: "mis-reservas/del/:id",
        element: <DeleteReservaPage/>
      },
      {
        path: "usuario",
        element: <UsuarioPage/>
      },
      {
        path: "usuario/delete/:id",
        element: <DeleteUsuarioPage/>
      }
     
    
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
