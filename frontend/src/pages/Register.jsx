import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    User,
    Mail,
    LockKeyhole,
    GraduationCap,
    CheckCircle2
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const requirements = [
        { label: "At least 6 characters", valid: password.length >= 6 },
        { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
        { label: "One number", valid: /[0-9]/.test(password) }
    ];

    const strength = requirements.filter((item) => item.valid).length;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (name.trim().length < 2) {
            setError("Please enter your full name.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!acceptedTerms) {
            setError("Please accept the terms to continue.");
            return;
        }

        setLoading(true);

        try {
            await register(name.trim(), email.trim(), password);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

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

                <div className="auth-content">
                    <h2 className="auth-title">Create Your Account</h2>

                    <p className="auth-subtitle">
                        Join SkillTrack and start your learning journey.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="auth-label">Full Name</label>

                            <div className="auth-input-wrap">
                                <User size={19} className="auth-input-icon" />

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoComplete="name"
                                    required
                                    className="auth-input"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="auth-label">Email Address</label>

                            <div className="auth-input-wrap">
                                <Mail size={19} className="auth-input-icon" />

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

                        <div>
                            <label className="auth-label">Password</label>

                            <div className="auth-input-wrap">
                                <LockKeyhole size={19} className="auth-input-icon" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                    className="auth-input"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="auth-eye"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                    }
                                </button>
                            </div>

                            {password.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map((item) => (
                                            <div
                                                key={item}
                                                className={`h-1.5 flex-1 rounded-full ${
                                                    strength >= item
                                                        ? strength === 3
                                                            ? "bg-green-500"
                                                            : "bg-purple-500"
                                                        : "bg-[#E5E1F5]"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-xs text-[#68739B] mt-2">
                                        Password strength:{" "}
                                        <span className="font-semibold text-[#6036E8]">
                                            {strength === 3
                                                ? "Strong"
                                                : strength === 2
                                                    ? "Medium"
                                                    : "Weak"}
                                        </span>
                                    </p>

                                    {requirements.map((item) => (
                                        <p
                                            key={item.label}
                                            className={`password-check ${
                                                item.valid
                                                    ? "text-green-600"
                                                    : "text-[#8790B2]"
                                            }`}
                                        >
                                            <CheckCircle2 size={14} />
                                            {item.label}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="auth-label">Confirm Password</label>

                            <div className="auth-input-wrap">
                                <LockKeyhole size={19} className="auth-input-icon" />

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter your password again"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    required
                                    className="auth-input"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="auth-eye"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />
                                    }
                                </button>
                            </div>

                            {confirmPassword.length > 0 && (
                                <p className={`text-xs mt-2 ${
                                    password === confirmPassword
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}>
                                    {password === confirmPassword
                                        ? "✓ Passwords match"
                                        : "Passwords do not match"}
                                </p>
                            )}
                        </div>

                        <label className="flex items-start gap-2 text-sm text-[#68739B] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 accent-[#6036E8]"
                            />

                            <span>
                                I agree to use SkillTrack responsibly and accept its terms.
                            </span>
                        </label>

                        {error && (
                            <div className="auth-error">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="auth-button"
                        >
                            {loading ? "Creating account..." : "Create Account →"}
                        </button>

                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">
                            Login →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;