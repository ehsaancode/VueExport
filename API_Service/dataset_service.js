const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

async function fetchDataset(requestId = 0, dataSetId = 0) {
  try {
    let apiUrl = `https://sankar.kuickapi.nodejs.redoq.host/api/dataset/request/${requestId}`;
    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false, // Bypass SSL certificate validation
      }),
      timeout: 10000, // 10 second timeout
    });
    // console.log('response?.data', response?.data)
    return (await getDatasetById(response?.data ?? {}, dataSetId)) ?? {};
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

async function getDatasetById(data, apiDataId) {
  // Check if data exists and has the expected structure
  if (!data || typeof data !== "object") {
    throw new Error("Invalid data: data is not an object");
  }

  if (!data.data) {
    throw new Error("Invalid data: data.data is undefined");
  }

  if (!Array.isArray(data.data)) {
    console.error("data.data is not an array. Actual type:", typeof data.data);
    console.error("data.data value:", data.data);
    return null; // or throw an error
  }
  return data.data.find((item) => `${item.api_data_Id}` === `${apiDataId}`);
}

module.exports = {
  fetchDataset,
};
