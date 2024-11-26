import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bcrypt from "bcrypt";
export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.locals.pool = pool;

  app.get("/register", function (req, res) {
    res.render("register");
  });

  app.post("/register", async function (req, res) {
    var password = bcrypt.hashSync(req.body.password, 10);
    var age = req.body.age;
    const existing = await pool.query("SELECT * FROM account WHERE name = $1", [
      req.body.name,
    ]);
    if (existing.rows.length > 0) {
      res.render("register", {
        messageregister: "Dieser Benutzer existiert schon.",
      });
      return;
    }
    pool.query(
      "INSERT INTO account (name, password, age) VALUES ($1, $2, $3)",
      [req.body.name, password, age],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/login");
      }
    );
  });

  app.get("/login", function (req, res) {
    res.render("login");
  });

  app.post("/login", function (req, res) {
    pool.query(
      "SELECT * FROM account WHERE name = $1",
      [req.body.name],
      (error, result) => {
        if (error) {
          console.log(error);
        }
        if (
          result.rows[0] &&
          bcrypt.compareSync(req.body.password, result.rows[0].password)
        ) {
          req.session.accountid = result.rows[0].id;
          res.redirect("/");
        } else {
          res.render("login", {
            message: "Falscher Benutzername oder falsches Passwort.",
          });
        }
      }
    );
  });

  return app;
}

export { upload };
