// components/Transactions.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import AutoPopup from "./AutoPopup";

export default function Transactions({ isSignin }) {
  const [transactions, settransactions] = useState([]);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({ type: null, message: "" });
  const [username , setusername] = useState("");

  useEffect(() => {
    if (!isSignin) {
      navigate('/signin');
    }
    async function call() {
      try {
        const res = await fetch('http://localhost:3001/user/tranc/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Authorization')
          },
        })
        const data = await res.json();
        settransactions(data.data);
        // setuserName(data.userName);
        setusername(data.username)
      } catch (e) {
        setPopup({ type: "error", message: "You are blocked for 15 seconds🥳" });
      }
    }
    call();
  }, [])

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-2">From</th>
                <th className="text-left py-2">To</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-2">{tx.from}</td>
                  <td className="py-2">{tx.to}</td>
                  <td
                    className={`py-2 font-semibold ${(tx.from != username) ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    ₹ {tx.money}
                  </td>
                  <td className="py-2 text-gray-500">{tx.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
