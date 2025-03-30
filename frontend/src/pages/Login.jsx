import { useState } from "react";
import { Container, Card, Form, Button, Spinner, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate email format
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(formData.email)) {
      toast.error("❌ Invalid email format!");
      setLoading(false);
      return;
    }

    try {
      const url = isRegister
        ? "https://flavournest.onrender.com/auth/register"
        : "https://flavournest.onrender.com/auth/login";

      const response = await axios.post(url, formData);

      if (response.status === 200 || response.status === 201) {
        toast.success(isRegister ? "🎉 Registration successful! Please login." : "✅ Login successful!");

        if (!isRegister) {
          const { token, user } = response.data;
          if (!token) throw new Error("Token not received from server.");

          // ✅ Store token & user info
          localStorage.setItem("authToken", token);
          localStorage.setItem("user", JSON.stringify(user));

          // ✅ Ensure Axios always has the token
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // ✅ Redirect to Home
          setTimeout(() => {
            navigate("/home", { replace: true });
          }, 500);
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
          <h2 className="text-center text-success fw-bold">{isRegister ? "Join FlavourNest" : "Welcome Back"}</h2>
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
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button type="submit" variant="success" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : isRegister ? "Register" : "Login"}
            </Button>
          </Form>
          <div className="text-center mt-3">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsRegister(false)}>
                  Login
                </Button>
              </p>
            ) : (
              <p>
                New here?{" "}
                <Button variant="link" className="p-0" onClick={() => setIsRegister(true)}>
                  Register
                </Button>
              </p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;




