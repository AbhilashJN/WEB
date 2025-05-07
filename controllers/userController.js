const bcrypt=require('bcrypt');
const pool=require('../confiq/db');
const jwt=require('jsonwebtoken');
const SECRET_KEY = 'fornow';


// registeration page controller

const registerUser=async(req,res)=>{
    const {username, email, password, investment_experience_level,
        investment_goal, risk_tolerance, annual_income, cash_holding, debt
    }= req.body;

    // validate the input, username, email, password
    if(!username || !email || !password){
        return res.status(400).send('All Fields are required.');
    }

    // Creating and hashing the password
    try{
        const hashedPassword=await bcrypt.hash(password, 10);
        // Inserting user into the database;
        const user_sql='INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
        const financial_sql='INSERT INTO user_financial_profile(user_id,investment_experience_level,risk_tolerance,investment_goal,annual_income,cash_holding,debt) VALUES(?,?,?,?,?,?,?);'
        
        try{
            const[result]=await pool.query(user_sql,[username, email, hashedPassword]);
            const [lastRow]= await pool.query('SELECT * FROM user WHERE id= LAST_INSERT_ID()');
            console.log("lastRow",lastRow);
            const user_id = lastRow[0].id;
            const args = [user_id, investment_experience_level,risk_tolerance, investment_goal, annual_income, cash_holding, debt];
            const [result2]=await pool.query(financial_sql,args);
            res.status(200).send('User Created Successfully.');
        }
        catch (err){
            // check for duplicate entry error
            if(err.code==='ER_DUP_ENTRY'){
                return res.status(409).send('User Already Exist.');
            }
            console.error('Databse Error:', err);
            return res.status(500).send('Database Error.');
        }
    }catch (err){
        console.error('Error processing requrest:', err);
        res.status(500).send('Interal Server Error');
    }
};
const loginUser = async (req, res) => {
    console.log('in login');
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send('All fields required.');

    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).send('Invalid credentials.');

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Invalid credentials.');

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        console.log({ message: 'Login successful', token });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log('Login Error:', err);
        res.status(500).send('Server Error.');
    }
};
const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await pool.query('SELECT username, email FROM user WHERE id = ?', [userId]);
        if (rows.length === 0) return res.status(404).send('User not found.');
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Profile Error:', err);
        res.status(500).send('Database Error');
    }
};


const createFinancialProfile = async (req, res) =>{
    const userID = req.user.id;
    const { 
        investment_experience_level,
        risk_tolerance,
        investment_goal,
        annual_income ,
        cash_holding ,
        debt
    } = req.body;

    try{
        const [rows] = await pool.query('SELECT id FROM user_financial_profile WHERE user_id = ?', [userID]);
        if (rows.length===0){
            const queryString = 'INSERT INTO user_financial_profile(user_id,investment_experience_level,risk_tolerance,investment_goal,annual_income,cash_holding,debt) VALUES(?,?,?,?,?,?,?)'
            const args = [userID, investment_experience_level,risk_tolerance, investment_goal, annual_income, cash_holding, debt];
            const [result] = await pool.query(queryString,args);
        }else{
            const queryString = `UPDATE user_financial_profile SET 
                                    investment_experience_level = ?,
                                    risk_tolerance = ?,
                                    investment_goal = ?,
                                    annual_income = ?,
                                    cash_holding = ?,
                                    debt = ?
                                WHERE user_id = ?
                                    `
            const args = [investment_experience_level,risk_tolerance, investment_goal, annual_income, cash_holding, debt, userID];
            const [result] = await pool.query(queryString,args);
        }

        res.status(200).json(req.body);
    }catch(error){
        console.error('Create Profile Error:', error);
        res.status(500).send('Database Error');
    }
}

const getFinancialProfile = async (req, res)=>{
    const userID = req.user.id;
    const queryString = 'SELECT user_id,investment_experience_level,risk_tolerance,investment_goal,annual_income,cash_holding,debt from user_financial_profile where user_id = ?';
    const args = [userID];
    try {
        const [rows] = await pool.query(queryString, args);
        if (rows.length === 0) {
            console.log("404");
            return res.status(404).send('User not found.');
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.error('Profile Error:', err);
        res.status(500).send('Database Error');
    }
}

module.exports={registerUser, loginUser, getProfile, createFinancialProfile, getFinancialProfile};