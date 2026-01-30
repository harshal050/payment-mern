
// components/Dashboard.jsx
import { useState, useEffect } from 'react';
import Pay from "./Pay";
import RecentTransactions from "./RecentTransactions";
import { useNavigate } from 'react-router-dom';
import AutoPopup from "./AutoPopup";

export default function Dashboard({ isSignin, setisSignin }) {
    const [name, setName] = useState();
    const [balance, setbalance] = useState();
    const [popup, setPopup] = useState({ type: null, message: "" });
    const navigate = useNavigate();


    useEffect(() => {
        if (!isSignin) {
            navigate('/signin');
        }
        
        async function call() {
            try {
                const res = await fetch('api/user/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('Authorization')
                    },
                })
                const data = await res.json();
                setName(data.username);
                setbalance(data.balance);
            } catch (e) {
                setPopup({ type: "error", message: "You are blocked for 15 seconds🥳" });
            }
        }
        call();
    }, [])


    function logout() {
        localStorage.setItem('Authorization', '')
        setisSignin(false);
        navigate('/signin');
    }

    return (
        <>
            {(isSignin) &&
                <div className="min-h-screen bg-gray-100 p-6">
                    {/* Header */}
                    <button onClick={logout} className={"text-xl font-bold bg-blue-200 p-2 m-2 rounded-lg"}>Signout</button>
                    <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold">Hello, {name} 👋</h1>
                            <p className="text-gray-500">Welcome to your dashboard</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current Balance</p>
                            <p className="text-2xl font-bold text-green-600">₹ {balance}</p>
                        </div>
                    </div>

                    {/* Transactions */}
                    <div className="min-h-screen bg-gray-100 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Pay Box */}
                            <div className="lg:col-span-2">
                                <Pay balance={balance} setbalance={setbalance}/>
                            </div>

                            {/* Recent Transactions */}
                            <div className="lg:col-span-1">
                                <RecentTransactions balance={balance}/>
                            </div>
                        </div>
                    </div>
                </div>}
            <AutoPopup
                type={popup.type}
                message={popup.message}
                onClose={() => setPopup({ type: null, message: "" })}
            />
        </>
    );
}
