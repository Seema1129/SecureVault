
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");

        const normalizedEmail = email.trim();
        const normalizedCode = code.trim();

        if (!normalizedEmail || !normalizedCode) {
            setError("Please enter your email and recovery code.");
            return;
        }

        if (!/^\d{6}$/.test(normalizedCode)) {
            setError("Enter the 6-digit recovery code.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: normalizedEmail,
                        code: normalizedCode,
                        newPassword: password,
                    }),
                }
            );

            const responseText = await response.text();
            let data = {};

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = { message: responseText };
                }
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Password reset failed."
                );
            }

            setMessage(
                data.message || "Password reset successfully."
            );

            setCode("");
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1800);
        } catch (err) {
            setError(
                err.message ||
                "Unable to reset password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl p-8 sm:p-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <span className="text-4xl">🔐</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-cyan-400">
                            Reset Password
                        </h1>
                        <p className="text-slate-400 mt-3 text-sm">
                            Enter your recovery code and create a new password.
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                Registered Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your registered email"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="recovery-code" className="block text-sm font-medium text-slate-300 mb-2">
                                6-Digit Recovery Code
                            </label>
                            <input
                                id="recovery-code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                placeholder="Enter your recovery code"
                                required
                                maxLength={6}
                                className="w-full h-12 px-4 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                            </label>
                            <input
                                id="new-password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter new password"
                                required
                                minLength={8}
                                className="w-full h-12 px-4 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                placeholder="Confirm new password"
                                required
                                minLength={8}
                                className="w-full h-12 px-4 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                        </div>

                        {error && (
                            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div role="status" className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 transition duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="text-center mt-7 text-sm">
                        <Link
                            to="/login"
                            className="text-cyan-400 hover:text-cyan-300 transition font-semibold"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    SecureVault • Password Management System
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;
