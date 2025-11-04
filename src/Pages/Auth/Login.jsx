import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LOGIN_API } from "../../Sevices/UrlService";
import { ApiService } from "../../Sevices/ApiService";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };
      console.log("<<<data", data);

      const result = await ApiService.postDataService(LOGIN_API, data);
      console.log("Login Result:", result);
      toast.success("Login Successful!");

      if (result?.user?.role === "admin") {
        localStorage.setItem("token", result?.token);
        localStorage.setItem("user", JSON.stringify(result?.user));
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error("Login Failed!");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f6fb] flex items-center justify-center p-4">
      <div className="w-full max-w-xl p-5">
        <form
          onSubmit={handleLogin}
          className="relative bg-white rounded-2xl shadow-[0_10px_35px_rgba(27,60,116,0.08)] p-8 md:p-10 overflow-hidden"
        >
          {/* soft right-side blue glow */}
          <div className="pointer-events-none absolute -right-24 top-0 h-full w-56 bg-gradient-to-b from-[#eaf1ff] to-transparent blur-2xl opacity-80" />

          {/* brand */}
          <div className="flex items-center gap-2 mb-6">
            <img
              src="/src/assets/Gemini Logo.svg"
              alt="Gemini Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* heading */}
          <h1 className="text-[22px] md:text-2xl font-semibold text-slate-900">
            Log in to your Account
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back! Select method to log in:
          </p>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
          
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Email */}
          <label className="block text-sm text-slate-600 mb-1">Email</label>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 4.25l-9.4 5.88a1 1 0 0 1-1.2 0L2 8.25V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
                />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#215cff] focus:ring-2 focus:ring-[#215cff]/20 transition"
            />
          </div>

          {/* Password */}
          <label className="block text-sm text-slate-600 mb-1">Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M12 1a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v3h6V6a3 3 0 0 0-3-3Z"
                />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#215cff] focus:ring-2 focus:ring-[#215cff]/20 transition"
            />
          </div>

          {/* remember / forgot */}
          <div className="mt-3 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600 select-none">
            
            
            </label>
            <a href="/forgot-password" className="text-sm text-[#2E2729] hover:text-[#453B3E] hover:underline transition">
              Forgot Password?
            </a>
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-[#2E2729] text-white font-medium py-3 hover:bg-[#453B3E] transition shadow-[0_6px_18px_rgba(33,92,255,0.35)]"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
