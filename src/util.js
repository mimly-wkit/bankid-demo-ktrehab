import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const assetsPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "assets"
);

const publicPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public"
);

const resolvePublicPath = (path) => join(publicPath, path);

const readFile = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

export { readFile, assetsPath, publicPath, resolvePublicPath };
