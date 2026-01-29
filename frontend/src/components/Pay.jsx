import { useState, useEffect } from "react";
import AutoPopup from "./AutoPopup";
import { useNavigate } from "react-router-dom";

// const users = [
//   { id: 1, name: "Rahul Sharma", upi: "rahul@upi" },
//   { id: 2, name: "Priya Patel", upi: "priya@upi" },
//   { id: 3, name: "Amit Verma", upi: "amit@upi" },
// ];


export default function Pay({balance,setbalance}) {
  const [amount, setAmount] = useState("");
  const [to, setto] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ type: null, message: "" });
  const [users, setusers] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    async function call() {
      try {
        const res = await fetch('http://localhost:3001/user/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Authorization')
          },
        })
        const data = await res.json();
        setusers(data);
      } catch (e) {
        setPopup({ type: "error", message: "You are blocked for 15 seconds🥳" });
      }
    }
    call();
  }, [amount])


  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/user/tranc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('Authorization'),
        },
        body: JSON.stringify({
          to: selectedUser,
          money: parseInt(amount)
        })
      })
      const data = await res.json();

      if (data.success) {
        
        setbalance((val)=>val-amount);
        setPopup({ type: "success", message: data.message });
        
      } else {
        setPopup({ type: "error", message: data.message });
      }

      setLoading(false);
      setAmount("");
      setSelectedUser(null);
    } catch (e) {
      setPopup({ type: "error", message: e });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Pay Someone</h2>

        {/* Amount */}
        <input
          type="number"
          placeholder="₹ Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />

        {/* Selected User */}
        {selectedUser && (
          <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-500">{selectedUser}</p>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={!amount || !selectedUser || loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition
          ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {loading ? "Processing..." : `Pay ₹${amount || 0}`}
        </button>

        {/* User List */}
        <div className="mt-6 space-y-3">
          {users?.map((user, ind) => (
            <div
              key={ind}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border rounded-lg cursor-pointer
              ${selectedUser === user
                  ? "border-indigo-600 bg-indigo-50"
                  : "hover:bg-gray-50"
                }`}
            >
              {/* <p className="font-medium">{user.username}</p> */}
              <p className="text-sm text-gray-500">{user}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}

      <AutoPopup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: "" })}
      />
    </>
  );
}
