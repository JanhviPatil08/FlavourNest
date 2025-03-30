import { Card, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, HeartFill } from "react-bootstrap-icons";

const RecipeCard = ({ recipe, isFavorite, setFavoriteRecipes }) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [show, setShow] = useState(false);

  // ✅ Sync favorite state when `isFavorite` updates from parent
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

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
      console.log("🔵 Toggling favorite for:", recipe._id);

      // ✅ API call to add/remove favorite
      const response = await axios.post(
        "https://flavournest.onrender.com/users/favorites", // ✅ Check correct endpoint
        { recipeId: recipe._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("🟢 Favorite Response:", response.data);

      // ✅ Update state based on backend response
      const favoritesResponse = await axios.get(
        "https://flavournest.onrender.com/users/favorites",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("🟢 Updated Favorites List:", favoritesResponse.data.favorites);

      // ✅ Update UI based on backend data
      const updatedFavorites = new Set(
        favoritesResponse.data.favorites.map((r) => r._id)
      );

      setFavoriteRecipes(updatedFavorites); // ✅ Update favorites in parent component
      setFavorite(updatedFavorites.has(recipe._id)); // ✅ Ensure UI updates correctly

      toast.success("Favorites updated!");
    } catch (error) {
      console.error("❌ Failed to update favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  return (
    <>
      <Card className="recipe-card">
        {/* ✅ Image now correctly loads from URL */}
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={recipe.title}
          onError={(e) => {
            e.target.src = "/images/default-recipe.jpg";
          }} // Fallback image if URL fails
        />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text>{recipe.description || "No description available"}</Card.Text>
          <Button variant="outline-success" onClick={() => setShow(true)}>
            View Recipe
          </Button>
          <Button variant="light" className="ms-2" onClick={handleFavoriteClick}>
            {favorite ? <HeartFill color="red" /> : <Heart />}
          </Button>
        </Card.Body>
      </Card>

      {/* ✅ FIXED: Modal displays all details properly */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{recipe.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={imageUrl}
            alt={recipe.title}
            className="img-fluid rounded mb-3"
            onError={(e) => {
              e.target.src = "/images/default-recipe.jpg";
            }} // Fallback
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


