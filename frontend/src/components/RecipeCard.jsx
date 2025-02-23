import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, HeartFill } from "react-bootstrap-icons";

const RecipeCard = ({ recipe, isFavorite, refreshFavorites }) => {
  const [favorited, setFavorited] = useState(isFavorite);

  const handleFavorite = () => {
    const url = favorited
      ? `http://localhost:5000/api/users/favorites/${recipe._id}`
      : "http://localhost:5000/api/users/favorites";

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
    <Card className="shadow-sm border-0">
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        <Card.Text>{recipe.description}</Card.Text>
        <Button variant="outline-success">View Details</Button>
        <Button variant="light" className="ms-2" onClick={handleFavorite}>
          {favorited ? <HeartFill color="red" /> : <Heart />}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
