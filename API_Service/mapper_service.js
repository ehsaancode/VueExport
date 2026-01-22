const commonUtils = require("../utility/common_utils");
const projectStatus = require("../utility/update_project_status");
const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function fetchMapperJson(
  project_Id = 0,
  page_id = 0,
  filePath = "",
  windowDevice = "D"
) {
  filePath = filePath + `/mapper_${page_id}.json`;
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/app/get-mapper`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      project_id: project_Id,
      page_id: page_id,
      device: windowDevice === "D" ? "desktop" : "mobile",
    },
  };

  try {
    const startTime = performance.now();
    const response = await axios.post(apiUrl, requestBody, { headers });
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    console.log(`fetchMapperJson:`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);

    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );
    //     await createThemeCssFile(filePath, project_Id);
    /*await projectStatus.updateProjectStatus(
      project_Id,
      commonUtils.platform,
      "processing"
    );*/
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

module.exports = {
  fetchMapperJson,
};
