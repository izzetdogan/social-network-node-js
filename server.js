import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const port = process.env.PORT || 8000;
require("dotenv").config();

const app = express();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
mongoose.connect(process.env.DATABASE, {

}).then(() => console.log("db connected"))
.catch((err) => console.log("Db connection error => ", err))


app.use(express.json({limit: "5mb"}));

app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: ["http://localhost:3000"],
}));

app.use('/api', authRoutes);
app.use('/api', postRoutes);



app.listen(port, () =>console.log(`Server is running o nport ${port}`))

