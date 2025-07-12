import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import skillSwapService from '../services/skillSwapService';

const VerifyOtp = ({ setIsLoggedIn }) => {
    const { userId } = useParams();
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        
        if (!otp || otp.length < 4) {
            alert('Please enter a valid OTP');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await skillSwapService.verifyOTP(userId, otp);
            alert(result.message);
            
            localStorage.setItem('skillSwap_token', result.token);
            localStorage.setItem('skillSwap_currentUser', JSON.stringify(result.user));
            
            setIsLoggedIn(true); // Set logged in state to true after successful verification
            navigate('/'); // Redirect to home page after login
        } catch (err) {
            alert('OTP verification failed: ' + err.message);
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
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Verify Account</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
