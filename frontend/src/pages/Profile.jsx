import { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // ✅ Store user info

  useEffect(() => {
    // ✅ Fetch user authentication status
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login")); // Redirect if not logged in

    axios
      .get("http://localhost:5000/api/users/favorites", { withCredentials: true })
      .then((res) => setFavorites(res.data))
      .catch(() => toast.error("Failed to load favorites"))
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ Fixed: Added removeFavorite function
  const removeFavorite = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/favorites/${recipeId}`, { withCredentials: true });
      setFavorites((prevFavorites) => prevFavorites.filter((recipe) => recipe._id !== recipeId));
      toast.success("Removed from favorites");
    } catch (error) {
      toast.error("Failed to remove favorite");
    }
  };

  const handleLogout = () => {
    axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .then(() => {
        toast.success("Logged out successfully");
        setUser(null);
        navigate("/login"); // Redirect to login after logout
      })
      .catch(() => toast.error("Logout failed"));
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

