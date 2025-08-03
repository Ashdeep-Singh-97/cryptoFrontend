import { useEffect, useState } from "react";
import axios from "axios";
import CryptoCard from "../components/CryptoCard";
import Chart from "../components/Chart";
import LogoutButton from "../buttons/LogoutButton";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Dashboard() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");

  const fetchCryptoData = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/api/coins`)
      .then(res => {
        setCryptoData(res.data);
        setLoading(false);
        return axios.post(`${BASE_URL}/api/history`, res.data);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCryptoData();

    const intervalId = setInterval(fetchCryptoData, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let data = [...cryptoData];

    if (search) {
      data = data.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price-asc":
        data.sort((a, b) => a.current_price - b.current_price);
        break;
      case "price-desc":
        data.sort((a, b) => b.current_price - a.current_price);
        break;
      case "name-asc":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        data.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "marketcap-desc":
        data.sort((a, b) => b.market_cap - a.market_cap);
        break;
      default:
        break;
    }

    setFilteredData(data);
  }, [search, sortOption, cryptoData]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/cryptoBG.jpg')" }}
    >
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Top Cryptos</h1>

        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/3"
          >
            <option value="name-asc">Sort by Name (A-Z)</option>
            <option value="name-desc">Sort by Name (Z-A)</option>
            <option value="price-asc">Sort by Price (Low → High)</option>
            <option value="price-desc">Sort by Price (High → Low)</option>
            <option value="marketcap-desc">Sort by Market Cap (High → Low)</option>
          </select>

          <LogoutButton />
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.length > 0 ? (
            filteredData.map((crypto) => (
              <div key={crypto.id} className="crypto-card">
                <CryptoCard coin={crypto} />
              </div>
            ))
          ) : (
            <div className="text-center col-span-full text-gray-500">
              No matching cryptos found.
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Market Trends</h2>
          <Chart
            coins={cryptoData}
          />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
