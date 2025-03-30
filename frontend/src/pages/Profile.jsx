import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAndFavorites(); // Fetch on mount
  }, [location]); // 🔥 Re-fetch when navigating back to Profile Page

  const fetchUserAndFavorites = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    try {
      // ✅ Fetch user details first
      const userResponse = await axios.get("https://flavournest.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);

      // ✅ Fetch user's favorite recipes
      const favoritesResponse = await axios.get("https://flavournest.onrender.com/users/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Favorites:", favoritesResponse.data);
      setFavorites(favoritesResponse.data);

    } catch (error) {
      console.error("Error fetching profile or favorites:", error);
      toast.error("Error fetching profile or favorite recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
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



