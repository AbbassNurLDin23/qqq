import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser, registerUser } from "../utils/fetcher";
import { decodeToken } from "../utils/auth";

const AuthForm = ({ formType }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("APP_USER"); // Only needed for signup
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let response;
      if (formType === "login") {
        response = await loginUser(username, password);
        localStorage.setItem("token", response.token);

        // Decode token to check role
        const decodedToken = decodeToken(response.token);
        if (decodedToken?.role === "ADMIN") {
          router.push("/admin/home"); // or "/home" for admin
        } else {
          router.push("/user/home"); // or whatever your user page is
        }
      } else if (formType === "signup") {
        response = await registerUser(username, password, role);
        setMessage("User registered successfully");
        router.push("/login");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {formType === "login" ? "Welcome Back!" : "Create an Account"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        {formType === "signup" && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="APP_USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        )}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {formType === "login" ? "Sign In" : "Sign Up"}
        </button>
      </form>

      {formType === "login" ? (
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-500 font-medium hover:underline"
          >
            Sign up here
          </button>
        </p>
      ) : (
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 font-medium hover:underline"
          >
            Login here
          </button>
        </p>
      )}

      {message && (
        <p className="mt-4 text-center text-red-500 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default AuthForm;
