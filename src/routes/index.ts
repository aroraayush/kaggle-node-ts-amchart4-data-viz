import { Router, Request, Response } from "express";
const router: Router = Router();

/* GET home page. */
router.get("/", async (req: Request, res: Response) => {

    res.render("index", {
        title: "Air Pollution Data Analysis - Seoul",
        summaryData: JSON.stringify(req.app.locals.aggrSumData),
        stationData: JSON.stringify(req.app.locals.stationData),
        summaryAllData: JSON.stringify(req.app.locals.aggrLargeSumData),
    });
});

export { router as indexRouter };
