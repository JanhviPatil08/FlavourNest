import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-3">
      <Container className="text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} FlavorNest | All Rights Reserved
        </p>
        <p className="small">
          Made with ❤️ for food lovers
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
