import { Router, Request, Response } from "express";
import { CSVParser } from "../utils/parser";
import { Manipulator } from "../utils/manipulate";
import path from "path";

const router: Router = Router();
const stationCSVKeys = ["Station code", "Station name(district)"];
const summaryCSVKeys = ["Measurement date", "Station code", "SO2", "NO2", "O3", "CO"];

/* GET home page. */
router.get("/", async (req: Request, res: Response) => {
    
    const csvParser = new CSVParser(path.join(__dirname, "..", "input"));
    const stationData : any = await csvParser.parseCSV("Measurement_station_info.csv", true, stationCSVKeys);
    const summaryData: any = await csvParser.parseCSV(
        "Measurement_summary.csv",
        true,
        summaryCSVKeys
    );
    const manipulator = new Manipulator();
    const aggrSumData = manipulator.mergeJSONArr(summaryData,"Measurement date");
    const aggrLargeSumData = manipulator.mergeJSONArrayLarge(summaryData,"Station code","Measurement date");
    
    res.render("index", {
        title: "Air Pollution Data Analysis - Seoul",
        summaryData: JSON.stringify(aggrSumData),
        stationData: JSON.stringify(stationData),
        summaryAllData: JSON.stringify(aggrLargeSumData),
    });
});

export { router as indexRouter };
