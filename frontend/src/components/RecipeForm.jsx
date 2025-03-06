import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure toast styles are imported

const RecipeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
    image: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      setError("User not logged in. Please log in first.");
      toast.error("User not logged in. Please log in first.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("ingredients", formData.ingredients);
    formDataToSend.append("instructions", formData.instructions);
    formDataToSend.append("cookingTime", formData.cookingTime);
    formDataToSend.append("image", formData.image);

    try {
      await axios.post("https://flavournest.onrender.com/recipes", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });
      toast.success("Recipe added successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error adding recipe");
      toast.error(err.response?.data?.message || "Error adding recipe");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center text-success">Add a New Recipe</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Recipe Title</Form.Label>
          <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={2} name="description" value={formData.description} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingredients</Form.Label>
          <Form.Control as="textarea" rows={3} name="ingredients" value={formData.ingredients} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control as="textarea" rows={5} name="instructions" value={formData.instructions} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cooking Time (in minutes)</Form.Label>
          <Form.Control type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Recipe Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleChange} required />
        </Form.Group>

        <Button type="submit" variant="success" className="w-100">Submit Recipe</Button>
      </Form>
    </Container>
  );
};

export default RecipeForm;
