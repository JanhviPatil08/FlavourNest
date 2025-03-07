import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Container, Form, Button, Spinner } from "react-bootstrap";

const RecipeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      await axios.post("https://flavournest.onrender.com/recipes", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🎉 Recipe added successfully!");
      navigate("/recipes"); // Redirect after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to add recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center text-success">Add a New Recipe</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Recipe Title</Form.Label>
          <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingredients (comma-separated)</Form.Label>
          <Form.Control type="text" name="ingredients" value={formData.ingredients} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control as="textarea" rows={3} name="instructions" value={formData.instructions} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cooking Time (minutes)</Form.Label>
          <Form.Control type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required />
        </Form.Group>

        <Button variant="success" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Add Recipe"}
        </Button>
      </Form>
    </Container>
  );
};

export default RecipeForm;

