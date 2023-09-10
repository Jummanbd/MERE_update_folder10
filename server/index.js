import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from "helmet";
import mongoose from 'mongoose';
import morgan from "morgan";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { Post, register } from './controllers/auth.js';
import authRoutes from "./routes/auth.js";
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors('http://localhost:8080'));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.get("/", (req, res) =>{
  res.json("Hello")
} )
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
 
// Router 
app.post("/api/register",upload.single("picture"), register );
 app.post('/api/post', upload.single("picture"),Post);
app.use("/api", authRoutes);
const PORT = 8080
mongoose
  .connect('mongodb+srv://vercel_myproject:vercel_myproject@cluster0.if7p4vv.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
