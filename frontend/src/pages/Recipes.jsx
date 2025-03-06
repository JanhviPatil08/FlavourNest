import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import RecipeCard from "./RecipeCard";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // ✅ Track user authentication

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Check if user is logged in
    axios
      .get("https://flavournest.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setUser(res.data);
        fetchRecipes(token);
      })
      .catch(() => {
        navigate("/login"); // Redirect to login if not authenticated
      });
  }, [navigate]);

  const fetchRecipes = (token) => {
    axios
      .get("https://flavournest.onrender.com/recipes", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setRecipes(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load recipes. Please try again.");
        setLoading(false);
      });
  };

  return (
    <Container className="mt-5">
      <h1 className="text-success text-center">Explore Recipes</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : (
        <Row className="mt-4">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Col md={4} key={recipe._id} className="mb-4">
                <RecipeCard recipe={recipe} />
              </Col>
            ))
          ) : (
            <p className="text-center">No recipes available.</p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Recipes;


