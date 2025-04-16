import React, { useState } from "react";
import { Loader, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import Input from "../components/input";
import { useResetPasswordMutation } from "../features/auth/authApi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  let message = false;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };


  const submitHandler = async (e) => {
    e.preventDefault();
    console.log({ password }, token);

    if (password !== confirmPassword) {
      alert("Password do not match!");
      return;
    }

    try {
      const res = await resetPassword({ password, token });
      console.log(res);
      if (!res.data.error) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={submitHandler}>
          {/* <Input
            icon={Lock}
            type={showPassword ? "password" : "text"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            icon={Lock}
            type={showConfirmPassword ? "password" : "text"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          /> */}

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="size-5 text-fuchsia-300" />
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 bg-slate-700 bg-opacity-50 rounded-lg border border-purple-600 focus:border-fuchsia-600 focus:ring-2 focus:ring-purple-500 text-white placeholder-fuchsia-400 transition duration-200"
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <EyeOff className="size-5 text-fuchsia-400 hover:text-indigo-300" />
              ) : (
                <Eye className="size-5 text-fuchsia-400 hover:text-indigo-300" />
              )}
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="size-5 text-fuchsia-300" />
            </div>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 bg-slate-700 bg-opacity-50 rounded-lg border border-purple-600 focus:border-fuchsia-600 focus:ring-2 focus:ring-purple-500 text-white placeholder-fuchsia-400 transition duration-200"
            />
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? (
                <EyeOff className="size-5  text-fuchsia-400 hover:text-indigo-300" />
              ) : (
                <Eye className="size-5  text-fuchsia-400 hover:text-indigo-300" />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-white font-bold rounded-lg shadow-lg hover: from-indigo-600 to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-fuchsia-900 transition duration-200"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Set New Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
