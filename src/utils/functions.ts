import axios from "axios";
import dotenv from "dotenv";
import cloudinary from "../services/cloudinary";
dotenv.config();

//function to set gender according to the user's name
export const getGender = async (name: string) => {
  try {
    const response = await axios.get(
      `https://gender-api.com/get?name=${name}&key=${process.env.GENDER_API_KEY}`
    );

    return response.data.gender;
  } catch (error) {
    return "unknown";
  }
};

// function for fetching image according to the user's gender
export const getProfileImages = async (gender: string) => {
  try {
    // fetching image according to the user's gender

    const response = await cloudinary.api.resources({
      type: "upload",
      prefix: `e-com/images/${gender}`,
    });
    //destructing the response body for secure url
    return await response.resources[
      Math.floor(Math.random() * response.resources.length)
    ].secure_url;
  } catch (error) {
    return "https://pbs.twimg.com/media/FGCpQkBXMAIqA6d?format=jpg&name=large";
  }
};

// function for getting days time in seconds
export const getTimeInDays = (days: number) => {
  var today = new Date();
  var resultDate = new Date(today);
  resultDate.setDate(today.getDate() + days);
  return resultDate;
};

//function for getting the current day's Date in dd-mm-yyyy format
export const getCurrentDate = () => {
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let fullDate = `${day}-${month}-${year}`;
  return fullDate;
};
