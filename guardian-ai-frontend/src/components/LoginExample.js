import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { authenticate } from '../services/authenticate';
import { submitNewPassword } from "../services/userManagement";
import { Button, TextField, Typography, IconButton, Card, Container, Box } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmedPasswordVisible, setConfirmedPasswordVisible] = useState(false);
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [newPasswordErr, setNewPasswordErr] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const [cognitoUser, setCognitoUser] = useState(null);

    const validate = () => {
        let isValid = true;
        setEmailErr('');
        setPasswordErr('');
        setNewPasswordErr('');

        if (!email) {
            setEmailErr("Email is required");
            isValid = false;
        }
        if (!password) {
            setPasswordErr("Password is required");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordErr("Password must be at least 6 characters");
            isValid = false;
        }

        if (showNewPasswordInput) {
            if (!newPassword) {
                setNewPasswordErr("New password is required");
                isValid = false;
            } else if (newPassword.length < 6) {
                setNewPasswordErr("New password must be at least 6 characters");
                isValid = false;
            } else if (newPassword !== confirmedPassword) {
                setNewPasswordErr("Passwords do not match");
                isValid = false;
            }
        }

        return isValid;
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleLogin = async () => {
        setLoginErr("");
        if (!validate()) return;

        if (!showNewPasswordInput) {
            try {
                const result = await authenticate(email, password);
                if (result.status === 'success') {
                    loginUser(result.result.accessToken);
                    navigate('/webapp');
                } else if (result.status === 'newPasswordRequired') {
                    setShowNewPasswordInput(true);
                    setCognitoUser(result.cognitoUser);
                }
            } catch (error) {
                setLoginErr(error.err ? error.err.message : 'An error occurred during login.');
            }
        } else {
            try {
                if (!cognitoUser) {
                    setLoginErr("Session information is missing. Please try logging in again.");
                    return;
                }
                await submitNewPassword(cognitoUser, newPassword, {});
                loginUser(cognitoUser);
                navigate('/webapp');
            } catch (error) {
                setLoginErr(error.message || 'Failed to set new password.');
            }
        }
    };

    return (
        <Container component="main" className="custom-container" sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url("/icons/map3.png")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <Card sx={{ padding: 4, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <Typography component="h1" variant="h5">
                    <img src="/icons/nrtm.png" alt="NRTM Logo"
                         style={{ width: '30px', height: '30px', marginRight: '10px', verticalAlign: 'middle' }} />
                    Welcome To NRTM
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email"
                        helperText={emailErr}
                        error={!!emailErr}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={passwordVisible ? "text" : "password"}
                        label="Password"
                        helperText={passwordErr}
                        error={!!passwordErr}
                        margin="normal"
                        fullWidth
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin();
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => setPasswordVisible(!passwordVisible)} edge="end">
                                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    {showNewPasswordInput && (
                        <>
                            <TextField
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type={newPasswordVisible ? "text" : "password"}
                                label="New Password"
                                helperText={newPasswordErr}
                                error={!!newPasswordErr}
                                margin="normal"
                                fullWidth
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleLogin();
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton onClick={() => setNewPasswordVisible(!newPasswordVisible)} edge="end">
                                            {newPasswordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                            <TextField
                                value={confirmedPassword}
                                onChange={(e) => setConfirmedPassword(e.target.value)}
                                type={confirmedPasswordVisible ? "text" : "password"}
                                label="Confirm New Password"
                                margin="normal"
                                fullWidth
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleLogin();
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={() => setConfirmedPasswordVisible(!confirmedPasswordVisible)}
                                            edge="end">
                                            {confirmedPasswordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </>
                    )}
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <Button
                            variant='contained'
                            onClick={handleLogin}
                            sx={{ mt: 2, mb: 2 }}
                            fullWidth
                        >
                            {showNewPasswordInput ? 'Set New Password' : 'Login'}
                        </Button>
                        {loginErr && (
                            <Typography variant="body2" color="error">{loginErr}</Typography>
                        )}
                    </Box>
                    {loginErr && (
                        <Typography variant="body2" color="error">{loginErr}</Typography>
                    )}
                </Box>
            </Card>
        </Container>
    );
};

export default Login;
