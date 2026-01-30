import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AutoPopup from "./AutoPopup";

// components/Signin.jsx
export default function Signin({ setisSignin }) {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [popup, setPopup] = useState({ type: null, message: "" });
  const navigate = useNavigate();

  async function SigninHandler() {
    setloading(true);

    try {
      const res = await fetch('api/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      })
      setloading(false);

      const data = await res.json();
      if (data?.success) {
        setPopup({ type: "success", message: data.message });
        localStorage.setItem('Authorization', data.token);
        setisSignin(true);
        navigate('/');
      } else {
        setPopup({ type: "error", message: data.message });
      }
    } catch (e) {
      setPopup({ type: "error", message: "You are blocked for 15 seconds🥳" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {
          (loading) ? 
              <h5>Loading...</h5> 
            : 
          <button onClick={SigninHandler} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Sign In
          </button>
        }

        <p className="text-sm text-center mt-4 text-gray-600">
          <NavLink to='/signup'>
            go to signup? <span className="text-indigo-600 cursor-pointer">Sign up</span>
          </NavLink>
        </p>


      </div>
      <AutoPopup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: "" })}
      />

    </div>
  );
}
