import { Button } from "react-bootstrap";
import InstalacionesList from "../components/InstalacionesList";
import { Link } from "react-router-dom";


const InstallationPage = () => {


    return (<>
        <h3>Listado de instalaciones</h3>
        <InstalacionesList />
        <Button as={Link} to="/instalacion/add">
            Añadir una nueva instalacion
        </Button>
    </>);
}

export default InstallationPage;