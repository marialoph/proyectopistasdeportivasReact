import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Button, Form, Container } from "react-bootstrap";

const AddReserva = () => {
    const navigate = useNavigate();
    const [fecha, setFecha] = useState("");
    const [instalaciones, setInstalaciones] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]); // 💡 Nuevo estado para almacenar los usuarios
    const [instalacionId, setInstalacionId] = useState("");
    const [horarioId, setHorarioId] = useState("");
    const [usuarioId, setUsuarioId] = useState(""); // 💡 Estado para el usuario seleccionado
    const [error, setError] = useState("");

    // Cargar instalaciones y usuarios al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resInstalaciones = await api.get("/mis-reservas/instalaciones");
                setInstalaciones(resInstalaciones.data);

                const resUsuarios = await api.get("/mis-reservas/usuarios");
            console.log("Usuarios obtenidos:", resUsuarios.data); // 🐞 Debug
            setUsuarios(resUsuarios.data);
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        };
        fetchData();
    }, []);

    // Cargar horarios cuando haya instalación y fecha
    useEffect(() => {
        if (instalacionId && fecha) {
            const fetchHorarios = async () => {
                try {
                    const res = await api.get(`/mis-reservas/horario/instalacion/${instalacionId}/fecha/${fecha}`);
                    setHorarios(res.data);
                } catch (err) {
                    console.error("Error cargando horarios:", err);
                }
            };
            fetchHorarios();
        }
    }, [instalacionId, fecha]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos
    
        if (!fecha || !instalacionId || !horarioId || !usuarioId) {
            setError("Todos los campos son obligatorios.");
            return;
        }
    
        const nuevaReserva = { 
            fecha, 
            horario: { id: horarioId }, 
            usuario: { id: usuarioId }
        };
    
        try {
            const response = await api.post("/mis-reservas", nuevaReserva);
            alert(response.data); // Mensaje de éxito
            navigate("/mis-reservas");
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data); 
            } else {
                setError("Error al procesar la reserva. Intenta de nuevo.");
            }
        }
    };
    return (
        <Container>
            <h3>Añadir Nueva Reserva</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
              
                <Form.Group>
                    <Form.Label>Fecha de la Reserva</Form.Label>
                    <Form.Control
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </Form.Group>

               
                <Form.Group>
    <Form.Label>Seleccionar Usuario</Form.Label>
    <Form.Select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
        <option value="">-- Selecciona un usuario --</option>
        {usuarios.map(user => (
            <option key={user.id} value={user.id}>
                {user.nombre || user.fullname || user.username} 
            </option>
        ))}
    </Form.Select>
</Form.Group>


              
                <Form.Group>
                    <Form.Label>Seleccionar Instalación</Form.Label>
                    <Form.Select value={instalacionId} onChange={(e) => setInstalacionId(e.target.value)}>
                        <option value="">-- Selecciona una instalación --</option>
                        {instalaciones.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

               
                <Form.Group>
                    <Form.Label>Seleccionar Horario Disponible</Form.Label>
                    <Form.Select value={horarioId} onChange={(e) => setHorarioId(e.target.value)}>
                        <option value="">-- Selecciona un horario --</option>
                        {horarios.length > 0 ? (
                            horarios.map(horario => (
                                <option key={horario.id} value={horario.id}>
                                    {horario.horaInicio} - {horario.horaFin}
                                </option>
                            ))
                        ) : (
                            <option value="">Sin horarios disponibles</option>
                        )}
                    </Form.Select>
                </Form.Group>

                <Button type="submit">Guardar</Button>
                <Button variant="secondary" onClick={() => navigate("/mis-reservas")}>Cancelar</Button>
            </Form>
        </Container>
    );
};

export default AddReserva;
