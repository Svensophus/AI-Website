import { createApp, upload } from "./config.js";

const app = createApp({
  user: "bold_thunder_9261",
  host: "bbz.cloud",
  database: "bold_thunder_9261",
  password: "0e071ded3d39bf876ae928defc206b72",
  port: 30211,
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.get("/", async function (req, res) {
  const posts = await app.locals.pool.query(
    "SELECT * FROM beitrag WHERE account_id = $1",
    [req.session.accountid]
  );
  const beitrag = await app.locals.pool.query("select * from beitrag");
  res.render("start", { beitrag: beitrag.rows });
});

app.get("/new_post", async function (req, res) {
  if (!req.session.accountid) {
    res.redirect("/login");
    return;
  }
  res.render("new_post", {});
});

app.post("/create_post", upload.single("image"), async function (req, res) {
  if (!req.session.accountid) {
    res.redirect("/login");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO beitrag (name, text, bild, account_id, beschreibung) VALUES ($1, $2, $3, $4, $5)",
    [
      req.body.name,
      req.body.text,
      req.file.filename,
      req.session.accountid,
      req.body.beschreibung,
    ]
  );
  res.redirect("/");
});
app.post("/beitrag_save/:id", async function (req, res) {
  if (!req.session.accountid) {
    res.redirect("/login");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO beitrag_save (beitrag_id, account_id) VALUES ($1, $2)",
    [req.params.id, req.session.accountid]
  );
  res.redirect("/");
});

app.get("/save", async function (req, res) {
  const posts = await app.locals.pool.query(
    "SELECT * FROM beitrag_save WHERE account_id = $1",
    [req.session.accountid]
  );

  const beitrag = await app.locals.pool.query("select * from beitrag");
  res.render("save", { beitrag: beitrag.rows });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
