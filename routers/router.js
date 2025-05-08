const express=require('express');
const {registerUser, loginUser,getProfile, getFinancialProfile, createFinancialProfile}=require('../controllers/userController');
const verifyToken=require('../middleware/middle');
const {chatWithAI,aiStockAnalyze, aiAdvice}=require('../controllers/chatControllers')
const{getStockInfo, getTrades, postTrade, getStockHistory,addToWatchlist, getWatchlist}=require('../controllers/marketControllers')


const router=express.Router();
// Creating User Router
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/portfolio', verifyToken, getProfile);
router.post('/chat', verifyToken, chatWithAI);
router.get('/market/stock/:symbol', verifyToken,getStockInfo);
router.get('/market/trade',verifyToken,getTrades);
router.post('/market/trade', verifyToken, postTrade);
router.get('/market/stock/:symbol/history',verifyToken, getStockHistory);
router.post('/market/watchlist', verifyToken, addToWatchlist);
router.get('/market/watchlist', verifyToken, getWatchlist);
router.get('/financialProfile',verifyToken,getFinancialProfile);
router.post('/financialProfile',verifyToken,createFinancialProfile);
router.post('/aiAnalysis',verifyToken,aiStockAnalyze);
router.post('/aiAdvice',verifyToken, aiAdvice);

module.exports=router;