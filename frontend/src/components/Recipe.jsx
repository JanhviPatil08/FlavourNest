import React from "react";
import { useParams } from "react-router-dom";
import recipes from "../data/RecipeData";

const Recipe = () => {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === parseInt(id));

  if (!recipe) {
    return <h2 className="text-center">Recipe Not Found!</h2>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center">{recipe.title}</h2>
      <img src={recipe.image} className="img-fluid rounded mx-auto d-block my-3" alt={recipe.title} />
      <p className="text-muted text-center">{recipe.description}</p>

      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h4>Steps:</h4>
      <ol>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      <p><strong>Estimated Time:</strong> {recipe.time}</p>
    </div>
  );
};

export default Recipe;
