import express, { Request, Response, NextFunction} from "express";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import errorHandler from "../middlewares/error.mdw";
import apiRoutes from "../routes/v1/routes.router";
import path from "path"
import expressSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import { ENVType } from "../utils/eums.util";

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

app.use(expressSanitize());
app.use(helmet());
app.use(hpp());
app.use(cors({origin: true, credentials: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/v1", apiRoutes);

app.use(errorHandler);


export default app;