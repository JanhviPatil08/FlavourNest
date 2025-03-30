import React, { useState, useEffect } from "react";
import axios from "axios";
import RecipeCard from "./RecipeCard";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteRecipes, setFavoriteRecipes] = useState(new Set()); // ✅ Fix: Properly initialize

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("authToken");  
        if (!token) {
          console.error("User not logged in");
          return;
        }

        // ✅ Fetch user-specific recipes
        const response = await axios.get("https://flavournest.onrender.com/recipes/user-recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecipes(response.data);

        // ✅ Fetch user's favorite recipes
        const favoritesResponse = await axios.get("https://flavournest.onrender.com/users/savedRecipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const favoriteIds = new Set(favoritesResponse.data.favorites.map(recipe => recipe._id));

        setFavoriteRecipes(favoriteIds);

      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
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
              <RecipeCard 
                recipe={recipe}
                isFavorite={favoriteRecipes.has(recipe._id)}  // ✅ Pass favorite status
                setFavoriteRecipes={setFavoriteRecipes}  // ✅ Update favorite state
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
