const express=require('express');
const path=require('path');
const router=require('./routers/router');
const cors = require('cors');

const app=express();
app.use(cors());


// routing
app.use(express.json());
app.use('/api', router);



const PORT=3000;
app.listen(PORT, ()=>{
    console.log(`server is running in : localhost${PORT}`);
})