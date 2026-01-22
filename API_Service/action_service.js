const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const commonUtils = require("../utility/common_utils");
const projectStatus = require("../utility/update_project_status");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

// Fetch App level States
async function fetchGlobalAction(project_Id = 0) {
  let subProjectPath = project_Id;
  let filePath = `${reactProjectPath}/${subProjectPath}/jsons/action.json`;
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/app/get-global-state`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      cms_project_Id: project_Id,
    },
  };

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );
    await appStates(filePath);
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

// Fetch Page level States
async function fetchPageAction(project_Id = 0, page_id = 0, fileName = "") {
  let subProjectPath = project_Id;
  let filePath = `${reactProjectPath}/${subProjectPath}/jsons/action_${page_id}.json`;
  //console.log('filePath', filePath)
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/app/get-page-action-flow-new`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      project_id: project_Id,
      page_id: page_id,
    },
  };

  try {
    const startTime = performance.now();
    const response = await axios.post(apiUrl, requestBody, { headers });
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    console.log(`fetchPageAction: ${fileName}`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);

    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );

    await projectStatus.updateProjectStatus(
      project_Id,
      commonUtils.platform,
      "processing"
    );
    return "success";
  } catch (error) {
    console.error("API Error in fetchPageJson:", error);
    return "failure";
  }
}

module.exports = {
  fetchGlobalAction,
  fetchPageAction,
};
