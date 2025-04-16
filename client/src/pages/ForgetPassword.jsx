import React, { useState } from "react";
import Input from "../components/input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router";
import { useForgetPasswordMutation } from "../features/auth/authApi";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgetPassword, { isLoading, error }] = useForgetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await forgetPassword({ email });

      if (!res.data.error) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
          Forget Password
        </h2>

        {!isSubmitted ? (
          <>
            <form onSubmit={submitHandler}>
              <p className="text-gray-300 mb-6 text-center">
                Enter your Email Address and we'll send you a link to reset your
                password.{" "}
              </p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-fuchsia-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              >
                {isLoading ? (
                  <Loader className="size-6 animate-spin mx-auto" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-300 mb-6">
                If an account exists for {email}, you will receive a password
                reset link shortly.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="px-8 py-4 bg-slate-900 bg-opacity-50 flex justify-center">
        <Link
          to={"/login"}
          className="text-sm text-indigo-400 hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
