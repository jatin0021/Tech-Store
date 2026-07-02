import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { User, ShieldCheck, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Loading from "../components/Loading.jsx";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
      password: "",
    },
  });

  // Prepopulate form fields when user state loads or changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
        },
        password: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const profileToast = toast.loading("Updating profile details...");
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        address: data.address,
      };
      if (data.password.trim()) {
        payload.password = data.password;
      }

      await updateProfile(payload);
      toast.success("Profile updated successfully!", {
        id: profileToast,
      });
      reset((values) => ({ ...values, password: "" }));
    } catch (err) {
      toast.error(err.message || "Failed to update profile details.", {
        id: profileToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-blue-600 font-sans text-base uppercase font-semibold">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-gray-800">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        {/* Left Side: Avatar Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center space-y-4 shadow-sm">
          <div className="relative inline-flex mx-auto p-4 bg-blue-50 border border-blue-100 rounded-full text-blue-600">
            <User className="w-16 h-16" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <span className="inline-block text-xs text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded uppercase tracking-wider mt-1">
              {user.role}
            </span>
            <span className="text-xs text-gray-400 block mt-2">{user.email}</span>
          </div>

          <div className="border-t border-gray-200 pt-4 text-xs font-semibold uppercase leading-relaxed text-left space-y-2 pl-1 text-gray-500">
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="text-gray-800 font-semibold">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Privilege Level:</span>
              <span className={user.role === "admin" ? "text-blue-600" : "text-green-600"}>
                {user.role === "admin" ? "Admin" : "Standard"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Deck */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm text-left">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-950 border-b border-gray-150 pb-3 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>General Settings</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-xs text-red-605 mt-0.5 font-semibold">{errors.name.message}</p>}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Email (Read Only)</label>
                <input
                  type="email"
                  {...register("email")}
                  disabled
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2.5 px-3.5 text-xs text-gray-400 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Phone</label>
                <input
                  type="text"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-red-605 mt-0.5 font-semibold">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">New Password (Leave blank to keep)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    minLength: { value: 6, message: "New password must be at least 6 characters" },
                  })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                />
                {errors.password && <p className="text-xs text-red-605 mt-0.5 font-semibold">{errors.password.message}</p>}
              </div>
            </div>

            {/* Address fields */}
            <div className="border-t border-gray-150 pt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-550 tracking-wider">Default Delivery Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Street */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Street / Suite</label>
                  <input
                    type="text"
                    {...register("address.street", { required: "Street is required" })}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                  {errors.address?.street && <p className="text-xs text-red-605 mt-0.5 font-semibold">{errors.address.street.message}</p>}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">City</label>
                  <input
                    type="text"
                    {...register("address.city", { required: "City is required" })}
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-3.5 text-xs text-gray-800 focus:outline-none transition-colors"
                  />
                  {errors.address?.city && <p className="text-xs text-red-655 mt-0.5 font-semibold">{errors.address.city.message}</p>}
                </div>

                {/* State & Pincode */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">State</label>
                    <input
                      type="text"
                      {...register("address.state", { required: "State is required" })}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                    />
                    {errors.address?.state && <p className="text-xs text-red-605 mt-0.5 font-semibold">{errors.address.state.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Pincode</label>
                    <input
                      type="text"
                      {...register("address.pincode", { required: "Pincode is required" })}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-lg py-2.5 px-2.5 text-xs text-gray-800 focus:outline-none transition-colors"
                    />
                    {errors.address?.pincode && <p className="text-xs text-red-655 mt-0.5 font-semibold">{errors.address.pincode.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-805 text-white text-xs py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 border-none shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${submitting ? "animate-spin" : ""}`} />
              <span>Update Profile</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
