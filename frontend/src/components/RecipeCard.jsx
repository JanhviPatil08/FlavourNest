import { Card, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, HeartFill } from "react-bootstrap-icons";

const RecipeCard = ({ recipe, isFavorite, refreshFavorites }) => {
  const [favorited, setFavorited] = useState(isFavorite);
  const [show, setShow] = useState(false); // Modal state

  // ✅ Get Correct Image URL
  const imageUrl = recipe.imageUrl?.startsWith("/uploads/")
    ? `https://flavournest.onrender.com${recipe.imageUrl}`
    : recipe.imageUrl;

  // ✅ Handle Favorite (Like/Unlike)
  const handleFavorite = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to save recipes!");
      return;
    }

    const url = favorited
      ? `https://flavournest.onrender.com/users/favorites/${recipe._id}`
      : "https://flavournest.onrender.com/users/favorites";

    axios({
      method: favorited ? "DELETE" : "POST",
      url,
      data: { recipeId: recipe._id },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        toast.success(favorited ? "Removed from favorites" : "Added to favorites");
        setFavorited(!favorited);
        refreshFavorites();
      })
      .catch(() => toast.error("Something went wrong!"));
  };

  return (
    <>
      {/* ✅ Recipe Card - Shows Image, Title, Description & Like Button */}
      <Card className="recipe-card">
        <Card.Img variant="top" src={imageUrl} alt={recipe.title} />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text>{recipe.description || "No description available"}</Card.Text>
          <Button variant="outline-success" onClick={() => setShow(true)}>View Recipe</Button>
          <Button variant="light" className="ms-2" onClick={handleFavorite}>
            {favorited ? <HeartFill color="red" /> : <Heart />}
          </Button>
        </Card.Body>
      </Card>

      {/* ✅ Recipe Details Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{recipe.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageUrl} alt={recipe.title} className="img-fluid rounded mb-3" />
          <p><strong>Cooking Time:</strong> {recipe.cookingTime ? `${recipe.cookingTime} minutes` : "N/A"}</p>
          
          {/* ✅ Ingredients List */}
          <h5>Ingredients:</h5>
          <ul>
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)
              : <li>No ingredients available</li>}
          </ul>

          {/* ✅ Instructions List */}
          <h5>Instructions:</h5>
          <ol>
            {Array.isArray(recipe.instructions)
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
