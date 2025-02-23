import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Navbar expand="lg" style={{ background: "linear-gradient(to right, #1e3c72, #2a5298)" }} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-light">FlavorNest</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
            <Nav.Link as={Link} to="/recipes" className="text-light">Recipes</Nav.Link>
            <Nav.Link as={Link} to="/add-recipe" className="text-light">Add Recipe</Nav.Link>
            <Nav.Link as={Link} to="/profile" className="text-light">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;



