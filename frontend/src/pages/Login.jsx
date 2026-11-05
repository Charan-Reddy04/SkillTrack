import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    GraduationCap
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            await login(email.trim(), password);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">

                    <div className="auth-logo">
                        <GraduationCap size={34} />
                    </div>

                    <h1 className="auth-brand">
                        Skill<span style={{ color: "#BCA8FF" }}>Track</span>
                    </h1>

                    <p className="auth-tagline">
                        Plan. Learn. Practice. Improve.
                    </p>

                </div>

                {/* Login Form */}
                <div className="auth-content">

                    <h2 className="auth-title">
                        Welcome Back!
                    </h2>

                    <p className="auth-subtitle">
                        Login to continue your learning journey.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="auth-label">
                                Email Address
                            </label>

                            <div className="auth-input-wrap">

                                <Mail
                                    size={19}
                                    className="auth-input-icon"
                                />

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                    className="auth-input"
                                />

                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="auth-label">
                                Password
                            </label>

                            <div className="auth-input-wrap">

                                <LockKeyhole
                                    size={19}
                                    className="auth-input-icon"
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    className="auth-input"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="auth-eye"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                    }
                                </button>

                            </div>
                        </div>

                        {/* Security Information */}
                        <p className="text-xs text-[#68739B]">
                            Your account is protected with secure password authentication.
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-button"
                        >
                            {loading
                                ? "Logging in..."
                                : "Login to SkillTrack →"}
                        </button>

                    </form>

                    {/* Register Link */}
                    <div className="auth-footer">
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="auth-link"
                        >
                            Create Account →
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
