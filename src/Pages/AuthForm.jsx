import React, { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL", BASE_URL);

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email Address is required" }).email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
});

const registerSchema = z
    .object({
        name: z.string().min(1, { message: "Full name is required" }),
        email: z.string().min(1, { message: "Email Address is required" }).email({ message: "Invalid email format" }),
        password: z.string().min(1, { message: "Password is required" }).min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z.string().min(1, { message: "Confirm Password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [apiResponse, setApiResponse] = useState(null);
    
    const onSwitch = () => {
        setIsLogin(!isLogin);
    }
    
    const initialFormData = isLogin
    ? { email: "", password: "" }
    : { name: "", email: "", password: "", confirmPassword: "" };
    const [formData, setFormData] = useState(initialFormData);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateForm();
    };

    const validateForm = () => {
        const schema = isLogin ? loginSchema : registerSchema;
        const result = schema.safeParse(formData);
        if (result.success) {
            setErrors({});
            return true;
        } else {
            const newErrors = result.error.issues.reduce((acc, issue) => {
                acc[issue.path[0]] = issue.message;
                return acc;
            }, {});
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const endpoint = isLogin ? "/api/user/login" : "/api/user/register";
                const response = await fetch(`${BASE_URL}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                    credentials: "include",
                });

                const result = await response.json();

                if (response.status === 401 || response.status === 400) {
                    setApiResponse({ error: result.message });
                } else {
                    setApiResponse(result);
                    navigate("/dashboard");
                }
            } catch (error) {
                setApiResponse({ error: "Something went wrong" });
            }
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/cryptoBG.jpg')" }}
        >
            <div className="w-full max-w-sm mx-auto mt-10 p-6 bg-gray-200 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-6 text-center">Welcome to Dashboard</h2>

                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <label className="text-sm font-medium">Full Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder="Full name"
                                onChange={handleChange}
                                className="p-2 border border-gray-300 rounded-md"
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </>
                    )}

                    <label className="text-sm font-medium">Email Address*</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Email Address"
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                    <label className="text-sm font-medium">Password*</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

                    {!isLogin && (
                        <>
                            <label className="text-sm font-medium">Confirm Password*</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                className="p-2 border border-gray-300 rounded-md"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                        </>
                    )}

                    {isLogin && (
                        <div className="text-xs text-gray-500 cursor-pointer hover:underline">
                            Forgot password?
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-3 bg-purple-900 text-white py-2 px-4 rounded-full hover:bg-purple-800"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    {isLogin ? (
                        <>
                            Don't have an account?{" "}
                            <span className="text-purple-800 font-medium cursor-pointer" onClick={onSwitch}>
                                Register
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span className="text-purple-800 font-medium cursor-pointer" onClick={onSwitch}>
                                Login
                            </span>
                        </>
                    )}
                </p>

                {apiResponse && (
                    <p className="mt-4 text-center text-sm text-red-500">
                        {apiResponse.error || "Success"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
