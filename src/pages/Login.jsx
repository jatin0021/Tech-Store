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
    const loginToast = toast.loading("Verifying security credentials...");
    try {
      await login(data.email, data.password);
      toast.success("Access Authorized! Welcome to Tech Store.", {
        id: loginToast,
      });
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to authorize access. Check keys.", {
        id: loginToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center">
      <div className="w-full max-w-md bg-white border border-stone-100 rounded-3xl p-8 shadow-xl relative overflow-hidden text-stone-850 animate-scaleUp">
        {/* Decorative subtle element */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] pointer-events-none"></div>

        {/* Title Deck */}
        <div className="text-center space-y-2 mb-8 relative">
          <div className="inline-flex p-3 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900">
            System <span className="text-orange-600">Access</span>
          </h2>
          <p className="text-xs text-stone-400 font-mono uppercase tracking-wider font-semibold">
            Enter decryption details
          </p>
        </div>

        {/* Form Deck */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative text-left">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
              Network Email
            </label>
            <input
              type="email"
              placeholder="architect@matrix.com"
              {...registerField("email", {
                required: "Email signature is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid network email syntax",
                },
              })}
              className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-red-505 font-mono pl-1 mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
              Decryption Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              {...registerField("password", {
                required: "Decryption password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 keys",
                },
              })}
              className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-3 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
            />
            {errors.password && (
              <p className="text-xs text-red-505 font-mono pl-1 mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-850 text-white font-sans text-xs py-4 rounded-2xl font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Decrypt Access</span>
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Tip */}
        <div className="mt-6 bg-stone-50 border border-stone-150 rounded-2xl p-4 flex items-start space-x-2.5 text-left">
          <ShieldAlert className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-[10px] leading-relaxed text-stone-500 font-mono uppercase space-y-1 font-semibold">
            <p className="font-bold text-stone-850">Seeded Credentials:</p>
            <p>Admin: admin@techstore.com | adminpassword123</p>
            <p>User: user@techstore.com | userpassword123</p>
          </div>
        </div>

        {/* Navigation Redirects */}
        <div className="mt-8 text-center text-xs font-semibold text-stone-400 border-t border-stone-100 pt-4">
          <span>First sector scan? </span>
          <Link
            to="/register"
            className="text-orange-600 hover:text-orange-700 font-bold transition-colors uppercase ml-1"
          >
            Register Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
