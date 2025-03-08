import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");  // ✅ Declare token before using

    if (!token) {
      console.error("User not logged in");
      return;
    }

    axios
      .get("https://flavournest.onrender.com/recipes/user-recipes", {
        headers: { Authorization: `Bearer ${token}` },  // ✅ Use token correctly
      })
      .then((response) => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2 className="text-center">Loading recipes...</h2>;
  }

  return (
    <div className="container">
      <h2 className="text-center my-4">Your Recipes</h2>

      {recipes.length === 0 ? (
        <p className="text-center text-danger">No recipes available.</p>
      ) : (
        <div className="row">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={recipe.imageUrl || "/images/default-image.jpg"}
                  className="card-img-top"
                  alt={recipe.title}
                  onError={(e) => (e.target.src = "/images/default-image.jpg")} 
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.title}</h5>
                  <p className="card-text">{recipe.description || "No description available"}</p>
                  <p><strong>Cooking Time:</strong> {recipe.cookingTime ? `${recipe.cookingTime} minutes` : "N/A"}</p>
                 
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
