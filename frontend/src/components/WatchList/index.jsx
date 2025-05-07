const WatchList = ({ watchListItems }) => {

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Watchlist</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-gray-700">Stock</th>
            <th className="py-2 text-gray-700">Price</th>
            <th className="py-2 text-gray-700">Change</th>
          </tr>
        </thead>
        <tbody id="watchlist-body">
          {
            watchListItems.map((item,idx) => {
              return (
              <tr className="border-b" key={idx}>
                <td className="py-2 text-gray-600">{item.symbol}</td>
                <td className="py-2 text-gray-600">${parseFloat(item.price).toFixed(2)}</td>
                <td className={`py-2 ${item.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>${item.change}</td>
              </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}


export default WatchList;