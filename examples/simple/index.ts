import express from "express";
import CRest from "../../src";
import { object, string } from "cerberus";

const eApp = express();
const app = CRest(eApp);

const person = object({
  firstname: string,
  lastname: string
});

app.get("/profile", { query: person }, (req, res) => {
  console.log(req.query);
  res.send(req.query);
});

app.post("/profile", { query: person }, (req, res) => {
  console.log(req.query);
  res.send(req.query);
});

eApp.listen(8080);
