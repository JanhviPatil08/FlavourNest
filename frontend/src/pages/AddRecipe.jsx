import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";

const AddRecipe = () => {
  const [form, setForm] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/recipes", form)
      .then(() => alert("Recipe added successfully!"))
      .catch((err) => console.log(err));
  };

  return (
    <Container className="mt-5">
      <h1 className="text-success text-center">Add a New Recipe</h1>
      <Form onSubmit={handleSubmit} className="shadow-lg p-4 rounded mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Recipe Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter recipe name" onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" rows={3} placeholder="Enter description" onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="success">Submit</Button>
      </Form>
    </Container>
  );
};

export default AddRecipe;
