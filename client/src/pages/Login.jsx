import React, { useEffect, useState } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Input from "../components/input";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { AddUser } from "../features/auth/authSlice";
import { showToast } from "../components/toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(email, password);
    if (!email || !password) {
      showToast("Please fill all the fields", "info");
      return;
    }
    setError("");
    try {
      const res = await login({ email, password }).unwrap();
      console.log("res of login:", res);
      showToast(res.message, "success");
      dispatch(AddUser({ ...res }));
      navigate("/");
    } catch (err) {
      console.log(err);
      showToast(err.data.message, "error");
    }
  };
  return (
    <div className="max-w-md w-full bg-slate-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={submitHandler}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
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
          <div className=" flex items-center mb-6">
            <Link
              to="/forget-password"
              className="text-sm text-indigo-400 hover:underline"
            >
              Forget password?
            </Link>
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-white font-bold rounded-lg shadow-lg hover: from-indigo-600 to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-fuchsia-900 transition duration-200"
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <div className="px-8 py-4 bg-purple-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-fuchsia-400">
          Don't have an account ?{" "}
          <Link to={"/signup"} className="text-indigo-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
