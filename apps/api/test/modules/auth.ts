import request from "supertest";
import { faker } from "@faker-js/faker";
import User from "../src/features/profile/user.model";
import app from "../app";
import { log } from "console";

const baseUrl = "/api/v1/auth";

export const adminToken = async () => {
  const data = {
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    isVerified: true,
    role: "admin",
    lastDeviceLogin: {
      device: "desktop",
      browser: "chrome",
      os: "windows",
    },
  };

  // create new user
  await User.create(data);

  // login user
  const res = await request(app)
    .post(`${baseUrl}/login`)
    .set("User-Agent", faker.internet.userAgent())
    .send({
      email: data.email,
      password: data.password,
    });

  // get token
  const { token } = res.body;

  log("Admin token:", token);
  // return token
  return token;
};

export const userToken = async () => {
  const data = {
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    isVerified: true,
    role: "user",
    lastDeviceLogin: {
      device: "desktop",
      browser: "chrome",
      os: "windows",
    },
  };

  // create new user
  await User.create(data);

  // login user
  const res = await request(app)
    .post("/api/v1/auth/login")
    .set("User-Agent", faker.internet.userAgent())
    .send({
      email: data.email,
      password: data.password,
    });

  // get token
  const { token } = res.body;

  // return token
  return token;
};