import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, ListGroup } from "react-bootstrap";

const Recipes = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://flavournest.onrender.com/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error);
        setError("Failed to load recipe");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <Container className="mt-4">
      {recipe && (
        <Card className="shadow-lg p-4">
          <Card.Img 
            variant="top" 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="img-fluid rounded" 
            onError={(e) => { e.target.src = "default-image.jpg"; }} // Fallback image
          />
          <Card.Body>
            <Card.Title>{recipe.title}</Card.Title>
            <Card.Text>{recipe.description || "No description available."}</Card.Text>
            <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
            
            <h5>Ingredients:</h5>
            <ListGroup>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((item, index) => <ListGroup.Item key={index}>{item}</ListGroup.Item>)
              ) : (
                <ListGroup.Item>No ingredients available</ListGroup.Item>
              )}
            </ListGroup>
            
            <h5 className="mt-3">Instructions:</h5>
            <ol>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => <li key={index}>{step}</li>)
              ) : (
                <li>No instructions available</li>
              )}
            </ol>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Recipes;
