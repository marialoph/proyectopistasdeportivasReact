import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getToken, clearToken } from "../services/auth"; // Asegurar importación
import api from "../services/api";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            const token = getToken();
            if (!token) {
                console.error("No hay token, redirigiendo a login...");
                navigate('/login');
                return;
            }

            try {
                const response = await api.get('/usuario', { // Verifica la URL correcta
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Usuarios obtenidos:", response.data);
                setUsuarios(response.data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);

                // Error 401 - No autorizado
                if (err.response?.status === 401) {
                    clearToken();
                    navigate('/login');
                }
                // Error 403 - Prohibido (falta permisos)
                else if (err.response?.status === 403) {
                    console.error("Acceso denegado, no tiene permisos para ver los usuarios.");
                    navigate('/forbidden'); // O redirige a una página de error 403
                }
                // Otro error
                else {
                    console.error("Error desconocido", err);
                }
            }
        };

        fetchUsuarios();
    }, [navigate]);

    const handleDelete = async (id) => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }
    
        try {
            await api.delete(`/usuario/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Usuario con ID ${id} eliminado`);
    
            // Actualizar la lista de usuarios tras la eliminación
            setUsuarios(usuarios.filter(user => user.id !== id));
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
        }
    };
    

    return (
        <Container>
            <h2>Lista de Usuarios</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.username}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.enabled ? "Activo" : "Inactivo"}</td>
                                <td>{usuario.tipo}</td>
                                <td>
                                    <Button as={Link} to={`/usuario/edit/${usuario.id}`} className="btn btn-success me-2">
                                        Editar
                                    </Button>
                                    <Button className="btn btn-danger" onClick={() => handleDelete(usuario.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No hay usuarios disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default UsuarioList;
