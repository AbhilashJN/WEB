import { useRef, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";
import { serverUrl, stockSymbolApi, tradeApi, watchlistApi } from "../../constants";

const TradePage = () => {
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [symbolDisplay, setSymbolDisplay] = useState('');
    const [priceDisplay, setPriceDisplay] = useState('');
    const [changeDisplay, setChangeDisplay] = useState('');
    const [changeDisplayClass, setChangeDisplayClass] = useState('');
    const [showStockDetails, setShowStockDetails] = useState(true);

    const stockChart = useRef(null);

    const onSearchInput = (e) => {
        setSymbol(e.target.value);
    }

    const onQuantityInput = (e) => {
        setQuantity(e.target.value);
    }



    const onSearchSubmit = async () => {
        const symbolUpper = symbol.trim().toUpperCase();
        if (symbolUpper) {
            try {
                const url = serverUrl + stockSymbolApi + `/${symbolUpper}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    setSymbolDisplay(symbolUpper);
                    setPriceDisplay(`$${data.price}`);
                    setChangeDisplay(`${data.change}%`);
                    setChangeDisplayClass(data.change >= 0 ? 'text-green-500' : 'text-red-500');
                    setShowStockDetails(true);
                    // Draw Chart
                    await drawChart(symbolUpper);
                } else {
                    alert(data.message || 'Stock not found');
                }
            } catch (error) {
                console.error('Error fetching stock:', error);
                alert('Something went wrong');
            }
        }
    }

    async function drawChart(symbol) {
        try {
            const url = serverUrl + stockSymbolApi + `/${symbol}/history`;
            const response = await fetch(url,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const historyData = await response.json();

            const labels = historyData.map(point => point.date);
            const prices = historyData.map(point => point.close);

            let chartCanvas = document.getElementById('stock-chart');

            if (stockChart.current) {
                stockChart.current.destroy();
            }

            stockChart.current = new Chart(chartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${symbol} Price`,
                        data: prices,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { display: true },
                        y: { display: true }
                    }
                }
            });
        } catch (err) {
            console.error('Chart fetch error:', err);
        }
    }


    async function handleTrade(action) {
        if (!quantity || quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        try {
            const url = serverUrl + tradeApi;
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ symbol: symbolDisplay, action, quantity: parseInt(quantity) })
            });


            const data = await response.json();
            if (response.ok) {
                alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
            } else {
                alert(data.message || 'Trade failed');
            }
        } catch (error) {
            console.error('Error during trade:', error);
            alert('Something went wrong');
        }
    }

    async function handleWatchlist() {
        const price = priceDisplay.replace('$', '');
        const change = changeDisplay;

        try {
            const url = serverUrl + watchlistApi;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ symbol: symbolDisplay, price, change })
            });

            const data = await response.json();
            if (response.ok) {
                alert(`${symbolDisplay} added to watchlist!`);
            } else {
                alert(data.message || 'Failed to add to watchlist');
            }
            console.log("Token:", localStorage.getItem('token'));

        } catch (error) {
            console.error('Watchlist error:', error);
            alert('Something went wrong');
        }
    }

    return (
        <>
            <NavBar isLoggedIn={true}/>
            <div className="max-w-6xl mx-auto py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Trade Stocks</h2>

                {/* Stock Search */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <form id="stock-search-form" className="flex space-x-4">
                        <input
                            id="stock-symbol" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Enter stock symbol (e.g., AAPL)"
                            onChange={onSearchInput}
                            value={symbol}
                        />
                        <button
                            type="button" className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600"
                            onClick={onSearchSubmit}
                        >
                            Search
                        </button>
                    </form>
                </div>
                {/* Chart Canvas */}
                <div className="mt-6" >
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Chart</h4>
                    <canvas id="stock-chart" width="400" height="200"></canvas>
                </div>
                {/* Stock Details */}
                {
                    !showStockDetails
                        ? <></>
                        : (
                            <div id="stock-details" className="bg-white p-6 rounded-lg shadow-md mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4"><strong><span id="stock-symbol-display"></span> Information</strong> </h3>
                                <p><strong>Symbol:</strong> <span id="stock-symbol-display">{symbolDisplay}</span></p>
                                <p><strong>Price:</strong> <span id="stock-price">{priceDisplay}</span></p>
                                <p><strong>Change:</strong> <span id="stock-change" className={changeDisplayClass}>{changeDisplay}</span></p>

                                <form id="trade-form" className="mt-4">
                                    <label htmlFor="quantity" className="block text-gray-700 text-sm font-semibold mb-2">Quantity</label>
                                    <input
                                        id="quantity" className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" type="number" min="1" placeholder="1" required
                                        value={quantity}
                                        onChange={onQuantityInput}
                                    />
                                    <div className="flex space-x-4">
                                        <button
                                            type="button" id="buy-btn" className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
                                            onClick={() => { handleTrade("buy") }}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            type="button" id="sell-btn" className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600"
                                            onClick={() => { handleTrade("sell") }}
                                        >
                                            Sell
                                        </button>
                                        <button
                                            type="button" id="watchlist-btn" className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600"
                                            onClick={handleWatchlist}
                                        >
                                            Add to Watchlist
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )
                }
            </div>

            <Footer />
        </>
    );
}

export default TradePage;