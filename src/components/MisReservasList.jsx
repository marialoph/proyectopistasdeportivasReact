import { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const MisReservasList = () => {
    const [reservas, setReservas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const peticion = async () => {
            try {
                const response = await api.get('/mis-reservas');
                console.log(response.data); 
                setReservas(response.data);
            } catch (err) {
                navigate('/login');
                console.log(err);
            }
        };
        peticion();
    }, []); 

    return (
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Instalación</th>
                        <th>Hora reserva</th>
                        <th>Fecha reserva</th>
                        <th>Usuario</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>{reserva.id}</td>
                            <td>{reserva.horario.instalacion.nombre}</td>
                            <td>{reserva.horario.horaInicio}</td>
                            <td>{reserva.fecha}</td>

                          
                            <td style={{ color: 'black' }}>
                                {reserva.usuario ? reserva.usuario.username : 'Sin usuario'}
                            </td>

                            <td>
                                <Button as={Link} to={`/mis-reservas/edit/${reserva.id}`} className="btn-success">
                                    Editar
                                </Button>
                            </td>
                            <td>
                                <Button as={Link} to={`/mis-reservas/del/${reserva.id}`} className="btn-danger">
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default MisReservasList;
