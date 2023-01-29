import BankId from "bankid";
import { Router } from "express";

const publicRouter = Router();
const privateRouter = Router();

const client = new BankId.BankIdClient();

publicRouter.post("/auth", async (req, res) => {
  const { personalNumber } = req.body;

  try {
    const { orderRef, autoStartToken } = await client.authenticate({
      personalNumber,
      endUserIp: "127.0.0.1",
    });

    res.status(200).json({ orderRef, autoStartToken });
  } catch (err) {
    res.status(403).json({ error: err.details });
  }
});

publicRouter.post("/collect", (req, res) => {
  const { orderRef } = req.body;

  const timer = setInterval(async () => {
    try {
      const {
        status,
        hintCode,
        completionData: { user: { name } = {} } = {},
      } = await client.collect({ orderRef });
      console.log("collecting...");
      if (status === "complete") {
        clearInterval(timer);

        req.session.authenticated = true;
        req.session.name = name;

        res.status(200).json({ url: "/" });
      } else if (status === "failed") {
        throw new Error(hintCode);
      }
    } catch (err) {
      clearInterval(timer);

      console.error(err);
      res.status(403).json({ error: err.details });
    }
  }, 2000);
});

privateRouter.post("/logout", async (req, res) => {
  await req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }

    res.redirect("/login");
  });
});

export default {
  publicRouter,
  privateRouter,
};
