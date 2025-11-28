import React, { useState } from "react";
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from "@mui/material";
import { authAPI } from "../../services/api";
import { setAuthToken, setUser } from "../../utils/auth";
import "./Auth.css";

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            const { token, user } = response.data;

            // Store token and user
            setAuthToken(token);
            setUser(user);

            // Notify parent component
            if (onLogin) {
                onLogin(user);
            }

            // Redirect based on role
            if (user.role === "admin") {
                window.location.href = "/";
            } else {
                window.location.href = "/worker";
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="auth-container">
            <Paper elevation={3} className="auth-paper">
                <Box className="auth-header">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Inventory Management
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Sign in to your account
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        margin="normal"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        margin="normal"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Sign In"}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;

