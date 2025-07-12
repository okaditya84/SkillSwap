import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import skillSwapService from '../services/skillSwapService';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('+91');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!name) {
            alert('Name is required');
            return;
        }
        
        if (!password) {
            alert('Password is required');
            return;
        }
        
        if (!email && (!mobile || mobile === '+91')) {
            alert('Please provide either email or mobile number');
            return;
        }
        
        if (mobile === '+91') {
            setMobile('');
        }
        
        setIsLoading(true);
        
        console.log('Attempting registration with:', {
            email: email || undefined,
            mobile: mobile || undefined,
            name: name,
            password: '***'
        });
        
        try {
            const result = await skillSwapService.register({
                email: email || undefined,
                mobile: mobile || undefined,
                name: name,
                password,
            });
            
            alert(result.message);
            
            // Store token and user data
            localStorage.setItem('skillSwap_token', result.token);
            localStorage.setItem('skillSwap_currentUser', JSON.stringify(result.user));
            
            if (result.requiresOTP) {
                navigate(`/verify-otp/${result.userId}`);
            } else {
                // Skip OTP for demo and redirect to complete profile
                navigate('/user-profile');
            }
        } catch (err) {
            alert('Registration failed: ' + err.message);
            console.error('Registration error:', err);
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
                        <h2 className="auth-title">Join SkillSwap</h2>
                        <p className="auth-subtitle">Create your account and start learning</p>
                    </div>
                    
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="form-group">
                            <label className="auth-label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
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
                                onChange={(e) => setName(e.target.value)}
                                className="auth-input"
                                required
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
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="auth-btn auth-btn-register"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/')}
                                className="auth-link"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
