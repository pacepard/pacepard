// apps/api/src/server.ts
import app from "./configs/app.config";
import connectDB from "./configs/db.config";
import colors from "colors";
import "dotenv/config";

const PORT = process.env.PORT || "5015";

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(
      colors.bold.yellow(
        `🚀 Pacepard API running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  });

  process.on("unhandledRejection", (err: any) => {
    console.log(colors.bold.red(`Error: ${err.message}`));
    server.close(() => process.exit(1));
  });

  process.on("SIGINT", () => {
    console.log(colors.yellow("\n🛑 Server shutting down..."));
    server.close(() => process.exit(0));
  });
};

startServer();


// import app from "./configs/app.config";
// import colors from "colors";

// const PORT = process.env.PORT as string;

// const connect = async (): Promise<void> => {};

// connect();



// const server = app.listen(PORT, () => {
//   console.log(colors.bold.yellow(`Pacepard server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
// });

// process.on("unhandledRejection", (err: any, promise) => {
//     console.log(colors.bold.red(`Error: ${err.message}`));
//     server.close(() => process.exit(1));
// });
  
// process.on("SIGINT", async () => {
//     server.close(() => process.exit(0));
// });
  
