import { Container } from "react-bootstrap";
import UsuarioList from "../components/UsuarioList";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const UsuarioPage = () => {
    return (
        <Container>
            <h1>Gestión de Usuarios</h1>
            <UsuarioList />
            <Button as={Link} to="/mis-reservas/add">
            Añadir un nuevo ususario
        </Button>
        </Container>
    );
};

export default UsuarioPage;
