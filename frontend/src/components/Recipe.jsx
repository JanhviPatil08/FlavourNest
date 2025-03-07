import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Import toast notifications

const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Define navigate
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    axios.get(`https://flavournest.onrender.com/recipes/${id}`)
      .then(response => setRecipe(response.data))
      .catch(error => {
        toast.error("Error fetching recipe!"); // ✅ Show error toast
        console.error("Error fetching recipe:", error);
        navigate("/recipes"); // ✅ Redirect if recipe is not found
      });
  }, [id, navigate]);

  if (!recipe) {
    return <h2 className="text-center">Recipe Not Found!</h2>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center">{recipe.title}</h2>
      <img src={recipe.imageUrl} className="img-fluid rounded mx-auto d-block my-3" alt={recipe.title} />
      <p className="text-muted text-center">{recipe.description}</p>

      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h4>Instructions:</h4>
      <ol>
        {recipe.instructions.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
    </div>
  );
};

export default Recipe;
