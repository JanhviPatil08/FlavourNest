import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation(); // To track active page

  return (
    <Navbar expand="lg" style={{ 
      background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", 
      borderBottom: "2px solid rgba(255, 255, 255, 0.2)", 
      backdropFilter: "blur(10px)", 
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
    }} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          FlavorNest
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/recipes" className={`nav-link ${location.pathname === "/recipes" ? "active" : ""}`}>
              Recipes
            </Nav.Link>
            <Nav.Link as={Link} to="/add-recipe" className={`nav-link ${location.pathname === "/add-recipe" ? "active" : ""}`}>
              Add Recipe
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;





