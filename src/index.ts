import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import path from "path";
import cors from "cors";
import { indexRouter } from "./routes/index";
import exphbs from "express-handlebars";
import dotenv from "dotenv";

dotenv.config();

const hbs: Exphbs = exphbs.create({defaultLayout: 'main'});
const app: Application = express();

/* ---------------------- CSV Parsing Code - Start ---------------------- */

import { Manipulator } from "./utils/manipulate";
import { CSVParser } from "./utils/parser";
const csvParser = new CSVParser(path.join(__dirname, "input"));

const stationCSVKeys = ["Station code", "Station name(district)"];
const summaryCSVKeys = ["Measurement date", "Station code", "SO2", "NO2", "O3", "CO"];


const dataPromise = (async () =>{
    const stationData = await csvParser.parseCSV("Measurement_station_info.csv", true, stationCSVKeys);
    const summaryData: any = await csvParser.parseCSV(
        "Measurement_summary.csv",
        true,
        summaryCSVKeys
    );
    const manipulator = new Manipulator();
    const aggrSumData = manipulator.mergeJSONArr(summaryData,"Measurement date");
    const aggrLargeSumData = manipulator.mergeJSONArrayLarge(summaryData,"Station code","Measurement date");
    app.locals.stationData = stationData
    return {stationData, aggrSumData, aggrLargeSumData}
})()

dataPromise
.then(result=> {
  app.locals.stationData = result.stationData;
  app.locals.aggrSumData = result.aggrSumData;
  app.locals.aggrLargeSumData = result.aggrLargeSumData
})

/* ---------------------- CSV Parsing Code - End ---------------------- */


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

app.listen(process.env.PORT, () =>
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
);