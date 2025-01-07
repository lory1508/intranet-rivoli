import express from "express";
import cookieParser from "cookie-parser";

// routers
import routes from './routes/index.mjs'

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(routes)

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.cookie('hello', 'bitch', { maxAge: 60000 * 60 * 2})
  res.sendStatus(201);
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
 