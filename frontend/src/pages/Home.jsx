import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Import Axios for API calls
import recipesData from "../data/RecipeData"; // Import hardcoded recipes
import { Container, Row, Col, Card, Button, ListGroup, Modal } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const [recipes, setRecipes] = useState([...recipesData]); // Start with hardcoded recipes
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false); // Modal state

  // Fetch backend recipes and combine with hardcoded recipes
  useEffect(() => {
    axios.get("https://flavournest.onrender.com/recipes")
      .then((response) => {
        const combinedRecipes = [...recipesData, ...response.data]; // Merge old + new
        setRecipes(combinedRecipes);
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes(recipesData); // Show old recipes if backend fails
      });
  }, []);
  

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShow(true);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center text-success mb-4">Discover New Recipes</h1>
      <Row>
        {recipes.map((recipe, index) => (
          <Col key={recipe._id || index} md={4} className="mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm recipe-card">
              <Card.Img 
  variant="top" 
  src={
    recipe.imageUrl?.startsWith("http") 
      ? recipe.imageUrl  // 🔹 If it's a full URL, use it directly
      : `https://flavournest.onrender.com/uploads/${recipe.imageUrl}` // 🔹 If it's a filename, prepend the backend URL
  } 
  alt={recipe.title} 
  onError={(e) => { e.target.src = "/default-image.jpg"; }} // 🔹 Show default image if loading fails
/>


                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  
                  <Button variant="success" onClick={() => handleViewRecipe(recipe)}>
                    View Recipe
                  </Button>
                  <Button
                    variant="light"
                    className="favorite-btn ms-2"
                    onClick={() => toggleFavorite(recipe._id || index)}
                  >
                    {favorites.includes(recipe._id || index) ? <FaHeart color="red" /> : <FaRegHeart />}
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Recipe Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedRecipe?.image} alt={selectedRecipe?.title} className="img-fluid rounded mb-3" />
          <p><strong>Estimated Time:</strong> {selectedRecipe?.time} minutes</p>
          <h5>Ingredients:</h5>
          <ListGroup>
            {selectedRecipe?.ingredients?.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>
          <h5 className="mt-3">Steps to Make:</h5>
          <ol>
            {selectedRecipe?.steps?.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Home;

