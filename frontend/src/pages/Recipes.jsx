import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import RecipeCard from "../components/RecipeCard";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not logged in. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchUserAndRecipes = async () => {
      try {
        // ✅ Fetch user data
        const userRes = await axios.get("https://flavournest.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data);

        // ✅ Fetch recipes
        const recipesRes = await axios.get("https://flavournest.onrender.com/recipes", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRecipes(recipesRes.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err.response?.data?.message || err.message);
        setError("Failed to load recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRecipes();
  }, [navigate]);

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


