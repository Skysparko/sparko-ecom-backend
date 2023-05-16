"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDate = exports.getTimeInDays = exports.getProfileImages = exports.getGender = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("../services/cloudinary"));
dotenv_1.default.config();
//function to set gender according to the user's name
const getGender = async (name) => {
    try {
        const response = await axios_1.default.get(`https://gender-api.com/get?name=${name}&key=${process.env.GENDER_API_KEY}`);
        return response.data.gender;
    }
    catch (error) {
        return "unknown";
    }
};
exports.getGender = getGender;
// function for fetching image according to the user's gender
const getProfileImages = async (gender) => {
    try {
        // fetching image according to the user's gender
        const response = await cloudinary_1.default.api.resources({
            type: "upload",
            prefix: `e-com/images/${gender}`,
        });
        //destructing the response body for secure url
        return await response.resources[Math.floor(Math.random() * response.resources.length)].secure_url;
    }
    catch (error) {
        return "https://pbs.twimg.com/media/FGCpQkBXMAIqA6d?format=jpg&name=large";
    }
};
exports.getProfileImages = getProfileImages;
// function for getting days time in seconds
const getTimeInDays = (days) => {
    var today = new Date();
    var resultDate = new Date(today);
    resultDate.setDate(today.getDate() + days);
    return resultDate;
};
exports.getTimeInDays = getTimeInDays;
//function for getting the current day's Date in dd-mm-yyyy format
const getCurrentDate = () => {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let fullDate = `${day}-${month}-${year}`;
    return fullDate;
};
exports.getCurrentDate = getCurrentDate;
