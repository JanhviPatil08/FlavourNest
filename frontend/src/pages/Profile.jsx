import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [favorites, setFavorites] = useState([]); // ✅ Store saved recipes
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAndFavorites(); // ✅ Fetch on mount & when navigating back
  }, [location]);

  const fetchUserAndFavorites = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    try {
      // ✅ Fetch user details
      const userResponse = await axios.get("https://flavournest.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);

      // ✅ Fetch user's favorite recipes
      const favoritesResponse = await axios.get("https://flavournest.onrender.com/users/savedRecipes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Fetched Favorites:", favoritesResponse.data);

      // ✅ Ensure we extract the correct array of recipes
      setFavorites(favoritesResponse.data.savedRecipes || favoritesResponse.data);

    } catch (error) {
      console.error("❌ Error fetching profile or favorites:", error);
      toast.error("Error fetching profile or favorite recipes.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to toggle favorite recipes
  const toggleFavorite = async (recipeId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("User not logged in. Please log in first.");
      return;
    }

    try {
      const response = await axios.post(
        "https://flavournest.onrender.com/users/savedRecipes", // ✅ Matches backend
        { recipeId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Favorite Updated:", response.data);
      setFavorites(response.data.savedRecipes || response.data.favorites); // ✅ Update state

    } catch (error) {
      console.error("❌ Error updating favorite:", error);
      toast.error("Could not update favorites. Try again.");
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

      <h3 className="mt-4">Your Favourite Recipe Place  ❤️</h3>
      <Row className="mt-3">
        {favorites.length === 0 ? (
          <p className="text-muted">p>
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
                  <Button
                    variant={favorites.some((fav) => fav._id === recipe._id) ? "danger" : "outline-danger"}
                    onClick={() => toggleFavorite(recipe._id)}
                  >
                    {favorites.some((fav) => fav._id === recipe._id) ? "Remove ❤️" : "Add 🤍"}
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
