import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('+91');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (mobile === '+91') {
            setMobile('');
        }
        try {
            const res = await axios.post('https://odoo-begin.onrender.com/api/auth/register', {
                email: email || undefined,
                mobile: mobile || undefined,
                password,
            });
            alert(res.data.message);
            navigate(`/verify-otp/${res.data.userId}`);
        } catch (err) {
            alert('Registration failed: ' + (err.response?.data?.message || err.message));
            console.error(err);
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
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Create a strong password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="auth-btn auth-btn-register"
                        >
                            <span>Create Account</span>
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
