import { createReadStream } from "fs";
import path from "path";
import { pick } from "lodash"
import Papa from "papaparse";

class CSVParser {
    dirPath : string

    constructor(dirPath: string) {
        this.dirPath = dirPath;
    }

    parseCSV(filename : string, dynamicTypingOn : boolean, colModel : string[]) {
        const filepath = path.join(this.dirPath, filename);
        const file = createReadStream(filepath);

        return new Promise(resolve => {
            const returnData : any = [];
            Papa.parse(file, {
                skipEmptyLines: true,
                header: true,
                worker: true,
                delimiter: "\n",
                transformHeader(h) {
                    return h.trim();
                },
                error: (error) => {
                    console.log("error while parsing:", error);
                },
                dynamicTyping: dynamicTypingOn,
                step: (results : any) => {
                    results.data = pick(results.data , colModel);
                    if(results.data.hasOwnProperty('Measurement date')){
                        results.data["Measurement date"] = results.data["Measurement date"].split(" ")[0]
                    }
                    // Because we are reading streaming data, we can
                    // never get result as complete function argument
                    // Similarly, for chunk also prefer array.push
                    returnData.push(results.data);
                    return results;
                },
                // For future reference
                // transform : (colName,val) => { // Edit each cells here }
                complete() {
                    resolve(returnData);
                }
            });
        });
	}
}

export { CSVParser };