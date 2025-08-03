// components/Chart.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import PriceHistoryChart from "./PriceHistoryChart";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Chart({ coins }) {
    // console.log("coins", coins);
    const [selectedCoin, setSelectedCoin] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!selectedCoin) return;
        console.log(selectedCoin);
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/history/${selectedCoin}`);
                setHistory(res.data);
            } catch (err) {
                console.error("Error fetching history:", err);
            }
        };

        fetchHistory();
    }, [selectedCoin]);

    return (
        <div className="w-full bg-white shadow rounded p-4">
            <label className="block mb-2 text-gray-700 font-medium">Select a Coin:</label>
            <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
            >
                <option value="">-- Choose a coin --</option>
                {coins.map((coin) => (
                    <option key={coin.id} value={coin.symbol}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                ))}
            </select>

            <div className="mt-6">
                {selectedCoin === "" ? (
                    <p className="text-gray-500 text-sm">Please select a coin to view chart.</p>
                ) : history.length === 0 ? (
                    <p className="text-gray-500 text-sm">No historical data found.</p>
                ) : (
                    <div className="bg-gray-100 p-4 rounded text-sm mb-10">
                        <PriceHistoryChart data={history} />
                    </div>
                )}
            </div>
        </div>
    );
}
