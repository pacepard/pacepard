import app from "./configs/app.config";
import colors from "colors";

const PORT = process.env.PORT as string;

const connect = async (): Promise<void> => {};

connect();



const server = app.listen(PORT, () => {
  console.log(colors.bold.yellow(`Pacepard server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
});

process.on("unhandledRejection", (err: any, promise) => {
    console.log(colors.bold.red(`Error: ${err.message}`));
    server.close(() => process.exit(1));
});
  
process.on("SIGINT", async () => {
    server.close(() => process.exit(0));
});
  