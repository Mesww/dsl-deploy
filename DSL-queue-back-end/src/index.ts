import express from "express";
import "dotenv/config";
import { jwtValidate } from "./middleware/jwt.middleware";
import cookie from "cookie-parser";
import session from "express-session";
import { resetQueueOrder } from "./service/queueRepository";

const path = require("path");
const cors = require("cors");
const passport = require("passport");

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const queueRouter = require("./routes/queue.route");
const historyRouter = require("./routes/history.route");

const port = parseInt(process.env.PORT!) || 7777;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookie());

process.env.TZ = "Asia/Bangkok";
console.log(new Date().toLocaleString());

ringout();

// jwtValidate
app.use("/users", userRouter);
app.use("/login", authRouter);
app.use("/queue", queueRouter);
app.use("/history", historyRouter);

app.listen(port, function () {
  console.log("Server is ready at ", port);
});

async function ringout() {
  setInterval(async () => {
    const now = new Date();
    console.log(`${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`);
    if (
      now.getHours() === 21 &&
      now.getMinutes() === 59 &&
      now.getSeconds() === 0
    ) {
      console.log("Resetting queue order...");
      await resetQueueOrder();
    }
  }, 60000); // ตรวจสอบทุกๆ 1 ชั่วโมง (3600000 มิลลิวินาที)
}
