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
        toast.error("You must be logged in to view your profile.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("https://flavournest.onrender.com/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error.response?.data?.message || error.message);
        toast.error("Session expired. Please log in again.");
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
        toast.error("Failed to load favorite recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchFavorites();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
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
                {/* ✅ Display Recipe Image Correctly */}
                <Card.Img
                  variant="top"
                  src={recipe.imageUrl || "/images/default-image.jpg"}
                  alt={recipe.title}
                  onError={(e) => (e.target.src = "/images/default-image.jpg")}
                />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description || "No description available"}</Card.Text>
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
