import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // ✅ Track user authentication

  useEffect(() => {
    // ✅ Check if user is logged in
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        fetchRecipes();
      })
      .catch(() => {
        navigate("/login"); // Redirect to login if not authenticated
      });
  }, [navigate]);

  const fetchRecipes = () => {
    axios
      .get("http://localhost:5000/api/recipes", { withCredentials: true })
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

