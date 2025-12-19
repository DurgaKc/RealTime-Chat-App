import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { TextField, Button, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // ✅ API function (FIXED)
  const signupUser = async (data) => {
    return axios.post(`${backendUrl}/api/auth/signup`, data);
  };

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (res) => {
      toast.success("Account Created Successfully ✅");
      console.log("Signup success:", res.data);
      navigate("/login"); // OR navigate("/") if you want home
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Signup failed ❌");
      console.error("Signup failed:", error);
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
        }}
      />

      {/* Blur + Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Signup Card */}
      <Paper
        elevation={0}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/90 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-4 !text-green-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="First Name"
              name="firstname"
              fullWidth
              size="small"
              value={formData.firstname}
              onChange={handleChange}
              required
            />

            <TextField
              label="Last Name"
              name="lastname"
              fullWidth
              size="small"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <TextField
            sx={{ marginBottom: "20px" }}
            label="Email"
            name="email"
            type="email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            sx={{ marginBottom: "20px" }}
            label="Password"
            name="password"
            type="password"
            fullWidth
            size="small"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={mutation.isPending}
            className="!bg-green-500 hover:!bg-green-600 !py-2 !rounded-lg"
          >
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-md mt-6 text-gray-800">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </Paper>
    </div>
  );
};

export default Signup;
