import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container, Card } from "react-bootstrap";
import api from "../services/api";

const DeleteReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reserva, setReserva] = useState(null);

    // Cargar la reserva al principio
    useEffect(() => {
        const cargarReserva = async () => {
            try {
                const response = await api.get(`/mis-reservas/${id}`);
                setReserva(response.data);
            } catch (err) {
                console.log("Error al obtener reserva:", err);
            }
        };

        cargarReserva();
    }, [id]);

    // Función para manejar la eliminación
    const handleDelete = async () => {
        console.log("ID de la reserva a eliminar:", id);
        try {
            const token = localStorage.getItem("token"); 
            const response = await api.delete(`/mis-reservas/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`  
                }
            });
            console.log("Reserva eliminada:", response.data);
            if (response.status === 200) {
                navigate("/mis-reservas");
            } else {
                console.log("Error al eliminar reserva, estado no esperado", response);
            }
        } catch (err) {
            console.error("Error al eliminar reserva:", err);
            if (err.response) {
                console.error("Detalles del error:", err.response.data);
                console.error("Código de estado:", err.response.status);
            }
        }
    };
    
    

    if (!reserva) {
        return <p>Cargando reserva...</p>;
    }

    return (
        <Container>
            <h3>¿Seguro que deseas eliminar esta reserva?</h3>

          
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Detalles de la Reserva</Card.Title>
                    <p><strong>Fecha:</strong> {reserva.fecha}</p>
                    <p><strong>Instalación:</strong> {reserva.horario.instalacion.nombre}</p>
                    <p><strong>Horario:</strong> {reserva.horario.horaInicio} - {reserva.horario.horaFin}</p>
                </Card.Body>
            </Card>

          
            <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
            <Button variant="secondary" onClick={() => navigate("/mis-reservas")}>Cancelar</Button>
        </Container>
    );
};

export default DeleteReserva;
