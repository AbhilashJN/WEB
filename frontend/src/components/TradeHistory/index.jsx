const TradeHistory = ({ tradeHistoryItems }) => {
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Trade History</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-gray-700">Date</th>
            <th className="py-2 text-gray-700">Stock</th>
            <th className="py-2 text-gray-700">Action</th>
            <th className="py-2 text-gray-700">Price</th>
            <th className="py-2 text-gray-700">Quantity</th>
          </tr>
        </thead>
        <tbody id="trades-list-body">
          {
            tradeHistoryItems.map((historyItem,idx) => {
              const { trade_date, symbol, action, price, quantity } = historyItem;
              const date = new Date(trade_date);
              const year = date.getFullYear().toString().padStart(4, '0')
              const month = (date.getMonth() + 1).toString().padStart(2, '0')
              const day = date.getDate().toString().padStart(2, '0')
              const formattedDate = `${month}/${day}/${year}`
              const actionColor = action === "buy" ? "green" : "red";
              const actionClass = `py-2 text-${actionColor}-500`;

              return (
                <tr className="border-b" key={idx}>
                  <td className="py-2 text-gray-600">{formattedDate}</td>
                  <td className="py-2 text-gray-600">{symbol}</td>
                  <td className={actionClass}>{action}</td>
                  <td className="py-2 text-gray-600">${price}</td>
                  <td className="py-2 text-gray-600">{quantity}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default TradeHistory