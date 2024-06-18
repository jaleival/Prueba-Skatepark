import express from "express";
import router from "./src/routes/userRoutes.js";
import path from "path";
import { engine } from "express-handlebars";
import fileUpload from "express-fileupload";
process.loadEnvFile();
const app = express();
const PORT = process.env.PORT || 3033;
const __dirname = path.resolve();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

app.use(
  fileUpload({
    limits: 5000000,
    abortOnLimit: true,
    responseOnLimit: "La imagen es demasiado grande. Máximo 5MB",
  })
);

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutDir: path.join(__dirname, "/src/views/layout"),
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(PORT, () =>
  console.log(`🔥Servidor corriendo en el puerto http://localhost:${PORT}`)
);
