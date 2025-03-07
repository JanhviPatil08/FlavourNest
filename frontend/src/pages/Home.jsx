import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import recipesData from "../data/RecipeData"; // Import frontend recipes
import { Container, Row, Col, Card, Button, ListGroup, Modal } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const [recipes, setRecipes] = useState([...recipesData]);  
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false);

  // ✅ Fetch backend recipes and combine with frontend recipes
  useEffect(() => {
    axios.get("http://localhost:5000/recipes") // Change for local testing
      .then((response) => {
        setRecipes([...recipesData, ...response.data]); 
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes(recipesData); // Fallback to frontend recipes if backend fails
      });
  }, []);

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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="shadow-sm recipe-card">
                {/* ✅ FIXED IMAGE HANDLING FOR FRONTEND & BACKEND */}
                <Card.Img 
                  variant="top" 
                  src={
                    recipe.imageUrl?.startsWith("http") 
                      ? recipe.imageUrl  
                      : recipe.image 
                        ? `/images/${recipe.image}`  
                        : `http://localhost:5000/uploads/${recipe.imageUrl || recipe.image}`
                  } 
                  alt={recipe.title} 
                  onError={(e) => { e.target.src = "/images/default-image.jpg"; }} 
                />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Button variant="success" onClick={() => handleViewRecipe(recipe)}>
                    View Recipe
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* ✅ Fixed Modal: Now Displays "Instructions" Instead of "Steps to Make" */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={
              selectedRecipe?.imageUrl?.startsWith("http") 
                ? selectedRecipe.imageUrl 
                : selectedRecipe?.image 
                  ? `/images/${selectedRecipe.image}`  
                  : `http://localhost:5000/uploads/${selectedRecipe?.imageUrl || selectedRecipe?.image}`
            }
            alt={selectedRecipe?.title}
            className="img-fluid rounded mb-3"
            onError={(e) => { e.target.src = "/images/default-image.jpg"; }} 
          />
          <p><strong>Estimated Time:</strong> {selectedRecipe?.time || selectedRecipe?.cookingTime || "N/A"} minutes</p>
          
          <h5>Ingredients:</h5>
          <ListGroup>
            {selectedRecipe?.ingredients?.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>

          {/* ✅ Now Showing "Instructions" Instead of "Steps to Make" */}
          <h5 className="mt-3">Instructions:</h5>
          <ol>
            {selectedRecipe?.instructions?.length > 0 
              ? selectedRecipe.instructions.map((step, index) => <li key={index}>{step}</li>)
              : <li>No Instructions Available</li>}
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

