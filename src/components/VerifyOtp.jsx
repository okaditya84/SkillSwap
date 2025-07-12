import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOtp = ({ setIsLoggedIn }) => {
    const { userId } = useParams();
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://odoo-begin.onrender.com/api/auth/verify-otp', {
                userId,
                otp,
            });
            alert(res.data.message);
            localStorage.setItem('token', res.data.token);
            setIsLoggedIn(true); // Set logged in state to true after successful verification
            navigate('/'); // Redirect to home page after login
        } catch (err) {
            alert(err.response?.data?.message || 'OTP verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Glassmorphism container */}
                <div className="auth-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Verify Your Account</h2>
                        <p className="auth-subtitle">Enter the OTP sent to your email or mobile</p>
                    </div>
                    
                    <form onSubmit={handleVerify} className="auth-form">
                        <div className="form-group">
                            <label className="auth-label">OTP Code</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="auth-input"
                                maxLength="6"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="auth-btn auth-btn-register"
                        >
                            <span>Verify Account</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
