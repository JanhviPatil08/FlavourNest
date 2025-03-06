import { useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isRegister
        ? "https://flavournest.onrender.com/auth/register"
        : "https://flavournest.onrender.com/auth/login";

      const response = await axios.post(url, formData, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        toast.success(isRegister ? "Registration successful! Please login." : "Login successful!");

        if (!isRegister) {
          localStorage.setItem("token", response.data.token); // ✅ Store token for authentication
          navigate("/profile"); // ✅ Redirect after login
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Login/Register Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center text-success fw-bold">
            {isRegister ? "Join FlavourNest" : "Welcome Back"}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            {isRegister && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit" variant="success" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : isRegister ? "Register" : "Login"}
            </Button>
          </Form>

          <p className="text-center mt-3">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Login" : "Sign Up"}
            </span>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
