import { Card, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, HeartFill } from "react-bootstrap-icons";

const RecipeCard = ({ recipe, isFavorite, setFavoriteRecipes }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [show, setShow] = useState(false);

  // ✅ Ensure correct image URL from user input
  const imageUrl = recipe.imageUrl?.startsWith("http")
    ? recipe.imageUrl
    : "/images/default-recipe.jpg"; // Fallback image

  const handleFavoriteClick = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please log in first!");
      return;
    }

    try {
      // ✅ Corrected API endpoint for saving/removing favorites
      await axios.post(
        "https://flavournest.onrender.com/savedRecipes", // ✅ Updated path
        { recipeId: recipe._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFavorite(!favorite); // ✅ Toggle state locally

      // ✅ Fetch updated favorites from backend
      const favoritesResponse = await axios.get(
        "https://flavournest.onrender.com/savedRecipes", // ✅ Updated path
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Ensure favorites are stored as a Set for better performance
      setFavoriteRecipes(new Set([...favoritesResponse.data.map(r => r._id)]));

      toast.success("Favorites updated!");
    } catch (error) {
      console.error("❌ Failed to update favorites", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  return (
    <>
      <Card className="recipe-card">
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={recipe.title}
          onError={(e) => { e.target.src = "/images/default-recipe.jpg"; }} // Fallback image if URL fails
        />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text>{recipe.description || "No description available"}</Card.Text>
          <Button variant="outline-success" onClick={() => setShow(true)}>View Recipe</Button>
          <Button variant="light" className="ms-2" onClick={handleFavoriteClick}>
            {favorite ? <HeartFill color="red" /> : <Heart />}
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{recipe.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={imageUrl}
            alt={recipe.title}
            className="img-fluid rounded mb-3"
            onError={(e) => { e.target.src = "/images/default-recipe.jpg"; }} // Fallback
          />
          <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>

          <h5>Ingredients:</h5>
          <ul>
            {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
              ? recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)
              : <li>No ingredients available</li>}
          </ul>

          <h5>Instructions:</h5>
          <ol>
            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0
              ? recipe.instructions.map((step, index) => <li key={index}>{step}</li>)
              : <li>No instructions available</li>}
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecipeCard;
