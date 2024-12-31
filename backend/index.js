import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from './db.js'
import userRoutes from './routes/resgister-login.js'
import dataRoutes from './routes/dataRoute.js'
dotenv.config();

const PORT = process.env.PORT||8080;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hello");
})
app.listen(PORT,(req,res)=>{
    console.log(`Server listening on port ${PORT} `);
})

connectdb();

app.use('/api',userRoutes);
app.use('/api',dataRoutes);