import { Card, Button, Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, HeartFill } from "react-bootstrap-icons";

const RecipeCard = ({ recipe, isFavorite, refreshFavorites }) => {
  const [favorited, setFavorited] = useState(isFavorite);
  const [show, setShow] = useState(false); // Modal state

  const handleFavorite = () => {
    const url = favorited
      ? `https://flavournest.onrender.com/users/favorites/${recipe._id}`
      : "https://flavournest.onrender.com/users/favorites";

    axios({
      method: favorited ? "DELETE" : "POST",
      url,
      data: { recipeId: recipe._id },
      withCredentials: true,
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
      {/* Recipe Card - Shows only Image, Title, Description, and Like Button */}
      <Card className="recipe-card">
        <Card.Img variant="top" src={recipe.image} alt={recipe.name} />
        <Card.Body>
          <Card.Title>{recipe.name}</Card.Title>
          <Card.Text>{recipe.description || "No description available"}</Card.Text>
          <Button variant="outline-success" onClick={() => setShow(true)}>View Recipe</Button>
          <Button variant="light" className="ms-2" onClick={handleFavorite}>
            {favorited ? <HeartFill color="red" /> : <Heart />}
          </Button>
        </Card.Body>
      </Card>

      {/* Recipe Details Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{recipe.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={recipe.image} alt={recipe.name} className="img-fluid rounded mb-3" />
          <p><strong>Cooking Time:</strong> {recipe.cookingTime ? `${recipe.cookingTime} minutes` : "N/A"}</p>
          <h5>Ingredients:</h5>
          <ul>
            {recipe.ingredients ? recipe.ingredients.split(",").map((item, index) => (
              <li key={index}>{item.trim()}</li>
            )) : <li>No ingredients available</li>}
          </ul>
          <h5>Instructions:</h5>
          <p>{recipe.instructions || "No instructions available"}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecipeCard;


