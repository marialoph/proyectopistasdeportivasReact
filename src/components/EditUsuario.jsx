import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import api from "../services/api";
import { getToken } from "../services/auth";

const EditUsuario = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Estado para almacenar los datos del usuario
  const [usuario, setUsuario] = useState({
    username: "",
    email: "",
    password: "",
    tipo: "ADMIN", 
  });

  // Estado de carga
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = getToken(); 

      if (!token) {
        console.error("No hay token, redirigiendo a login...");
        navigate("/login"); 
        return;
      }

      try {
        // Solicitud GET para obtener los datos del usuario
        const response = await api.get(`/api/usuario/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsuario(response.data); // Establece los datos del usuario en el estado
        setLoading(false); // Indica que los datos se han cargado
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [id, navigate]);

  // Manejador para actualizar el estado cuando se cambian los campos del formulario
  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken(); 

    if (!token) {
      console.error("No hay token, redirigiendo a login...");
      navigate("/login"); 
      return;
    }

    try {
      // Solicitud PUT para actualizar los datos del usuario
      const response = await api.put(`/api/usuario/${id}`, usuario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Usuario actualizado:", response.data);
      navigate("/usuarios"); 
    } catch (error) {
      console.error("Error al actualizar usuario:", error.response ? error.response.data : error.message);
    }
  };

  // Si los datos están cargando, mostramos un mensaje de espera
  if (loading) {
    return <Container><h2>Cargando datos del usuario...</h2></Container>;
  }

  return (
    <Container>
      <h2>Editar Usuario</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={usuario.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={usuario.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Rol</Form.Label>
          <Form.Select
            name="tipo"
            value={usuario.tipo}
            onChange={handleChange}
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="mt-3">
          Guardar Cambios
        </Button>
      </Form>
    </Container>
  );
};

export default EditUsuario;
