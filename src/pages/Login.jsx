import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { LogIn, ShieldAlert } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  // Redirect target after login (default is homepage)
  const from = location.state?.from?.pathname || "/";

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const loginToast = toast.loading("Verifying credentials...");
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!", {
        id: loginToast,
      });
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to login. Please check details.", {
        id: loginToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm relative overflow-hidden text-gray-805 animate-scaleUp">
        {/* Decorative subtle element */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none"></div>

        {/* Title Deck */}
        <div className="text-center space-y-2 mb-8 relative">
          <div className="inline-flex p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Sign In
          </h2>
          <p className="text-xs text-gray-400 font-sans uppercase tracking-wider font-semibold">
            Enter your login credentials
          </p>
        </div>

        {/* Form Deck */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative text-left">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="architect@matrix.com"
              {...registerField("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address format",
                },
              })}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-semibold pl-1 mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              {...registerField("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
            />
            {errors.password && (
              <p className="text-xs text-red-600 font-semibold pl-1 mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-sans text-xs py-3.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 border-none shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Sign In</span>
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Tip */}
        <div className="mt-6 bg-blue-50/50 border border-blue-100/50 rounded-lg p-4 flex items-start space-x-2.5 text-left">
          <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] leading-relaxed text-gray-500 uppercase space-y-1 font-semibold">
            <p className="font-bold text-gray-800">Demo Accounts:</p>
            <p>Admin: admin@techstore.com | adminpassword123</p>
            <p>User: user@techstore.com | userpassword123</p>
          </div>
        </div>

        {/* Navigation Redirects */}
        <div className="mt-8 text-center text-xs font-semibold text-gray-400 border-t border-gray-150 pt-4">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors uppercase ml-1"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
