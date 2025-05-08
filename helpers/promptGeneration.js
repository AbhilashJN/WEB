const { default: yahooFinance } = require("yahoo-finance2");
const pool=require('../confiq/db');


const generalQuery=(userMessage)=>{
    const prompt = "Answer this question in brief, in 5 sentences or less."
    const fullPrompt = `${prompt} ${userMessage}`;
    return fullPrompt;
}


const stockAnalyze=async (symbol)=>{
    const quote = await yahooFinance.quote(symbol);
    if (!quote || !quote.regularMarketPrice) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    const insights = await yahooFinance.insights(symbol);
    console.log(insights)
    const stockInfo = {
        price: quote.regularMarketPrice,
        forwardPE: quote.forwardPE,
        trailingPE: quote.trailingPE,
        analystRecommendationRating: insights.recommendation.rating,
        analystRecommendationTarget: insights.recommendation.targetPrice,
        shortTermOutlook: insights.instrumentInfo.technicalEvents.shortTermOutlook.stateDescription,
        intermediateTermOutlook: insights.instrumentInfo.technicalEvents.intermediateTermOutlook.stateDescription,
        longTermOutlook: insights.instrumentInfo.technicalEvents.longTermOutlook.stateDescription,
    }

    const initPrompt = "Based the information of the stock presented below, provide a recommendation on whether to buy or sell this stock. Limit your response to 20 sentences at most."
    let fullPrompt = initPrompt + "\n" + "Stock symbol: " + symbol +"\n";
    fullPrompt = fullPrompt + JSON.stringify(stockInfo);

    return {fullPrompt, stockInfo};
}



const portfolioAdvice = async(userMsg, userId)=>{
    const ufQuery = 'SELECT * from user_financial_profile where user_id = ?;';
    const args = [userId];

    const [rows] = await pool.query(ufQuery, args);
    const row = rows[0]
    const user_financial_info = {
        investment_experience_level: row.investment_experience_level,
        risk_tolerance: row.risk_tolerance,
        investment_goal: row.investment_goal,
        annual_income: `$${row.annual_income}`,
        cash_holding: `$${row.cash_holding}`,
        debt: `$${row.debt}`,
    }

    const tradesQuery = `
    SELECT 
           SUM(CASE WHEN action = 'buy' THEN quantity*price ELSE -(quantity*price) END) AS net_quantity 
         FROM trades 
         WHERE user_id = ?
    `
    const [totalRow] = await pool.query(tradesQuery,args);
    const totalStocksValue = totalRow[0].net_quantity || 0;
    user_financial_info.total_stocks_value = `$${totalStocksValue}`;
    console.log(user_financial_info);

    const SPYQuote = await yahooFinance.quote("^SPX");
    const VIXQuote = await yahooFinance.quote("^VIX");
    const DJIQuote = await yahooFinance.quote("^DJI");

    const SPYIdxValue = SPYQuote.regularMarketPrice;
    const VIXIdxValue = VIXQuote.regularMarketPrice;
    const DJIIdxValue = DJIQuote.regularMarketPrice;

    console.log(SPYIdxValue, VIXIdxValue,DJIIdxValue);

    const finDetailsPrompt = `
    Here is my current financial profile: 
    Annual Income is ${user_financial_info.annual_income}.
    I currently have ${user_financial_info.cash_holding} in cash.
    I also hold ${user_financial_info.total_stocks_value} in stocks.
    My investment experience level is ${user_financial_info.investment_experience_level}.
    My risk tolerance is ${user_financial_info.risk_tolerance}.
    My goal for investment is ${user_financial_info.investment_goal}.
    `

    const marketConditionsPrompt = `
    Here are some current market indicators:
    The S&P 500 Index is at ${SPYIdxValue}.
    The Dow Jones Industrial Average is at ${DJIIdxValue}.
    The Volatility Index VIX is at ${VIXIdxValue}.
    `

    const requestPrompt = 'Based on this information, provide a recommendation for the following query. Limit your response to no more than 10 sentences.\n';
    const fullPrompt = finDetailsPrompt + marketConditionsPrompt + requestPrompt + userMsg;
    return fullPrompt
}


module.exports = {
    generalQuery,
    stockAnalyze,
    portfolioAdvice
}