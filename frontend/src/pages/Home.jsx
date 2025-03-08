import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Container, Row, Col, Card, Button, ListGroup, Modal } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Favorite icons

const Home = () => {
  const [recipes, setRecipes] = useState([]); // ✅ Start with empty array (no hardcoded recipes)
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false);

  // ✅ Fetch Recipes from Backend Only
  useEffect(() => {
    axios.get("https://flavournest.onrender.com/recipes")
      .then((response) => {
        setRecipes(response.data); // ✅ Only backend recipes
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes([]); // ✅ If backend fails, show nothing
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
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <Col key={recipe._id || index} md={4} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="shadow-sm recipe-card">
                  {/* ✅ Display Image from Backend */}
                  <Card.Img 
                    variant="top" 
                    src={recipe.imageUrl}  
                    alt={recipe.title} 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }} // Fallback Image
                  />

                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>

                    <Button variant="success" onClick={() => handleViewRecipe(recipe)}>View Recipe</Button>
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
          ))
        ) : (
          <h3 className="text-center text-muted">No recipes available. Add some!</h3>
        )}
      </Row>

      {/* ✅ Recipe Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRecipe?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={selectedRecipe?.imageUrl}
            alt={selectedRecipe?.title}
            className="img-fluid rounded mb-3"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }}
          />
          <p><strong>Cooking Time:</strong> {selectedRecipe?.cookingtime || "N/A"} minutes</p>

          <h5>Ingredients:</h5>
          <ListGroup>
            {selectedRecipe?.ingredients?.map((item, index) => (
              <ListGroup.Item key={index}>{item}</ListGroup.Item>
            ))}
          </ListGroup>

          <h5 className="mt-3">Instructions:</h5>
          <ol>
            {selectedRecipe?.instructions && selectedRecipe.instructions.length > 0 
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



