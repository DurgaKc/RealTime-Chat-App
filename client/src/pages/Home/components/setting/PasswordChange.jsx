import React, { useState } from "react";
import toast from "react-hot-toast";
import ChatHeader from "../header";
import { changePassword } from "./PasswordChangeApi";
import Footer from "../../../../components/Footer";

const PasswordChange = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const toggleVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.newPassword !== form.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }

  if (form.newPassword.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {
    // Call the API with correct field names
    const result = await changePassword({
      oldPassword: form.currentPassword,  // ✅ Map currentPassword to oldPassword
      newPassword: form.newPassword
    });

    toast.success("Password changed successfully!");

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to change password");
  }
};

  return (
    <>
      <ChatHeader />

      <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] to-[#E8DFD8] flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-6">
          
          <h2 className="text-2xl font-bold text-[#957C62] mb-6 text-center">
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Current Password */}
            <div className="bg-[#F5F1ED] p-3 rounded-lg shadow-sm">
              <label className="text-sm text-gray-500">
                Current Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword.current ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C2A68C]"
                />
                <span
                  onClick={() => toggleVisibility("current")}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showPassword.current ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* New Password */}
            <div className="bg-[#F5F1ED] p-3 rounded-lg shadow-sm">
              <label className="text-sm text-gray-500">
                New Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C2A68C]"
                />
                <span
                  onClick={() => toggleVisibility("new")}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showPassword.new ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="bg-[#F5F1ED] p-3 rounded-lg shadow-sm">
              <label className="text-sm text-gray-500">
                Confirm New Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C2A68C]"
                />
                <span
                  onClick={() => toggleVisibility("confirm")}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                >
                  {showPassword.confirm ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="bg-[#957C62] text-white px-6 py-2 rounded-lg hover:bg-[#7d6651] transition duration-300 shadow-md"
              >
                Update Password
              </button>
            </div>

          </form>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PasswordChange;
