import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../utils/api.js";
import logo from '../image/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await post("/api/admin/login", { userId, password });

      if (response && response.success) {
        localStorage.setItem("adminAuth", "true");
        navigate("/admin/dashboard");
      } else {
        setError(response?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-primary-600 rounded-t-2xl p-6 text-center relative overflow-hidden">
          {/* Header Background Pattern */}
          <div className="absolute -top-12 -right-8 w-24 h-24 bg-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-4 w-20 h-20 bg-white/8 rounded-full pointer-events-none"></div>

          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center  relative z-10">
            <img
              src={logo}
              alt="logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <h1 className="text-xl font-bold text-white mb-1 tracking-tight">
            BhartiFreeLimbs Admin Portal
          </h1>
          <p className="text-sm text-white/90">Secure Access</p>
        </div>

        {/* Form Section */}
        <div className="p-6">
          {error && (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <i className="fa fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                User ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user ID"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 text-sm border-2 border-neutral-200 rounded-xl bg-neutral-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                  <i className="fa fa-user text-sm"></i>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 text-sm border-2 border-neutral-200 rounded-xl bg-neutral-50 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none disabled:opacity-50"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                  <i className="fa fa-lock text-sm"></i>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-primary transition-colors duration-200 p-1 rounded-md hover:bg-primary/10"
                >
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } text-sm`}
                  ></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary/20 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in-alt"></i>
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
