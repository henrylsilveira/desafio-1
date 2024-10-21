import { parse } from 'csv-parse';
import fs from "node:fs";

const csvFile = new URL("./desagio01nodejs.csv", import.meta.url);
const stream = fs.createReadStream(csvFile);

const csvFileParse = parse({
    delimiter: ",",
    skipEmptyLines: true,
    fromLine: 2, // skip the header line
});


const runImportCSV =async () => {
    // Initialise the parser by generating random records
    const linesParse = stream.pipe(csvFileParse);

    for await (const line of linesParse) {
        const [title, description] = line;
        console.log(title, description);
        await fetch("http://localhost:3333/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                description,
            }),
        }).then(() => {
            console.log("Task created!");
        });
    }
};

runImportCSV();