import { useState, useEffect } from 'react'
import { NavLink } from "react-router-dom";
import AutoPopup from "./AutoPopup";

export default function RecentTransactions({balance}) {

  const [transactions, settransactions] = useState([]);
  const [userName, setuserName] = useState("");
  const [popup, setPopup] = useState({ type: null, message: "" });

  useEffect(() => {
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
        setuserName(data.username);
      } catch (e) {
        setPopup({ type: "error", message: "You are blocked for 15 seconds🥳" });
      }
    }
    call();
  }, [balance])


  return (
    <>
      <div className="bg-white rounded-xl shadow p-5 h-full">
        <h2 className="text-lg font-bold mb-4">Recent Transactions</h2>


        <div className="space-y-4">
          {transactions?.map((tx, ind) => (
            ind < 8 && <div
              key={ind}
              className="flex items-center justify-between"
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold
                ${tx.money > 0 ? "bg-green-500" : "bg-red-500"}`}
                >
                  {tx.to[0]}
                </div>

                <div>
                  <p className="font-medium">{tx.from}</p>
                  <p className="text-xs text-gray-500">{tx.createdAt}</p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p
                  className={`font-semibold ${tx.from != userName ? "text-green-600" : "text-red-600"
                    }`}
                >
                  ₹ {Math.abs(tx.money)}
                </p>
                {/* <p className="text-xs text-gray-500">{tx.}</p> */}
              </div>
            </div>
          ))}
        </div>

        <NavLink to='/transactions'>
          <span className="text-black cursor-pointer ">see all</span>
        </NavLink>
      </div>
      <AutoPopup
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ type: null, message: "" })}
      />
    </>
  );
}
