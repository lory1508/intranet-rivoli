import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

// Load environment variables
import "./loadEnvironment.mjs";

// routers
import routes from './routes/index.mjs'

// settings
import { PORT } from "./utils/constants.mjs";

const app = express();

app.use(express.json());
app.use(cors())
app.use(cookieParser())
app.use(routes)

const SET_PORT = PORT || 3000;

app.get("/", (req, res) => {
  res.cookie('hello', 'bitch', { maxAge: 60000 * 60 * 2})
  res.sendStatus(201);
});

app.listen(SET_PORT, () => {
  console.log(`Running on port ${SET_PORT}`);
});
 