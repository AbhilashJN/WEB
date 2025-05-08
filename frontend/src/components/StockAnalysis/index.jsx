import { useState } from "react";
import { serverUrl, aiAnalysisApi } from "../../constants";

const StockAnalysis = () => {
    const [symbolInput, setSymbolInput] = useState('');
    const [technicalInfo, setTechnicalInfo] = useState({});
    const [aiResponse, setAiResponse] = useState('');
    const token = localStorage.getItem('token');

    const onSymbolInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setSymbolInput(value);
    }

    const onSubmit = async () => {
        setTechnicalInfo({});
        setAiResponse("AI is analyzing...");
        try {
            const url = serverUrl + aiAnalysisApi;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ symbol: symbolInput })
            });
            if (response.status === 401) {
                const aiResponse = { role: 'ai', msg: 'Token expired, redirecting to login page' };
                setChatLog(prevLog => [...prevLog, aiResponse]);
                setTimeout(() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }, 1500);
            }
            const data = await response.json();
            setTechnicalInfo(data.stockInfo);
            setAiResponse(data.reply);
        } catch (err) {
            console.error('AI Error:', err);
            setAiResponse('Something went wrong.');
        }
    }


    return (
        <div className="bg-white overflow-y-auto p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Analyze Stock with AI</h3>
            <input
                className="w-full px-3 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter stock symbol (e.g. AAPL)"
                value={symbolInput}
                onChange={onSymbolInputChange}
            />
            <button
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600" type="button"
                onClick={onSubmit}
            >Analyze</button>
            {technicalInfo.price ?
                (<>
                    <h4 className="text-lg font-semibold text-gray-800">Technical Info:</h4>
                    <p className="italic text-sm text-gray-500">(sourced from Yahoo Finance)</p>
                    <strong className="text-sm">Current Price: </strong> {technicalInfo.price} <br />
                    <strong className="text-sm">Forward P/E: </strong> {technicalInfo.forwardPE} <br />
                    <strong className="text-sm">Trailing P/E: </strong> {technicalInfo.trailingPE} <br />
                    <strong className="text-sm">Analyst Target Price: </strong> {technicalInfo.analystRecommendationTarget} <br />
                    <strong className="text-sm">Analyst Rating: </strong> {technicalInfo.analystRecommendationRating} <br />
                    <strong className="text-sm">Short term outlook: </strong> {technicalInfo.shortTermOutlook} <br />
                    <strong className="text-sm">Medium term outlook: </strong> {technicalInfo.intermediateTermOutlook} <br />
                    <strong className="text-sm">Long term outlook: </strong> {technicalInfo.longTermOutlook} <br />
                </>)
                : <></>
            }
            {
                aiResponse.length > 0?
                <>
                    <h4 className="text-lg mt-2 font-semibold text-gray-800">AI Analysis:</h4>
                    {aiResponse}
                </>
                :<></>
            }
        </div>
    )

}


export default StockAnalysis;