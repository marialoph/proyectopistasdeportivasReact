import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import api from "../services/api";
import { getToken } from "../services/auth"; 

const AddUsuario = () => {
    const [usuario, setUsuario] = useState({
        username: "",
        email: "",
        password: "",
        enabled: true,
        tipo: "USER", 
    });

    const navigate = useNavigate(); 

    // Función para manejar los cambios en los inputs del formulario
    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    // Función para manejar el submit del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const token = getToken();  
        
        if (!token) {
            console.error("No hay token, redirigiendo a login...");
            navigate('/login'); 
            return;
        }

        try {
            console.log("Enviando solicitud para crear usuario", usuario);
            const response = await api.post("/usuario/add", usuario, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            console.log("Usuario creado:", response.data);
            navigate('/usuarios'); 
        } catch (error) {
            console.error("Error al crear usuario:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Container>
            <h2>Agregar Usuario</h2>
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

                <Button type="submit" className="mt-3">Guardar</Button>
            </Form>
        </Container>
    );
};

export default AddUsuario;
