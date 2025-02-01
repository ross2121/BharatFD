import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisPort ="6379";
const redisHost = "redis.railway.internal";
const redisPassword = "XOnMEqswfIMKOFvcnJyJevaUJUZMaxGz";
// @ts-ignore
const redis = new Redis({
  port: redisPort,
  host: redisHost,
  password: redisPassword,
});  

redis.on("connect", () => {
  console.log("Redis is connected");
});

export default redis;