import path from "path";
import {
  addSkater,
  getSkater,
  logInQuery,
  updateSkater,
  deleteSkater,
  adminSkaters,
  adminUpdateSkater,
} from "../../queries/userQueries.js";
import jwt from "jsonwebtoken";
const __dirname = path.resolve();
process.loadEnvFile();
const secretKey = process.env.SECRET_KEY;

const homePage = (req, res) => {
  res.render("Home");
};

const register = (req, res) => {
  res.render("Registro");
};


const addskaterController = async (req, res) => {
  const { email, nombre, password, anos_experiencia, especialidad } = req.body;
  const skater = { email, nombre, password, anos_experiencia, especialidad };
  const { files } = req;
  const { foto } = files;
  const { name } = foto;
  const pathPhoto = `/uploads/${name}`;
  foto.mv(`${__dirname}/public${pathPhoto}`, async (err) => {
    try {
      if (err) throw err;
      skater.foto = pathPhoto;
      await addSkater(skater);
      res.status(201).redirect("/login");
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
};

const getSkaterController = async (req, res) => {
  const skaters = await getSkater();
  res.render("Home", { skaters });
};

const loginController = async (req, res) => {
  res.render("Login");
};

const logController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await logInQuery(email, password);
    if (result.length === 0) {
      throw new Error("Correo electrónico o contraseña incorrectos");
    }
    const user = result[0];
    const token = jwt.sign({ user }, secretKey, { expiresIn: "5m" });
    res.status(200).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const profileUpdate = async (req, res) => {
  try {
    const token = req.query.token;
    const decodedToken = jwt.verify(token, secretKey);
    const user = decodedToken.user;
    res.render("Perfil", { user });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSkater(id);
    res.status(200).send("Usuario eliminado con éxito");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, password, años_experiencia, especialidad } = req.body;
    const updatedFields = { nombre, password, años_experiencia, especialidad };
    await updateSkater(id, updatedFields);
    res.status(200).json({ message: "Datos actualizados" });
  } catch (error) {
    console.error("Error en updateProfile:", error);
    res.status(500).send(error.message);
  }
};

const updateStatus = async (req, res) => {
  try {
    const skaters = await adminSkaters();
    res.render("Admin", { skaters });
  } catch (error) {
    console.error("Error en GET /admin:", error);
    res.status(500).send(error.message);
  }
};

const updateSkaterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const updatedEstado = await adminUpdateSkater(id, estado);
    res
      .status(200)
      .json({ message: "Update successful", estado: updatedEstado });
  } catch (error) {
    console.error("Error en updateSkaterStatus:", error);
    res.status(500).send({ message: error.message });
  }
};

//ruta generica
const rutaGenerica = (req, res) => {
  res.status(404);
  res.send(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">

      <title>404 - Página no encontrada</title>
      </head>
      <body>
        <div class="container">
          <div class="row justify-content-center align-items-center" style="height: 100vh;">
            <div class="col-6 text-center">
              <h1 class="display-1">404</h1>
              <h2>Página no encontrada</h2>
              <p class="lead">Lo sentimos, la página que estás buscando no existe.</p>
              <a href="/" class="btn btn-primary">Volver a la página principal</a>
            </div>
          </div>
        </div>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
      </body>
    </html>
  `);
};

export {
  homePage,
  register,
  addskaterController,
  loginController,
  getSkaterController,
  logController,
  profileUpdate,
  updateProfile,
  deleteAccount,
  updateStatus,
  updateSkaterStatus,
  rutaGenerica,
};
