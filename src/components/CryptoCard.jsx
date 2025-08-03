
const CryptoCard = ({ coin }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-80 m-4 transition hover:scale-105">
      <div className="flex items-center gap-4 mb-4">
        <img src={coin.image} alt={coin.name} className="w-10 h-10" />
        <h2 className="text-xl font-semibold">{coin.symbol}</h2>
      </div>
      <div className="text-sm space-y-1">
        <p><strong>Name:</strong> {coin.name.toLocaleString()}</p>
        <p><strong>Current Price:</strong> ${coin.current_price.toLocaleString()}</p>
        <p><strong>Market Cap:</strong> ${coin.market_cap.toLocaleString()}</p>
        <p><strong>24h Change:</strong> {coin.price_change_percentage_24h.toFixed(2)}%</p>
        <p><strong>Last Updated:</strong> {new Date(coin.last_updated).toLocaleString('ja-JP')}</p>
      </div>
    </div>
  );
};

export default CryptoCard;
