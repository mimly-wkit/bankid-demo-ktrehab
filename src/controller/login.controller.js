import { Router } from "express";
import { readFile, resolvePublicPath } from "../util.js";

const publicRouter = Router();

publicRouter.get("/login", async (req, res) => {
  console.log(req.body);

  const htmlDoc = await readFile(resolvePublicPath("login.html"));

  res.status(200).send(htmlDoc);
});

export default {
  publicRouter,
};
