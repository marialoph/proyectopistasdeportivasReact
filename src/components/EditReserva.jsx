import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import api from "../services/api";

const EditUsuario = () => {
    const { id } = useParams(); // Obtener el ID desde la URL
    const navigate = useNavigate();

    // Estados para manejar los datos del usuario
    const [usuario, setUsuario] = useState({
        username: "",
        email: "",
        password: "",
        tipo: "USER",
    });

    // Estado para manejar errores
    const [error, setError] = useState("");

    useEffect(() => {
        // Asegurarse de que `id` está presente
        if (!id) {
            setError("No se pudo obtener el ID del usuario.");
            return;
        }

        const cargarUsuario = async () => {
            try {
                console.log("Cargando usuario con ID:", id);
                const response = await api.get(`/api/usuario/${id}`);
                console.log("Datos del usuario obtenidos:", response.data);

                // Si la respuesta es válida, se actualizan los datos del estado
                if (response.data) {
                    setUsuario({
                        username: response.data.username || "",
                        email: response.data.email || "",
                        password: response.data.password || "",
                        tipo: response.data.tipo || "USER",
                    });
                } else {
                    setError("No se encontró el usuario.");
                }
            } catch (err) {
                console.error("Error al cargar usuario:", err);
                setError("No se pudo cargar los datos del usuario.");
            }
        };

        cargarUsuario();
    }, [id]);

    // Manejador para actualizar el estado cuando cambia el formulario
    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    // Manejador para enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario.username || !usuario.email || !usuario.password || !usuario.tipo) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        try {
            // Enviar los datos actualizados al backend
            await api.put(`/api/usuario/${id}`, usuario);
            navigate("/usuarios"); 
        } catch (err) {
            console.error("Error al actualizar el usuario:", err);
            setError("Error al actualizar el usuario. Intenta de nuevo.");
        }
    };

    return (
        <Container>
            <h3>Editar Usuario</h3>
            {error && <div className="alert alert-danger">{error}</div>}
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
                    <Form.Label>Tipo de Usuario</Form.Label>
                    <Form.Select
                        name="tipo"
                        value={usuario.tipo}
                        onChange={handleChange}
                    >
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                    </Form.Select>
                </Form.Group>

                <Button type="submit">Guardar Cambios</Button>
                <Button variant="secondary" onClick={() => navigate("/usuarios")}>Cancelar</Button>
            </Form>
        </Container>
    );
};

export default EditUsuario;
