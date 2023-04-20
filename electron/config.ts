import dotenv from "dotenv";
dotenv.config();

const apiUrl = process.env.API_URL || "http://localhost:3000";

export default {
    apiUrl
};
