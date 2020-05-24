import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
// import https from "https";
import { indexRouter } from "./routes/index";
import exphbs from "express-handlebars";
require("dotenv").config();

const hbs: Exphbs = exphbs.create({defaultLayout: 'main'});
const app: Application = express();

app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public')))
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use("/", indexRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    const err : Error = new Error('Not Found')
    res.status(404)
    next(err);
});

app.use((err : Error, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(500)
    res.render('error')
});

// const httpsServer = https.createServer({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// }, app);

// httpsServer.listen(process.env.PORT, () => {
//   console.log(`HTTPS Server running on port ${process.env.PORT}`);
// });

app.listen(process.env.PORT, () =>
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
);