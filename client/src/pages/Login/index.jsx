import React, { useState } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { TextField, Button, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  //  Mutation for login
  const mutation = useMutation({
    mutationFn: async (formData) => {
      return axios.post(`${backendUrl}/login`, formData);
    },
    onSuccess: (res) => {
      console.log("Success", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Logged in Successfully");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(values);
    console.log("Form Submitted:", values);
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

      {/* Login Card */}
      <Paper
        elevation={0}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/90 shadow-2xl"
      >
        {/* Close Icon at Top Right */}
        <IoMdClose
          onClick={() => navigate("/")}
          size={28}
          style={{
            cursor: "pointer",
            position: "absolute",
            top: 16,
            right: 16,
            color: "#555",
          }}
        />
        <h2 className="text-3xl font-bold text-center mb-2 !text-green-800">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextField
            sx={{ marginBottom: "20px" }}
            label="Email"
            name="email"
            type="email"
            fullWidth
            size="small"
            value={values.email}
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
            value={values.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            className="!bg-green-500 hover:!bg-green-700 !py-2 !rounded-lg"
          >
            Login
          </Button>
        </form>

        <p className="text-center text-md mt-6 text-gray-800">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-700 font-semibold hover:underline"
          >
            Signup here
          </Link>
        </p>
      </Paper>
    </div>
  );
};

export default Login;
