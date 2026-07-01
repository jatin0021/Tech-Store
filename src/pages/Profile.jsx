import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { User, ShieldCheck, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

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
    const profileToast = toast.loading("Updating customer database blocks...");
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
      toast.success("Security block updated successfully!", {
        id: profileToast,
      });
      reset((values) => ({ ...values, password: "" }));
    } catch (err) {
      toast.error(err.message || "Failed to update profile block.", {
        id: profileToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-orange-655 font-mono text-base uppercase">Loading profile signature...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fadeIn text-stone-850">
      {/* Page Title */}
      <div className="border-b border-stone-100 pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 font-sans-title">
          Profile <span className="text-orange-600">Ledger</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
        {/* Left Side: Avatar Card */}
        <div className="bg-white border border-stone-100 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <div className="relative inline-flex mx-auto p-4 bg-orange-50 border border-orange-100 rounded-full text-orange-600">
            <User className="w-16 h-16" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-850">{user.name}</h3>
            <span className="text-xs text-orange-600 font-mono font-bold uppercase tracking-wider block mt-0.5">
              {user.role} Node
            </span>
            <span className="text-xs text-stone-400 font-mono block mt-1">{user.email}</span>
          </div>

          <div className="border-t border-stone-100 pt-4 text-xs font-semibold uppercase leading-relaxed text-left space-y-1 pl-2 text-stone-500">
            <div className="flex justify-between">
              <span>Account Sector:</span>
              <span className="text-stone-800 font-mono">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Privilege Index:</span>
              <span className={user.role === "admin" ? "text-orange-600" : "text-emerald-600"}>
                {user.role === "admin" ? "Root/Admin" : "Standard"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Deck */}
        <div className="lg:col-span-2 bg-white border border-stone-100 rounded-3xl p-6 md:p-8 shadow-sm text-left">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-base font-bold uppercase tracking-wider text-stone-800 border-b border-stone-100 pb-3 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <span>General Settings</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.name.message}</p>}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Email (Locked)</label>
                <input
                  type="email"
                  {...register("email")}
                  disabled
                  className="w-full bg-stone-100/50 border border-stone-200 rounded-2xl py-2.5 px-4 text-xs text-stone-400 focus:outline-none cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Phone</label>
                <input
                  type="text"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.phone && <p className="text-xs text-red-600 font-mono mt-0.5">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">New Password (Leave blank to keep)</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    minLength: { value: 6, message: "New password must be at least 6 keys" },
                  })}
                  className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                />
                {errors.password && <p className="text-xs text-red-650 font-mono mt-0.5">{errors.password.message}</p>}
              </div>
            </div>

            {/* Address fields */}
            <div className="border-t border-stone-100 pt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Default Dispatch Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Street */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Street / Suite</label>
                  <input
                    type="text"
                    {...register("address.street", { required: "Street is required" })}
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                  />
                  {errors.address?.street && <p className="text-xs text-red-655 font-mono mt-0.5">{errors.address.street.message}</p>}
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">City Sector</label>
                  <input
                    type="text"
                    {...register("address.city", { required: "City is required" })}
                    className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-4 text-xs text-stone-800 focus:outline-none transition-colors"
                  />
                  {errors.address?.city && <p className="text-xs text-red-655 font-mono mt-0.5">{errors.address.city.message}</p>}
                </div>

                {/* State & Pincode */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">State</label>
                    <input
                      type="text"
                      {...register("address.state", { required: "State is required" })}
                      className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-2 text-xs text-stone-800 focus:outline-none transition-colors"
                    />
                    {errors.address?.state && <p className="text-xs text-red-655 font-mono mt-0.5">{errors.address.state.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">Pincode</label>
                    <input
                      type="text"
                      {...register("address.pincode", { required: "Pincode is required" })}
                      className="w-full bg-stone-50 border border-stone-200 focus:bg-white focus:border-orange-500/30 rounded-2xl py-2.5 px-2 text-xs text-stone-800 focus:outline-none transition-colors"
                    />
                    {errors.address?.pincode && <p className="text-xs text-red-655 font-mono mt-0.5">{errors.address.pincode.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-850 text-white text-xs py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center space-x-2 shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${submitting ? "animate-spin" : ""}`} />
              <span>Update Security Blocks</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
