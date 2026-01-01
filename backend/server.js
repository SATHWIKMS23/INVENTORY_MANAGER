import http from 'http';
import app from './src/app.js'
import dotenv from 'dotenv';
dotenv.config();

import {connectDB} from './config/db.js'



const PORT = process.env.PORT ;

const server = http.createServer(app);

server.listen(PORT , () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
    connectDB();
})