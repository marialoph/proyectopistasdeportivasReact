import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RootLayout = () => {
  return (
    <>
      <NavBar />
      
      {/* Contenedor principal para el contenido de la página */}
      <Container className="my-4">
        <Outlet />
      </Container>
      
      {/* Footer */}
      <footer className="bg-dark text-white py-3 mt-auto">
        <Container>
          <Row>
            <Col className="text-center">
              &copy; {new Date().getFullYear()} 
              IES Virgen del Carmen. 
              CFGS Desarrollo de Aplicaciones Multiplataforma.
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default RootLayout;
