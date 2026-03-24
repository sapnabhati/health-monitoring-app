import { useState } from 'react'
import { Activity, Mail, Lock, Key, ArrowRight, ShieldCheck, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import './Auth.css'

interface AuthProps {
    onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [otpMethod, setOtpMethod] = useState<'email' | 'sms' | null>(null)
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [otpExpires, setOtpExpires] = useState<number | null>(null)

    const handleSendOTP = async (method: 'email' | 'sms') => {
        setError('')
        setSuccess('')
        const contact = method === 'email' ? email : phone

        if (!contact) {
            setError(`Please enter a ${method === 'email' ? 'valid email' : 'phone number'}`)
            return
        }

        setLoading(true)
        try {
            const response = await fetch('http://localhost:8000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, type: method })
            })

            const data = await response.json()

            if (response.ok) {
                setOtpMethod(method)
                setOtpSent(true)
                setSuccess(data.message)
                setOtpExpires(300) // 5 minutes in seconds
                startOtpTimer()
            } else {
                setError(data.detail || 'Failed to send OTP')
            }
        } catch (e) {
            setError('Unable to connect to server. Please ensure backend is running on port 8000.')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const startOtpTimer = () => {
        let seconds = 300
        const timer = setInterval(() => {
            seconds -= 1
            setOtpExpires(seconds)
            if (seconds <= 0) {
                clearInterval(timer)
                setOtpSent(false)
                setOtp('')
            }
        }, 1000)
    }

    const handleVerifyOTP = async () => {
        setError('')
        setSuccess('')

        if (!otp || otp.length !== 6) {
            setError('Please enter a 6-digit OTP')
            return
        }

        const contact = otpMethod === 'email' ? email : phone

        setLoading(true)
        try {
            const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, otp })
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess('OTP verified! Creating your account...')
                setTimeout(() => {
                    handleSignup(data.token)
                }, 1000)
            } else {
                setError(data.detail || 'Invalid OTP')
            }
        } catch (e) {
            setError('Failed to verify OTP')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleSignup = async (token: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone, otp })
            })

            if (response.ok) {
                localStorage.setItem('authToken', token)
                setSuccess('Account created successfully!')
                setTimeout(() => {
                    onLogin()
                }, 500)
            }
        } catch (e) {
            setError('Account creation failed')
            console.error(e)
        }
    }

    const handleLoginAuth = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Demo login
        if (email === 'demo@aurahealth.com' && password === 'demo123') {
            setSuccess('Logging in...')
            localStorage.setItem('authToken', 'demo_token')
            setTimeout(() => {
                onLogin()
            }, 500)
        } else {
            setError('Invalid credentials. Use demo@aurahealth.com / demo123')
        }
    }

    const handleGoogleSignIn = (credentialResponse: any) => {
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            // Send the Google token to your backend
            const token = credentialResponse.credential

            // For demo purposes, we'll accept any Google login
            localStorage.setItem('authToken', token)
            localStorage.setItem('googleToken', token)
            
            setSuccess('Google authentication successful!')
            
            setTimeout(() => {
                onLogin()
            }, 500)
        } catch (e) {
            setError('Google authentication failed. Please try again.')
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleError = () => {
        setError('Google Sign-In failed. Please try again.')
    }

    return (
        <div className="auth-container flex-center">
            {/* Background Decor */}
            <div className="auth-bg-glow glow-1"></div>
            <div className="auth-bg-glow glow-2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-card glass-card"
            >
                <div className="text-center mb-4">
                    <div className="auth-logo-wrapper mb-3">
                        <Activity size={32} color="var(--primary)" className="pulse-animation" />
                    </div>
                    <h2 className="auth-title">AuraHealth</h2>
                    <p className="text-muted text-sm">
                        {isLogin 
                            ? 'Welcome back to your secure portal.' 
                            : 'Create an encrypted health account with OTP verification.'}
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="alert alert-error"
                    >
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Success Alert */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="alert alert-success"
                    >
                        <CheckCircle size={18} />
                        <span>{success}</span>
                    </motion.div>
                )}

                <div className="form-container mt-4">
                    {isLogin ? (
                        <form onSubmit={handleLoginAuth} className="auth-form">
                            <div className="input-group">
                                <Mail className="input-icon" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group mt-3">
                                <Lock className="input-icon" size={20} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn-primary w-full mt-4 flex-center"
                                disabled={loading}
                            >
                                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                                <ArrowRight size={18} />
                            </button>

                            {/* Divider */}
                            <div className="divider-or mt-4">
                                <span>or</span>
                            </div>

                            {/* Google Sign-In Button */}
                            <div className="google-button-wrapper mt-4">
                                <GoogleLogin
                                    onSuccess={handleGoogleSignIn}
                                    onError={handleGoogleError}
                                    useOneTap
                                    text="signin_with"
                                    width="100%"
                                />
                            </div>
                        </form>
                    ) : (
                        <div>
                            <AnimatePresence mode="wait">
                                {!otpSent ? (
                                    <motion.div 
                                        key="signup" 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }} 
                                        exit={{ opacity: 0, x: 10 }}
                                        className="signup-form"
                                    >
                                        <div className="input-group">
                                            <Mail className="input-icon" size={20} />
                                            <input
                                                type="email"
                                                placeholder="Email address"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="input-group mt-3">
                                            <Phone className="input-icon" size={20} />
                                            <input
                                                type="tel"
                                                placeholder="Phone number (+1234567890)"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>

                                        <div className="otp-method-selector mt-4">
                                            <p className="text-sm text-muted mb-3">Choose how to receive OTP:</p>
                                            <div className="otp-buttons">
                                                <button
                                                    type="button"
                                                    className="otp-method-btn email-method"
                                                    onClick={() => handleSendOTP('email')}
                                                    disabled={loading || !email}
                                                >
                                                    <Mail size={20} />
                                                    <div>
                                                        <div className="method-title">Email OTP</div>
                                                        <div className="method-desc">Send to email</div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="otp-method-btn sms-method"
                                                    onClick={() => handleSendOTP('sms')}
                                                    disabled={loading || !phone}
                                                >
                                                    <Phone size={20} />
                                                    <div>
                                                        <div className="method-title">SMS OTP</div>
                                                        <div className="method-desc">Send to phone</div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted mt-4 flex-align gap-2">
                                            <ShieldCheck size={16} color="var(--accent)" />
                                            Your data will be end-to-end encrypted.
                                        </p>

                                        {/* Divider */}
                                        <div className="divider-or mt-4">
                                            <span>or</span>
                                        </div>

                                        {/* Google Sign-In for Signup */}
                                        <div className="google-button-wrapper mt-4">
                                            <GoogleLogin
                                                onSuccess={handleGoogleSignIn}
                                                onError={handleGoogleError}
                                                useOneTap
                                                text="signup_with"
                                                width="100%"
                                            />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="otp" 
                                        initial={{ opacity: 0, x: -10 }} 
                                        animate={{ opacity: 1, x: 0 }}
                                        className="otp-form"
                                    >
                                        <div className="otp-status">
                                            <div className="status-icon">
                                                {otpMethod === 'email' ? <Mail size={24} /> : <Phone size={24} />}
                                            </div>
                                            <p className="text-sm text-center">
                                                OTP sent to your {otpMethod === 'email' ? 'email address' : 'phone number'}
                                            </p>
                                            <p className="text-xs text-accent text-center mt-1">
                                                {otpMethod === 'email' ? email : phone}
                                            </p>
                                        </div>

                                        <div className="input-group mt-4">
                                            <Key className="input-icon" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                maxLength={6}
                                                autoFocus
                                            />
                                        </div>

                                        <div className="otp-timer mt-3">
                                            <p className="text-sm text-muted">
                                                Expires in: <span className="timer-text">{otpExpires ? `${Math.floor(otpExpires / 60)}:${(otpExpires % 60).toString().padStart(2, '0')}` : '0:00'}</span>
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn-primary w-full mt-4 flex-center"
                                            onClick={handleVerifyOTP}
                                            disabled={loading || !otp}
                                        >
                                            <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
                                            <ArrowRight size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            className="btn-secondary w-full mt-2"
                                            onClick={() => {
                                                setOtpSent(false)
                                                setOtp('')
                                                setOtpMethod(null)
                                                setSuccess('')
                                            }}
                                        >
                                            Change Method
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div className="auth-footer mt-4 text-center">
                    <p className="text-muted text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span 
                            className="auth-toggle" 
                            onClick={() => { 
                                setIsLogin(!isLogin)
                                setOtpSent(false)
                                setError('')
                                setSuccess('')
                            }}
                        >
                            {isLogin ? 'Sign up securely' : 'Sign in'}
                        </span>
                    </p>

                    <div className="demo-hint mt-3">
                        <span className="text-xs text-muted">Demo Credentials: demo@aurahealth.com / demo123</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
