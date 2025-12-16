import express, { Request, Response, NextFunction} from "express";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import errorHandler from "../middlewares/error.mdw";
import apiRoutes from "../routes/v1/routes.router";




const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.use(cookieParser());

app.use((req: Request, res: Response, next: Function) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use("/api/v1", apiRoutes);

app.use(errorHandler);


export default app;