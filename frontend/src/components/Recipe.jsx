import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Recipe = () => {
  const { id } = useParams();
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

  if (loading) return <h2 className="text-center">Loading recipe...</h2>;
  if (!recipe) return <h2 className="text-center">Recipe Not Found!</h2>;

  return (
    <div className="container my-5">
      <h2 className="text-center">{recipe.title}</h2>
      <img src={recipe.imageUrl} className="img-fluid rounded mx-auto d-block my-3" alt={recipe.title} />
      <p className="text-muted text-center">{recipe.description}</p>

      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients?.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h4>Instructions:</h4>
      <ol>
        {recipe.instructions?.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
    </div>
  );
};

export default Recipe;

