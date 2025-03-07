import { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission for registration or login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const url = isRegister
        ? "https://flavournest.onrender.com/auth/register"
        : "https://flavournest.onrender.com/auth/login";
  
      const response = await axios.post(url, formData);
  
      if (response.status === 200 || response.status === 201) {
        toast.success(isRegister ? "🎉 Registration successful! Please login." : "✅ Login successful!");
  
        if (!isRegister) {
          const token = response.data.token;
  
          if (!token) {
            throw new Error("Token not received from server.");
          }
  
          // ✅ Store token properly
          localStorage.setItem("authToken", token);  
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
          // ✅ Redirect after login
          navigate("/profile");
        }
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong! Please try again.");
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
