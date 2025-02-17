import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { getToken, clearToken } from "../services/auth";
import api from "../services/api";

function NavBar() {
  const [isLogged, setIsLogged] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    console.log("Token obtenido:", token);
    if (!token) {
      setIsLogged(false);
      setTipoUsuario("");
      return;
    }

    setIsLogged(true);

    // Solo hace la solicitud si el token está presente
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/usuario/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Usuario recibido:", response.data);
        if (response.data?.tipo) {
          setTipoUsuario(response.data.tipo.toUpperCase().trim());
          console.log("Tipo de usuario actualizado:", response.data.tipo.toUpperCase().trim());
        }
      } catch (err) {
        console.error("Error obteniendo usuario:", err);
        if (err.response?.status === 401) {
          clearToken();
          navigate("/login");
        } else {
          console.error("Error inesperado:", err.message);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLogged(false);
    navigate("/login");
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Gestión de reservas</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/instalaciones">Instalaciones</Nav.Link>

            {isLogged && (
              <>
                <Nav.Link as={Link} to="/mis-reservas">Mis reservas</Nav.Link>
                <Nav.Link as={Link} to="/usuario">Usuarios</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}

            {!isLogged && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
