// importing npm modules/libraries
import express from "express";
import dotenv from "dotenv";

// ROUTES
import userRoutes from './routes/user.routes.js';
import codeRoutes from './routes/code.routes.js';

// importing mongoose connection function to connect to database
import connectDb from "./config_db.js";

const PORT = process.env.PORT; // port for listening requests through express
const app = express();

dotenv.config(); // to access environment variables
app.use(express.json()); // to access input in json format

// userRoutes url localhost:PORT/api/user/
app.use('/api/user',userRoutes);

// userRoutes url localhost:PORT/api/user/
app.use('/api/code',codeRoutes);

// listen at PORT
app.listen(PORT, () => {
    // connect to the database
    connectDb();
    // log the start of server
    console.log(`server listening at port ${PORT}`);
});