import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { getToken, clearToken } from "../services/auth";

const DeleteUsuario = () => {
    const [usuario, setUsuario] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchUsuario = async () => {
            const token = getToken();
            if (!token) {
                console.error("No hay token, redirigiendo a login...");
                navigate('/login');
                return;
            }

            try {
                const response = await api.get(`/usuario/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsuario(response.data);
            } catch (err) {
                console.error("Error al obtener usuario:", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    clearToken();
                    navigate('/login');
                }
            }
        };

        fetchUsuario();
    }, [id, navigate]);

    const handleDelete = async () => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await api.delete(`/usuario/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Usuario eliminado");
            navigate('/usuarios'); 
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
        }
    };

    return (
        <Container>
            <h2>Eliminar Usuario</h2>
            <p>¿Estás seguro de que deseas eliminar el usuario {usuario.username}?</p>
            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
            <Button variant="secondary" onClick={() => navigate('/usuarios')} className="ms-2">Cancelar</Button>
        </Container>
    );
};

export default DeleteUsuario;
