import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button, ListGroup, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("https://flavournest.onrender.com/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes([]);
        setFilteredRecipes([]);
      });
  }, [navigate]);

  useEffect(() => {
    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShow(true);
  };

  const latestRecipes = recipes.slice(-5).reverse();

  return (
    <Container className="mt-4">
      {/* ✅ Elegant Recipe Carousel */}
      <Carousel className="mb-4 carousel-container">
        {latestRecipes.length > 0 ? (
          latestRecipes.map((recipe, index) => (
            <Carousel.Item key={recipe._id || index} className="carousel-item-custom">
              <motion.div
                initial={{ opacity: 0.8, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  className="d-block w-100 carousel-image"
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x400"; }}
                />
              </motion.div>

              {/* ✅ Elegant Overlay */}
              <div className="carousel-overlay">
                <h2 className="carousel-title">{recipe.title}</h2>
                <p className="carousel-description">{recipe.description}</p>
              </div>
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img className="d-block w-100 carousel-image" src="https://via.placeholder.com/800x400" alt="No Recipes Yet" />
            <div className="carousel-overlay">
              <h2>No Recipes Available</h2>
            </div>
          </Carousel.Item>
        )}
      </Carousel>

      {/* ✅ Search Bar */}
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form>

      <h1 className="text-center text-success mb-4">Latest Recipes</h1>
      <Row>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <Col key={recipe._id || index} md={4} className="mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-sm recipe-card">
                  <Card.Img 
                    variant="top" 
                    src={recipe.imageUrl}  
                    alt={recipe.title} 
                    className="recipe-img"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400"; }} 
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
          <h3 className="text-center text-muted">No recipes found.</h3>
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

