import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import api from "../services/api";

const EditReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [fecha, setFecha] = useState("");
    const [instalaciones, setInstalaciones] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [instalacionId, setInstalacionId] = useState("");
    const [horarioId, setHorarioId] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resReserva = await api.get(`/mis-reservas/${id}`);
                const reserva = resReserva.data;

                setFecha(reserva.fecha);
                setInstalacionId(reserva.horario.instalacion.id);
                setHorarioId(reserva.horario.id);
                setUsuarioId(reserva.usuario.id);

                const resInstalaciones = await api.get("/mis-reservas/instalaciones");
                setInstalaciones(resInstalaciones.data);

                const resUsuarios = await api.get("/mis-reservas/usuarios");
                setUsuarios(resUsuarios.data);

                cargarHorarios(reserva.horario.instalacion.id, reserva.fecha);
            } catch (err) {
                console.log("Error al cargar datos:", err);
            }
        };

        cargarDatos();
    }, [id]);

    const cargarHorarios = async (instalacionId, fechaSeleccionada) => {
        if (!instalacionId || !fechaSeleccionada) return;
        try {
            const resHorarios = await api.get(`/mis-reservas/horario/instalacion/${instalacionId}/fecha/${fechaSeleccionada}`);
            setHorarios(resHorarios.data);
        } catch (err) {
            console.log("Error al obtener horarios:", err);
            setHorarios([]);
        }
    };

    // Verificar si la fecha es válida
    const verificarFecha = async (fechaSeleccionada) => {
        try {
            const res = await api.post("/mis-reservas/validar-fecha", { fecha: fechaSeleccionada });
            if (res.data.error) {
                setError(res.data.error); // Si hay error, lo mostramos
            } else {
                setError(""); // Si la fecha es válida, limpiamos el error
            }
        } catch (err) {
            console.error("Error al verificar la fecha:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos
    
        // Verificar que la fecha esté en el formato correcto
        const hoy = new Date();
        const fechaSeleccionada = new Date(fecha);
    
        // Asegurar que la fecha no sea pasada
        if (fechaSeleccionada < hoy) {
            setError("No se pueden hacer reservas para fechas pasadas o del día actual.");
            return;
        }
    
        // Verificar si la fecha está dentro de las 2 semanas de antelación
        const dosSemanasDespues = new Date();
        dosSemanasDespues.setDate(hoy.getDate() + 14);
        if (fechaSeleccionada > dosSemanasDespues) {
            setError("No puedes reservar con más de dos semanas de anticipación.");
            return;
        }
    
        if (!fecha || !instalacionId || !horarioId || !usuarioId) {
            setError("Todos los campos son obligatorios.");
            return;
        }
    
        const reservaActualizada = { 
            fecha, 
            horario: { id: horarioId }, 
            usuario: { id: usuarioId }
        };
    
        try {
            await api.put(`/mis-reservas/${id}`, reservaActualizada);
            navigate("/mis-reservas"); // Redirigir sin mostrar mensaje de éxito
        } catch (err) {
            setError("Error al actualizar la reserva. Intenta de nuevo.");
        }
    };
    
    return (
        <Container>
            <h3>Editar Reserva</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
                {/* Fecha */}
                <Form.Group>
                    <Form.Label>Fecha de la Reserva</Form.Label>
                    <Form.Control
                        type="date"
                        value={fecha}
                        onChange={(e) => {
                            setFecha(e.target.value);
                            cargarHorarios(instalacionId, e.target.value);
                            verificarFecha(e.target.value); // Verificar la fecha cuando cambia
                        }}
                    />
                </Form.Group>

                {/* Usuario */}
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

                {/* Instalación */}
                <Form.Group>
                    <Form.Label>Seleccionar Instalación</Form.Label>
                    <Form.Select 
                        value={instalacionId} 
                        onChange={(e) => {
                            setInstalacionId(e.target.value);
                            cargarHorarios(e.target.value, fecha);
                        }}
                    >
                        <option value="">-- Selecciona una instalación --</option>
                        {instalaciones.map(inst => (
                            <option key={inst.id} value={inst.id}>{inst.nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* Horario */}
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

                <Button type="submit">Guardar Cambios</Button>
                <Button variant="secondary" onClick={() => navigate("/mis-reservas")}>Cancelar</Button>
            </Form>
        </Container>
    );
};

export default EditReserva;

