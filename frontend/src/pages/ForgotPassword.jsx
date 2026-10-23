
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);

    const handleForgotPassword = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setRequestSent(false);
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
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
                    data.message || "Unable to process your request."
                );
            }

            setMessage(
                data.message || "Password recovery code generated."
            );
            setRequestSent(true);
        } catch (err) {
            setError(
                err.message ||
                "Unable to connect to the server. Please try again."
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
                            <span className="text-4xl">🔑</span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-cyan-400">
                            Forgot Password
                        </h1>
                        <p className="text-slate-400 mt-3 text-sm">
                            Enter your registered email address to reset
                            your password.
                        </p>
                    </div>

                    <form
                        onSubmit={handleForgotPassword}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="forgot-email"
                                className="block text-sm font-medium text-slate-300 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="forgot-email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setRequestSent(false);
                                    setMessage("");
                                    setError("");
                                }}
                                placeholder="Enter your registered email"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-slate-950/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                            >
                                {error}
                            </div>
                        )}

                        {message && (
                            <div
                                role="status"
                                className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                            >
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full min-h-12 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Request"}
                        </button>

                        {requestSent && (
                            <button
                                type="button"
                                onClick={() => navigate("/reset-password")}
                                className="w-full min-h-12 px-4 py-3 rounded-xl border border-cyan-400 text-cyan-300 font-semibold hover:bg-cyan-400/10 transition"
                            >
                                Continue to Reset Password
                            </button>
                        )}
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

export default ForgotPassword;
