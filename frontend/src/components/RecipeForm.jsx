import { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const RecipeForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "", // Using imageUrl instead of file upload
    ingredients: "",
    instructions: "",
    cookingTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "https://flavournest.onrender.com/recipes",
        {
          ...formData,
          ingredients: formData.ingredients.split("\n"), // Convert to array
          instructions: formData.instructions.split("\n"), // Convert to array
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,  // ✅ Send token in headers
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("🎉 Recipe added successfully!");
        navigate("/recipes"); // Redirect to recipe list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to add recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow-lg rounded-4" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center text-success fw-bold">Add a Recipe</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Recipe Title</Form.Label>
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
              <Form.Label>Ingredients (one per line)</Form.Label>
              <Form.Control as="textarea" name="ingredients" value={formData.ingredients} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructions (one per line)</Form.Label>
              <Form.Control as="textarea" name="instructions" value={formData.instructions} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cooking Time (in minutes)</Form.Label>
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
