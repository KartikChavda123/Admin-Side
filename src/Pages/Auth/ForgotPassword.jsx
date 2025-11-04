import React, { useState } from "react";
import { toast } from "sonner";
import { ApiService } from "../../Sevices/ApiService";
import { RESET_PASSWORD_API, SEND_OTP_API } from "../../Sevices/UrlService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp+password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await ApiService.postDataService(SEND_OTP_API, { email });
      console.log("OTP sent:", result);
      toast.success("OTP sent successfully!");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP!");
      console.error(error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const data = { email, otp, newPassword };
      const result = await ApiService.postDataService(RESET_PASSWORD_API, data);
      console.log("Password reset result:", result);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Password reset failed!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6fb] p-4">
      <div className="w-full max-w-md bg-white shadow-[0_10px_35px_rgba(27,60,116,0.08)] rounded-2xl p-8 relative">
        {/* Blue Glow */}
        <div className="pointer-events-none absolute -right-20 top-0 h-full w-48 bg-gradient-to-b from-[#eaf1ff] to-transparent blur-2xl opacity-80" />

        {/* Lock Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#f3f6fb] p-4 rounded-full shadow-inner">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E2729"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-slate-900 mb-1">
          {step === 1 ? "Reset Password" : "Verify OTP"}
        </h2>
        <p className="text-center text-sm text-slate-500 mb-6">
          {step === 1
            ? "Enter your email to reset your password."
            : "Enter the OTP sent to your email and set a new password."}
        </p>

        {/* Form */}
        <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
          {step === 1 ? (
            <>
              {/* Email Field */}
              <label className="block text-sm text-slate-600 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 4.25l-9.4 5.88a1 1 0 0 1-1.2 0L2 8.25V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#2E2729] focus:ring-2 focus:ring-[#2E2729]/20 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E2729] text-white py-3 rounded-lg font-medium hover:bg-[#453B3E] transition"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              {/* OTP Field */}
              <label className="block text-sm text-slate-600 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
                className="w-full mb-4 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#2E2729] focus:ring-2 focus:ring-[#2E2729]/20 transition"
              />

              {/* New Password */}
              <label className="block text-sm text-slate-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full mb-5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#2E2729] focus:ring-2 focus:ring-[#2E2729]/20 transition"
              />

              <button
                type="submit"
                className="w-full bg-[#2E2729] text-white py-3 rounded-lg font-medium hover:bg-[#453B3E] transition"
              >
                Reset Password
              </button>
            </>
          )}
        </form>

        {/* Bottom text */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have access anymore?{" "}
          <a
            href="/login"
            className="text-[#2E2729] hover:text-[#453B3E] font-medium hover:underline"
          >
            Try another method
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
