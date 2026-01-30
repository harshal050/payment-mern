import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AutoPopup from "./AutoPopup";
const {BASE_PATH} = require('../lib/lib')

// components/Signup.jsx
export default function Signup() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [popup, setPopup] = useState({ type: null, message: "" });
  const navigate = useNavigate();

  async function SignupHandler() {
    try {
      setloading(true);
      const res = await fetch(`${BASE_PATH}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json();
      setloading(false);

      if (data.success) {
        // const response = { message: "signup successfully 🎉" };
        setPopup({ type: "success", message: data.message });
        navigate('/signin');

      } else {
        // const error = { error: data.message };
        setPopup({ type: "error", message: data.message });
      }
    } catch (e) {
      setPopup({ type: "error", message: "You are blocked for 15 seconds🥳" });
    }
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setusername(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setpassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {(loading) ? <h5>Loading...</h5> : <button onClick={SignupHandler} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Sign Up
          </button>}

          <p className="text-sm text-center mt-4 text-gray-600">
            <NavLink to='/signin'>
              Already have an account? <span className="text-indigo-600 cursor-pointer">Sign in</span>
            </NavLink>
          </p>
        </div>

      </div>

      <AutoPopup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: "" })}
      />
    </>

  );
}
