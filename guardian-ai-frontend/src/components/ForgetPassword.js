import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Card, Container } from '@mui/material';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async () => {
        setError('');
        setMessage('');

        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            // Here you would call your backend service to initiate the password reset process
            console.log("Reset password for email:", email);
            // Fake success message for demonstration
            setMessage("If an account with that email exists, we have sent you an email to reset your password.");
        } catch (error) {
            setError("Failed to reset password. Please try again later.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card sx={{ mt: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Typography component="p" sx={{ mt: 2 }}>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography>
                <TextField
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    fullWidth
                    error={!!error}
                    helperText={error || ''}
                />
                <Button
                    variant="contained"
                    onClick={handleResetPassword}
                    sx={{ mt: 3, mb: 2 }}
                    fullWidth
                >
                    Send Reset Link
                </Button>
                {message && (
                    <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Card>
        </Container>
    );
};

export default ForgotPassword;