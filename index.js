import { createApp } from "./config.js";

const app = createApp({
  user: "bold_thunder_9261",
  host: "bbz.cloud",
  database: "demo",
  password: "0e071ded3d39bf876ae928defc206b72",
  port: 30211,
});

app.get("/overview", async function (req, res) {
  const beitrag = await app.locals.pool.query("select * from beitrag");
  res.render("overview", { beitrag: beitrag.rows });
});

app.get("/overview", async function (req, res) {
  const account = await app.locals.pool.query("select * from account");
  res.render("overview", { account: account.rows });
});
/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
