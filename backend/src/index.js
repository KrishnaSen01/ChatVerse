import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";
import {connectToDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();

connectToDB(process.env.MONGODB_URL);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/",(req,res)=>{
    res.send("home page");
});


const PORT = process.env.PORT || 5001;
console.log(PORT);

app.listen(PORT,()=>{
    console.log(`the server is running on the PORT ${PORT}`);
}); 