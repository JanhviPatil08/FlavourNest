import { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecipeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    instructions: "",
    cookingTime: "",
    imageUrl: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "imageUrl") {
      setFormData({ ...formData, imageUrl: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    if (!formData.title || !formData.description || !formData.cookingTime || !formData.ingredients || !formData.instructions || !formData.imageUrl) {
      toast.error("All fields including an image are required.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("cookingTime", Number(formData.cookingTime));

    const ingredientsArray = formData.ingredients.split("\n").map((item) => item.trim());
    const instructionsArray = formData.instructions.split("\n").map((item) => item.trim());

    formDataToSend.append("ingredients", JSON.stringify(ingredientsArray));
    formDataToSend.append("instructions", JSON.stringify(instructionsArray));
    formDataToSend.append("imageUrl", formData.image);

    try {
      await axios.post("https://flavournest.onrender.com/recipes", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Recipe added successfully!");
      setLoading(false);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding recipe.");
      setLoading(false);
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
          <Form.Label>Ingredients (One per line)</Form.Label>
          <Form.Control as="textarea" rows={3} name="ingredients" value={formData.ingredients} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instructions (One per line)</Form.Label>
          <Form.Control as="textarea" rows={5} name="instructions" value={formData.instructions} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cooking Time (in minutes)</Form.Label>
          <Form.Control type="number" name="cookingTime" value={formData.cookingTime} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Recipe Image</Form.Label>
          <Form.Control type="file" name="imageUrl" onChange={handleChange} required />
        </Form.Group>

        <Button type="submit" variant="success" className="w-100" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Submit Recipe"}
        </Button>
      </Form>
    </Container>
  );
};

export default RecipeForm;

