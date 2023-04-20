import * as fs from "fs";
import * as path from "path";
import {app} from "electron";
import {Content} from "../shared/types/types";

const userDataPath = app.getPath("userData");
const savedDataPath = path.join(userDataPath, "savedData.json");

export function loadData(): Content[] {
    if (!fs.existsSync(savedDataPath)) {
        fs.writeFileSync(savedDataPath, JSON.stringify({data: []}, null, 2));
    }
    const rawData = fs.readFileSync(savedDataPath, "utf-8");
    const parsedData = JSON.parse(rawData);
    return parsedData.data || [];
}

export function saveSelectedText(newData: Content): {success: boolean; data?: any; error?: string} {
    try {
        if (!fs.existsSync(savedDataPath)) {
            fs.writeFileSync(savedDataPath, JSON.stringify({data: []}, null, 2));
        }

        const rawData = fs.readFileSync(savedDataPath, "utf-8");
        const parsedData = JSON.parse(rawData);

        if (!Array.isArray(parsedData.data)) {
            throw new Error("Invalid savedData.json format");
        }

        if (
            !newData.title ||
            !newData.url ||
            !newData.text ||
            typeof newData.title !== "string" ||
            typeof newData.url !== "string" ||
            typeof newData.text !== "string"
        ) {
            const errorMessage = `Invalid data: ${
                !newData.title ? "title" : !newData.url ? "url" : "text"
            } is not a string`;
            throw new Error(errorMessage);
        }

        parsedData.data.push(newData);

        fs.writeFileSync(savedDataPath, JSON.stringify(parsedData, null, 2));
        return {success: true, data: newData};
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error while saving data:", error);
            return {success: false, error: error.message};
        }
        return {success: false, error: "Unknown error occurred"};
    }
}
