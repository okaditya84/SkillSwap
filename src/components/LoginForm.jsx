import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import skillSwapService from '../services/skillSwapService';

const LoginForm = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('+91');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!password) {
            alert('Password is required');
            return;
        }
        
        if (!email && (!mobile || mobile === '+91') && !name) {
            alert('Please provide either email, mobile number, or name');
            return;
        }
        
        if (mobile === '+91') {
            setMobile('');
        }
        
        setIsLoading(true);
        
        console.log('Attempting login with:', {
            email: email || undefined,
            mobile: mobile || undefined,
            name: name || undefined,
            password: '***'
        });
        
        try {
            const result = await skillSwapService.login({
                email: email || undefined,
                mobile: mobile || undefined,
                name: name || undefined,
                password,
            });
            
            alert(result.message);
            
            // Store token and user data
            localStorage.setItem('skillSwap_token', result.token);
            localStorage.setItem('skillSwap_currentUser', JSON.stringify(result.user));
            
            if (result.requiresOTP) {
                navigate(`/verify-otp/${result.userId}`);
            } else {
                // Skip OTP for demo and login directly
                setIsLoggedIn(true);
                navigate('/');
            }
        } catch (err) {
            alert('Login failed: ' + err.message);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Glassmorphism container */}
                <div className="auth-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to your SkillSwap account</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="form-group">
                            <label className="auth-label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="auth-label">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                autoComplete="name"
                                onChange={(e) => setName(e.target.value)}
                                className="auth-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="auth-label">Mobile</label>
                            <input
                                type="text"
                                placeholder="Mobile number (+91...)"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="auth-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="auth-btn auth-btn-login"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="auth-link"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
