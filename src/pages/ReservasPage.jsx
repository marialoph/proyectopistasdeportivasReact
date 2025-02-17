import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import MisReservasList from "../components/MisReservasList";


const ReservasPage = () => {


    return (<>
        <h3>Mis reservas</h3>
        <MisReservasList />
        <Button as={Link} to="/mis-reservas/add">
            Añadir una nueva reserva
        </Button>
    </>);
}

export default ReservasPage;