import React, { useState } from "react";
import { Form, Button, Container, Card, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";



const AuthPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialMode = queryParams.get("mode") === "signup" ? false : true;
    
    const [isLogin, setIsLogin] = useState(initialMode);
    

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("userId", res.data.userId);
        alert("Login successful");
        navigate("/dashboard");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/signup", {
          username,
          email,
          password,
        });
        alert(res.data.message);
        setIsLogin(true); // Switch to login view after signup
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.response?.data?.message || `${isLogin ? "Login" : "Signup"} failed`);
    }
  };
  

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow" style={{ width: "400px" }}>
        <div className="text-center mb-3">
          <ToggleButtonGroup type="radio" name="auth" value={isLogin} onChange={() => setIsLogin(!isLogin)}>
            <ToggleButton variant="outline-primary" value={true}>Login</ToggleButton>
            <ToggleButton variant="outline-success" value={false}>Signup</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <h3 className="text-center mb-4">{isLogin ? "Login" : "Signup"}</h3>

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type="submit" variant={isLogin ? "primary" : "success"} className="w-100">
            {isLogin ? "Login" : "Signup"}
          </Button>
          <div className="text-center mt-3">
  {isLogin ? (
    <p>
      Don’t have an account?{" "}
      <Link to="/auth?mode=signup" onClick={() => setIsLogin(false)}>Sign up</Link>
    </p>
  ) : (
    <p>
      Already have an account?{" "}
      <Link to="/auth?mode=login" onClick={() => setIsLogin(true)}>Log in</Link>
    </p>
  )}
</div>

        </Form>
      </Card>
    </Container>
  );
};

export default AuthPage;
