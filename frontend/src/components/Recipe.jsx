
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Recipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://flavournest.onrender.com/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2 className="text-center">Loading...</h2>;
  }

  if (!recipe) {
    return <h2 className="text-center text-danger">Recipe Not Found!</h2>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center">{recipe.title}</h2>

      {/* ✅ Fixed Image Handling */}
      <img
        src={recipe.imageUrl || "/images/default-image.jpg"} 
        className="img-fluid rounded mx-auto d-block my-3"
        alt={recipe.title}
        onError={(e) => (e.target.src = "/images/default-image.jpg")} // Fallback image
      />

      <p className="text-muted text-center">{recipe.description || "No description available."}</p>

      {/* ✅ Ensures Ingredients Exist */}
      <h4>Ingredients:</h4>
      {recipe.ingredients && recipe.ingredients.length > 0 ? (
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      ) : (
        <p>No ingredients available.</p>
      )}

      {/* ✅ Ensures Instructions Exist */}
      <h4>Instructions:</h4>
      {recipe.instructions && recipe.instructions.length > 0 ? (
        <ol>
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      ) : (
        <p>No instructions available.</p>
      )}

      <p>
        <strong>Cooking Time:</strong> {recipe.cookingTime ? `${recipe.cookingTime} minutes` : "Not specified"}
      </p>
    </div>
  );
};

export default Recipe;
