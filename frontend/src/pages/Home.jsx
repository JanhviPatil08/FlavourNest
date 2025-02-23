import React, { useState } from "react";
import { motion } from "framer-motion";
import recipes from "../data/RecipeData";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Home = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center text-success mb-4">Discover New Recipes</h1>
      <Row>
        {recipes.map((recipe) => (
          <Col key={recipe.id} md={4} className="mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="shadow-sm">
                <Card.Img variant="top" src={recipe.image} alt={recipe.title} />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>

                  {/* Estimated Time */}
                  <p><strong>Estimated Time:</strong> {recipe.time}</p>

                  {/* Display Ingredients */}
                  <ListGroup variant="flush">
                    {recipe.ingredients.map((item, index) => (
                      <ListGroup.Item key={index}>{item}</ListGroup.Item>
                    ))}
                  </ListGroup>

                  <Button
                    variant="success"
                    className="me-2 mt-2"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    View Recipe
                  </Button>
                  <Button
                    variant="light"
                    className="favorite-btn"
                    onClick={() => toggleFavorite(recipe.id)}
                  >
                    {favorites.includes(recipe.id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Modal for Recipe Details */}
      {selectedRecipe && (
        <div className="recipe-modal">
          <div className="recipe-content">
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
            <h4>Steps to Make:</h4>
            <ol>
              {selectedRecipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <Button variant="danger" onClick={() => setSelectedRecipe(null)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Home;







