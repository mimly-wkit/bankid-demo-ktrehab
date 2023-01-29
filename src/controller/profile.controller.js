import { Router } from "express";
import { readFile, resolvePublicPath } from "../util.js";

const privateRouter = Router();

privateRouter.get("/", async (req, res) => {
  const htmlDoc = (await readFile(resolvePublicPath("index.html"))).replace(
    "$name$",
    `${req.session.name}`
  );

  res.status(200).send(htmlDoc);
});

export default {
  privateRouter,
};
