import { Container } from "react-bootstrap";
import UsuarioList from "../components/UsuarioList";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const UsuarioPage = () => {
    return (
        <Container>
            <UsuarioList />
            <Button as={Link} to="/usuario/add">
            Añadir un nuevo ususario
        </Button>
        </Container>
    );
};

export default UsuarioPage;
