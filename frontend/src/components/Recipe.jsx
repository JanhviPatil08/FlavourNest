import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Card, ListGroup } from "react-bootstrap";

const Recipe = () => {
  const { id } = useParams(); // ✅ Get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://flavournest.onrender.com/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (!recipe) return <h2 className="text-center text-danger">❌ Recipe Not Found!</h2>;

  return (
    <Container className="mt-5">
      <Card className="shadow-lg">
        <Card.Img variant="top" src={recipe.imageUrl} alt={recipe.title} />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text>{recipe.description}</Card.Text>

          <h5>Ingredients:</h5>
          <ListGroup>
            {recipe.ingredients?.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>

          <h5 className="mt-3">Instructions:</h5>
          <ol>
            {recipe.instructions?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>

          <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Recipe;


