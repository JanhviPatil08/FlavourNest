import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

const Profile = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("❌ No token found, redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://flavournest.onrender.com/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data?.message || error.message);
        navigate("/login");
      }
    };

    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("https://flavournest.onrender.com/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error("❌ Error fetching favorites:", error.response?.data?.message || error.message);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchFavorites();
  }, [navigate]);

  // ✅ Remove Favorite Recipe
  const removeFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://flavournest.onrender.com/users/favorites/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavorites((prevFavorites) => prevFavorites.filter((recipe) => recipe._id !== recipeId));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove favorite");
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setUser(null);
    navigate("/login");
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-5">
      <h2 className="text-success">Your Profile</h2>

      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button variant="success" onClick={() => navigate("/login")}>Login</Button>
      )}

      <h3 className="mt-4">Favorite Recipes ❤️</h3>
      <Row className="mt-3">
        {favorites.length === 0 ? (
          <p className="text-muted">You haven't saved any favorite recipes yet.</p>
        ) : (
          favorites.map((recipe) => (
            <Col md={4} key={recipe._id} className="mb-4">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Button variant="outline-danger" onClick={() => removeFavorite(recipe._id)}>
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Profile;


