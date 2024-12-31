// import {User,Preference} from './model.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
dotenv.config();

const URL = process.env.MONGO_URI;

const connectdb = async()=>{
    try{
        await mongoose.connect(URL);
        console.log("Connected to Database")
    }catch(err){
        console.log("Error in connecting to db ", err);
    }
};
export default connectdb;
