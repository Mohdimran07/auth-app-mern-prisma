import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loader, Lock, Mail, User } from "lucide-react";
import Input from "../components/input";
import { useRegisterMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { AddUser } from "../features/auth/authSlice";

// import { Input } from "../components/input";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(email, password, name);
    try {
      const response = await register({ email, password, username }).unwrap();
      console.log(response.data);
      dispatch(AddUser({ ...response.data }));
      navigate("/verify-email");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="max-w-md w-full bg-slate-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
  overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={submitHandler}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-400 text-white font-bold rounded-lg shadow-lg hover: from-indigo-600 to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-fuchsia-900 transition duration-200"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
      <div className="px-8 py-4 bg-purple-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-fuchsia-400">
          Don't have an account ?{" "}
          <Link to={"/login"} className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
