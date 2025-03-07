import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import recipesData from "../data/RecipeData";
import { Container, Row, Col, Card, Button, ListGroup, Modal } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const [recipes, setRecipes] = useState([...recipesData]); 
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false);

  // ✅ Fetch backend recipes and combine with frontend recipes
  useEffect(() => {
    axios.get("https://flavournest.onrender.com/recipes")
      .then((response) => {
        setRecipes([...recipesData, ...response.data]); // Merge frontend + backend
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes(recipesData); // Show frontend recipes if backend fails
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="shadow-sm recipe-card">
                {/* ✅ FIXED IMAGE HANDLING FOR FRONTEND & BACKEND */}
                <Card.Img 
                  variant="top" 
                  src={
                    recipe.imageUrl?.startsWith("http") 
                      ? recipe.imageUrl  // 🔹 Load backend image if available
                      : recipe.image 
                        ? `/images/${recipe.image}`  // 🔹 Load frontend image from `public/images/`
                        : `https://flavournest.onrender.com/uploads/${recipe.imageUrl || recipe.image}` // 🔹 Backend image path
                  } 
                  alt={recipe.title} 
                  onError={(e) => { e.target.src = "/images/default-image.jpg"; }} // 🔹 Default image if missing
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

      {/* ✅ Fixed Recipe Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* ✅ FIXED IMAGE HANDLING IN MODAL */}
          <img 
            src={
              selectedRecipe?.imageUrl?.startsWith("http") 
                ? selectedRecipe.imageUrl 
                : selectedRecipe?.image 
                  ? `/images/${selectedRecipe.image}`  // Load frontend images from `public/images/`
                  : `https://flavournest.onrender.com/uploads/${selectedRecipe?.imageUrl || selectedRecipe?.image}`
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
