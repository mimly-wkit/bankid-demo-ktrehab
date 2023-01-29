import betterLogging from "better-logging";
import express from "express";
import expressSession from "express-session";
import AuthenticationController from "./controller/auth.controller.js";
import ProfileController from "./controller/profile.controller.js";
import LoginController from "./controller/login.controller.js";
import { assetsPath } from "./util.js";

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

// Enable debug output.
console.logLevel = 4;

const port = 8989;
const app = express();

// Enhance log messages with timestamps etc.
app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Configure session management
app.use(
  expressSession({
    secret: "Super secret! Shh! Do not tell anyone...",
    resave: true,
    saveUninitialized: true,
  })
);

// Serve static files
app.use(express.static(assetsPath));

const requireAuth = (req, res, next) => {
  const { authenticated } = req.session;
  if (authenticated !== true) {
    res.redirect("/login");
    return;
  }

  next();
};

app.use("/api", AuthenticationController.publicRouter);
app.use("/api", requireAuth, AuthenticationController.privateRouter);

app.use("/", LoginController.publicRouter);
app.use("/", requireAuth, ProfileController.privateRouter);

app.listen(port, () => {
  console.info(`Listening on http://localhost:${port}`);
});
