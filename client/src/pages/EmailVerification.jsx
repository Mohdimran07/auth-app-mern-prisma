import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useVerifyEmailMutation } from "../features/auth/authApi";

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const [verify, { error, isLoading }] = useVerifyEmailMutation();

  const handleChange = (idx, value) => {
    const newCode = [...code];

    // If user paste pin
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      // Focus on the last non-empty digit or first empty one
      const lastFilledIdx = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIdx < 5 ? lastFilledIdx + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[idx] = value;
      setCode(newCode);

      if (value && idx < 5) {
        inputRefs.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const pin = code.join("");

    try {
      const res = await verify({ pin });
      console.log(res);
      if (res.data.error) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-700 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden ">
      <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-500 text-transparent bg-clip-text rounded-2xl shadow-2xl p-8 w-full max-w-md">
          Verify Your Email
        </h2>
        <p className="text-center text-purple-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form className="space-y-6" onSubmit={submitHandler}>
          <div className="flex justify-between">
            {console.log(code)}
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-fuchsia-700 text-white border-2 border-purple-600 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full px-8 py-4 bg-purple-900 bg-opacity-70  flex justify-center text-purple-300 font-bold  rounded-lg shadow-lg"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
