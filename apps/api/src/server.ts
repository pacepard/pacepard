import app from './configs/app.config';
import colors from 'colors';
import connectDB from './configs/db.config';
import redisHandler from './middlewares/redis.mdw';
import { REDIS_CONFIG } from './configs/redis.config';
import startWorkers from './tasks/workers/worker';

const PORT = process.env.APP_PORT as string;

const startServer = async (): Promise<void> => {};

// Connect to Database
await connectDB();

//Connect to Redis
await redisHandler.connect(REDIS_CONFIG);

// Start Workers
await startWorkers();

startServer();

const server = app.listen(PORT, () => {
    console.log(
        colors.bold.yellow(
            `Pacepard server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
        ),
    );
});

process.on('unhandledRejection', (err: any) => {
    console.log(colors.bold.red(`Server Error: ${err.message}`));
    server.close(() => process.exit(1));
});

process.on('SIGINT', async () => {
    console.log(colors.yellow('Server shutting down...'));
    server.close(() => process.exit(0));
});
