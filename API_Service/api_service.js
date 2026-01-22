const commonUtils = require("../utility/common_utils");
const projectStatus = require("../utility/update_project_status");
const commonPath = require("../utility/common_path");
const readWriteFile = require("../utility/read_write_file");
const axios = require("axios");
const path = require("path");

const reactProjectPath = path.resolve(
  __dirname,
  `${commonPath.reactProjectPath.get(commonPath.environmentHosting)}`
);

async function fetchPageJson(
  page,
  slug,
  windowDevice,
  project_Id = 0,
  page_Id = 0,
  dimension,
  environment,
  filePath = ""
) {
  filePath = filePath + `/${slug}_${windowDevice}.json`;
  if (commonPath.environment === "Showcase") {
    const apiUrl = `${commonPath.BaseUrl.get(
      commonPath.environment
    )}redoqcms/getpublisheddesign`;
    const headers = {
      "Content-Type": "application/json",
      Scene: 1,
    };
    const requestBody = {
      inputData: {
        project_id: project_Id,
        formData: {
          device:
            windowDevice === "D"
              ? "desktop"
              : windowDevice === "T"
              ? "tablet"
              : "mobile",
          project_id: project_Id,
          pageId: page_Id,
          versionId: "0",
        },
      },
    };

    try {
      const startTime = performance.now();
      const response = await axios.post(apiUrl, requestBody, { headers });
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      console.log(`fetchPageJson:`);
      console.log(`filePath: ${filePath}`);
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
  } else {
    const apiUrl = `${commonPath.BaseUrl.get(
      environment
    )}redoqcms/cms/pagecontent`;
    const wrl = `https://${project_Id}.${commonPath.wrl.get(environment)}`;
    const headers = {
      "Content-Type": "application/json",
      wrl: wrl,
    };
    const requestBody = {
      inputData: {
        page: page,
        slug: slug,
        windowDevice: windowDevice,
        project_Id: project_Id,
        page_Id: page_Id,
        dimension: dimension,
      },
    };

    try {
      const response = await axios.post(apiUrl, requestBody, { headers });
      await readWriteFile.deleteFile(filePath);
      await readWriteFile.writeToFile(
        filePath,
        JSON.stringify(response.data, null, 2)
      );
      return "success";
    } catch (error) {
      console.error("API Error in fetchPageJson:", error);
      return "failure";
    }
  }
}

async function fetchDefaultJson(project_Id = 0, environment) {
  let filePath = "./created_files/pages/default.json";
  await readWriteFile.deleteFile(filePath);

  const apiUrl = `${commonPath.BaseUrl.get(environment)}redoqcms/cms/basicdata`;
  const wrl = `https://${project_Id}.${commonPath.wrl.get(environment)}`;
  const headers = {
    "Content-Type": "application/json",
    wrl: wrl,
  };
  const requestBody = {
    inputData: {
      windowDevice: "D",
      project_Id: project_Id,
    },
  };

  try {
    const response = await axios.post(apiUrl, requestBody, { headers });
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );
    return "success";
  } catch (error) {
    console.error("API Error in fetchDefaultJson:", error);
    return "failure";
  }
}

async function fetchProjectInfo(project_Id = 0, filePath = "") {
  filePath = filePath + `/project_info.json`;
  // const apiUrl = `${commonPath.projectInfoUrl}`;
  const apiUrl = `${commonPath.BaseUrl.get(
    commonPath.environment
  )}redoqcms/page-slug`;
  const headers = {
    "Content-Type": "application/json",
  };
  const requestBody = {
    inputData: {
      cms_project_Id: project_Id,
    },
  };

  try {
    const startTime = performance.now();
    const response = await axios.post(apiUrl, requestBody, { headers });
    const endTime = performance.now();
    const responseTime = endTime - startTime;

    console.log(`fetchProjectInfo:`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`API Response Time: ${responseTime.toFixed(2)}ms`);

    await readWriteFile.deleteFile(filePath);
    await readWriteFile.writeToFile(
      filePath,
      JSON.stringify(response.data, null, 2)
    );

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
  fetchPageJson,
  fetchDefaultJson,
  fetchProjectInfo,
};
