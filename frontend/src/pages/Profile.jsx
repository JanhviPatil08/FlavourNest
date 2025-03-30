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
    const fetchProfileData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You need to log in first.");
        navigate("/login");
        return;
      }

      try {
        // ✅ Fetch user details & favorites in one request (if supported by backend)
        const response = await axios.get("https://flavournest.onrender.com/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile Data:", response.data); // Debugging log
        setUser(response.data.user);
        setFavorites(response.data.favorites || []);

      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to fetch profile.");
        
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  // ✅ Logout Handler
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
        <Card className="shadow p-4 mb-4">
          <h4 className="mb-3">{user.name}</h4>
          <p><strong>Email:</strong> {user.email}</p>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Card>
      ) : (
        <Button variant="success" onClick={() => navigate("/login")}>Login</Button>
      )}

      <h3 className="mt-4">Favorite Recipes ❤️</h3>
      <Row className="mt-3">
        {favorites.length === 0 ? (
          <p className="text-muted">You haven't saved any favorite recipes yet.</p>
        ) : (
          favorites.map((recipe) => (
            <Col md={4} sm={6} xs={12} key={recipe._id} className="mb-4">
              <Card className="shadow-sm border-0 recipe-card">
                <Card.Img
                  variant="top"
                  src={recipe.imageUrl || "/images/default-image.jpg"}
                  alt={recipe.title}
                  onError={(e) => (e.target.src = "/images/default-image.jpg")}
                />
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text className="text-truncate">{recipe.description || "No description available"}</Card.Text>
                  <Button variant="outline-success" size="sm" onClick={() => navigate(`/recipe/${recipe._id}`)}>
                    View Recipe
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* ✅ Styles for hover effects */}
      <style>
        {`
          .recipe-card {
            transition: transform 0.2s ease-in-out;
          }
          .recipe-card:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </Container>
  );
};

export default Profile;
