Spring 2025 SEWEB Project
Team: Abhilash, LinXia, Yasin, Yuning



How to run:


1. Install dependencies
```
# install backend dependencies
npm install


# install frontend dependencies
cd frontend
npm install
```

2. Start MySQL
```
Start MySQL with the following configuration

Host: localhost
Port: 3306
User: root
Password: root
```



3. Create the database tables
```
Run all the SQL queries in the file 'confiq/db_queries.sql'

Make sure that all the tables have been created.
```


2. Start the backend server
```
node app.js
```


3. Start the frontend server
```
cd frontend
npm run dev
```


4. Open the frontend url in your browser
```
The output from step 3 will give the URL of the frontend.
By default it is http://localhost:5173/

Open this url in your browser.
```