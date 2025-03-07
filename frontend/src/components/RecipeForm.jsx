import { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const RecipeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    const recipeData = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      ingredients: formData.ingredients.split(",").map((item) => item.trim()),
      instructions: formData.instructions.split(".").map((step) => step.trim()),
      cookingTime: formData.cookingTime,
    };

    try {
      const response = await axios.post("https://flavournest.onrender.com/recipes", recipeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 201) {
        toast.success("🎉 Recipe added successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("❌ Failed to add recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-4">
      <Card className="p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center text-success fw-bold">Add a New Recipe</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ingredients (comma-separated)</Form.Label>
              <Form.Control type="text" name="ingredients" value={formData.ingredients} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructions (dot-separated)</Form.Label>
              <Form.Control as="textarea" name="instructions" value={formData.instructions} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cooking Time (minutes)</Form.Label>
              <Form.Control type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit" variant="success" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Submit Recipe"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RecipeForm;

