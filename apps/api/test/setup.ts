import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import agendaMock from "./mocks/agenda.mock";

jest.mock("../config", () => ({
  default: {
    DATABASE: "mongodb://localhost:27017/test",
    DATABASE_PASSWORD: "password",
  },
}));

jest.mock("./../src/services/email.service", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock("./../src/services/jobs.service", () => ({}));

jest.mock("./../src/jobs/scheduler/email.scheduler", () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  resendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendLoginVerification: jest.fn().mockResolvedValue(true),
  sendPasswordReset: jest.fn().mockResolvedValue(true),
  sendUsAMessage: jest.fn().mockResolvedValue(true),
}));

let mongo: MongoMemoryServer;

// this function runs before all of our tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  const mongoUri = await mongo.getUri();

  await mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);

  agendaMock.schedule();
});

// this function runs before each of our test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    // reset all of our data
    await collection.deleteMany({});
  }
});

// runs after we finish all of our tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});