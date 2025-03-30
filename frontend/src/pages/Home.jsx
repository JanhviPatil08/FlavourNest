import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Carousel, Container, Row, Col, Card, Button, ListGroup, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [recipes, setRecipes] = useState([]); // Stores all recipes
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Check if the user is logged in before loading the page
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
      return;
    }

    // ✅ Fetch All Recipes from Backend
    axios
      .get("https://flavournest.onrender.com/recipes", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Include token in request
      })
      .then((response) => {
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Initially, show all recipes
      })
      .catch((error) => {
        console.error("❌ Error fetching recipes:", error);
        setRecipes([]);
        setFilteredRecipes([]);
      });
  }, [navigate]); // ✅ Add navigate to dependencies

  // ✅ Search Functionality (Filters Recipes)
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

  // ✅ Get the last 5 added recipes for the Carousel
  const latestRecipes = recipes.slice(-5).reverse();

  return (
    <Container className="mt-4">
      {/* ✅ Carousel Section with Latest Recipes */}
      <Carousel className="mb-4">
        {latestRecipes.length > 0 ? (
          latestRecipes.map((recipe, index) => (
            <Carousel.Item key={recipe._id || index}>
              <img
                className="d-block carousel-image"
                src={recipe.imageUrl}
                alt={recipe.title}
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x400"; }}
              />
              <Carousel.Caption>
                <h5>{recipe.title}</h5>
              </Carousel.Caption>
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img className="d-block carousel-image" src="https://via.placeholder.com/800x400" alt="No Recipes Yet" />
            <Carousel.Caption>
              <h5>No Recipes Available</h5>
            </Carousel.Caption>
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

