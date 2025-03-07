import React from "react";
import recipes from "../data/RecipeData";
import Recipe from "./Recipe";
import { Link } from "react-router-dom";

function RecipeList() {
  return (
    <div className="container">
      <h2 className="text-center my-4">Our Recipes</h2>
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <Recipe recipe={recipe} />
            <div className="card">
              <img src={recipe.image} className="card-img-top" alt={recipe.title} />
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.description}</p>
                <p><strong>Time:</strong> {recipe.time}</p>
                <Link to={`/recipe/${recipe.id}`} className="btn btn-success">
                  View Recipe
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
