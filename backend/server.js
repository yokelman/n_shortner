// importing npm modules/libraries
import express from "express";
import dotenv from "dotenv";

// to server static file we need __dirname thats not in es module so we have to manually define it
import path from 'path'
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ROUTES
import userRoutes from './routes/user.routes.js';
import codeRoutes from './routes/code.routes.js';
import mainRoutes from './routes/main.routes.js';

// importing mongoose connection function to connect to database
import connectDb from "./config_db.js";

// port for listening requests through express
const PORT = process.env.PORT; 

const app = express();

// to access environment variables
dotenv.config(); 

// to access input in json format
app.use(express.json()); 

// userRoutes url localhost:PORT/api/user/
app.use('/api/user',userRoutes);

// userRoutes url localhost:PORT/api/user/
app.use('/api/code',codeRoutes);

// main routes
app.use('/',mainRoutes);

// serving static files
app.use('/static',express.static(path.join(__dirname, '../static')));

// listen at PORT
app.listen(PORT, () => {
    // connect to the database
    connectDb();
    // log the start of server
    console.log(`server listening at port ${PORT}`);
});