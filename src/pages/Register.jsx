import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { UserPlus, ChevronRight } from "lucide-react";
import { useState } from "react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const registerToast = toast.loading("Creating account...");
    try {
      await register(data.name, data.email, data.password, data.phone, data.address);
      toast.success("Account registered successfully! Welcome.", {
        id: registerToast,
      });
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to create account.", {
        id: registerToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-8 shadow-sm relative overflow-hidden text-gray-805 animate-scaleUp">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none"></div>

        {/* Title Deck */}
        <div className="text-center space-y-2 mb-6 relative">
          <div className="inline-flex p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 mb-2">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="text-xs text-gray-400 font-sans uppercase tracking-wider font-semibold">
            Enter your registration details
          </p>
        </div>

        {/* Form Deck */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...registerField("name", { required: "Name is required" })}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
              />
              {errors.name && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                {...registerField("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format",
                  },
                })}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
              />
              {errors.email && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.email.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Phone Number</label>
              <input
                type="text"
                placeholder="9876543210"
                {...registerField("phone", {
                  required: "Phone number is required",
                  minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                })}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
              />
              {errors.phone && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...registerField("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters required" },
                })}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
              />
              {errors.password && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.password.message}</p>}
            </div>

          </div>

          <div className="border-t border-gray-150 pt-3 space-y-3">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider font-sans">Shipping Address</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Street */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Street / Suite</label>
                <input
                  type="text"
                  placeholder="128 Cyber Avenue"
                  {...registerField("address.street", { required: "Street is required" })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.address?.street && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.address.street.message}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">City</label>
                <input
                  type="text"
                  placeholder="Neo City"
                  {...registerField("address.city", { required: "City is required" })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.address?.city && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.address.city.message}</p>}
              </div>

              {/* State & Pincode Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">State</label>
                  <input
                    type="text"
                    placeholder="CA"
                    {...registerField("address.state", { required: "State is required" })}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                  {errors.address?.state && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.address.state.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Pincode</label>
                  <input
                    type="text"
                    placeholder="94016"
                    {...registerField("address.pincode", { required: "Pincode is required" })}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                  {errors.address?.pincode && <p className="text-xs text-red-600 font-semibold mt-0.5">{errors.address.pincode.message}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs py-3.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 border-none shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <span>Register</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Navigation Redirects */}
        <div className="mt-6 text-center text-xs font-semibold text-gray-400 border-t border-gray-150 pt-4">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors uppercase ml-1"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
